#!/usr/bin/env python3
"""Sensor simulator for the Smart Water Quality Monitoring prototype.

Sends readings to the ingestion API using EXACTLY the payload schema the
future ESP32 firmware will use (see docs/ESP32_CONTRACT.md). These are
SIMULATED readings for software testing — they are not real measurements,
and the API stores them under the simulator's device_id, so use a distinct
id (default SIM-001) if you don't want them mixed with a real device.

Stdlib only — no pip installs needed. Start/stop independently of the backend
(Ctrl-C to stop).

Modes:
  random walk (default)  Mean-reverting walk around the dashboard baseline,
                         mirroring src/data/mockData.ts numbers.
  --source-csv FILE      Replay real rows from processed/aqua_clean_full.csv:
                         ph / temperature / dissolved_oxygen / conductivity are
                         REAL dataset values; tds is sent as the file's own
                         tds_derived (0.64 x EC); turbidity is sent as null
                         because the dataset has no turbidity (honest null,
                         not an invented value).

Scenarios (random-walk mode):
  normal          baseline behaviour
  turbidity_spike turbidity climbs to ~9 NTU over ~10 samples, then recovers
  tds_rise        TDS + conductivity climb together (EC x 0.64 = TDS, consistent)
  do_drop         dissolved oxygen falls to ~3.5 mg/L, then recovers
  mixed           cycles through the abnormal scenarios

Examples:
  python simulator.py                                  # normal, every 5 s
  python simulator.py --scenario turbidity_spike --interval 2 --count 30
  python simulator.py --source-csv ../../processed/aqua_clean_full.csv --count 20 --interval 1
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import random
import sys
import time
import urllib.request
from datetime import datetime, timezone

BASELINE = {"ph": 7.22, "turbidity": 3.3, "temperature": 26.6,
            "tds": 316.0, "conductivity": 640.0, "dissolved_oxygen": 6.8}
NOISE = {"ph": 0.03, "turbidity": 0.18, "temperature": 0.12,
         "tds": 4.0, "conductivity": 8.0, "dissolved_oxygen": 0.08}
DECIMALS = {"ph": 2, "turbidity": 2, "temperature": 1,
            "tds": 0, "conductivity": 0, "dissolved_oxygen": 1}


def post(base_url: str, payload: dict) -> tuple[int, str]:
    req = urllib.request.Request(
        f"{base_url.rstrip('/')}/api/v1/readings",
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status, resp.read().decode()[:200]
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:200]
    except Exception as e:  # backend down, etc.
        return 0, str(e)


def scenario_offsets(scenario: str, i: int) -> dict[str, float]:
    """Additive offsets for abnormal scenarios: ramp up 10, hold 10, ramp down 10."""
    phase = i % 30
    ramp = min(phase, 10) / 10 if phase < 20 else max(0, (30 - phase)) / 10
    active = scenario
    if scenario == "mixed":
        active = ["normal", "turbidity_spike", "tds_rise", "do_drop"][(i // 30) % 4]
    if active == "turbidity_spike":
        return {"turbidity": 6.0 * ramp}
    if active == "tds_rise":
        return {"tds": 500 * ramp, "conductivity": 780 * ramp}
    if active == "do_drop":
        return {"dissolved_oxygen": -3.3 * ramp}
    return {}


def random_walk(args) -> None:
    rng = random.Random(args.seed)
    current = dict(BASELINE)
    i = 0
    while args.count == 0 or i < args.count:
        offsets = scenario_offsets(args.scenario, i)
        nxt = {}
        for k, base in BASELINE.items():
            pull = (base - current[k]) * 0.15
            value = current[k] + pull + (rng.random() - 0.5) * 2 * NOISE[k] + offsets.get(k, 0.0)
            nxt[k] = max(0.0, round(value, DECIMALS[k]))
        current = {k: nxt[k] for k in BASELINE}
        payload = {
            "device_id": args.device_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ph": nxt["ph"], "turbidity": nxt["turbidity"],
            "temperature": nxt["temperature"], "tds": nxt["tds"],
            "conductivity": nxt["conductivity"],
            "dissolved_oxygen": nxt["dissolved_oxygen"],
        }
        status, body = post(args.base_url, payload)
        print(f"[{i + 1}] POST -> {status}  ph={nxt['ph']} turb={nxt['turbidity']} "
              f"tds={nxt['tds']} do={nxt['dissolved_oxygen']}  {body if status not in (200, 201) else ''}")
        i += 1
        if args.count == 0 or i < args.count:
            time.sleep(args.interval)


def replay_csv(args) -> None:
    import os

    path = args.source_csv
    if not os.path.exists(path):  # also try relative to the repo root / script dir
        for base in (os.path.dirname(os.path.abspath(__file__)), os.getcwd()):
            for cand in (os.path.join(base, path),
                         os.path.join(base, "..", "..", path),
                         os.path.join(base, "..", "..", "processed", os.path.basename(path))):
                if os.path.exists(cand):
                    path = cand
                    break
            if os.path.exists(path):
                break
    with open(path, newline="") as fh:
        rows = list(csv.DictReader(fh))
    rng = random.Random(args.seed)
    rng.shuffle(rows)
    selected = rows if args.count == 0 else rows[: args.count]
    for i, row in enumerate(selected):
        def num(key):
            try:
                v = float(row[key])
                return v if math.isfinite(v) else None
            except (KeyError, TypeError, ValueError):
                return None
        payload = {
            "device_id": args.device_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "ph": num("ph"), "turbidity": None,  # not in the dataset — honest null
            "temperature": num("temperature"), "tds": num("tds_derived"),
            "conductivity": num("conductivity"),
            "dissolved_oxygen": num("dissolvedOxygen"),
        }
        status, body = post(args.base_url, payload)
        print(f"[{i + 1}/{len(selected)}] station={row.get('station_code')} "
              f"({row.get('state')}) POST -> {status} {body if status not in (200, 201) else ''}")
        if i + 1 < len(selected):
            time.sleep(args.interval)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base-url", default="http://localhost:8000")
    ap.add_argument("--device-id", default="SIM-001",
                    help="use a distinct id so simulated data is never confused with a real device")
    ap.add_argument("--interval", type=float, default=5.0, help="seconds between readings")
    ap.add_argument("--count", type=int, default=0, help="0 = run until Ctrl-C")
    ap.add_argument("--scenario", default="normal",
                    choices=["normal", "turbidity_spike", "tds_rise", "do_drop", "mixed"])
    ap.add_argument("--source-csv", default=None, help="replay rows from aqua_clean_full.csv instead")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()
    print(f"Simulator -> {args.base_url}  device={args.device_id}  "
          f"{'csv replay: ' + args.source_csv if args.source_csv else 'scenario: ' + args.scenario}")
    print("Simulated readings — not real hardware measurements. Ctrl-C to stop.")
    try:
        replay_csv(args) if args.source_csv else random_walk(args)
    except KeyboardInterrupt:
        print("\nStopped.")
        sys.exit(0)


if __name__ == "__main__":
    main()

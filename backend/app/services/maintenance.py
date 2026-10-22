"""Sensor predictive-maintenance indicators (heuristic, not ML).

Computed from the device's recent stored readings. These are *maintenance
indicators* — patterns that in real deployments precede sensor failure or
miscalibration — not predictions of failure and not water-quality results:

- stuck sensor: the same value repeated many times in a row (fouled/dead probe)
- drift: the recent mean has moved far from the older mean (calibration drift
  or a genuine sustained change in the water — a human must judge which)
- missing data: a parameter frequently arriving as null (loose connection,
  failing sensor)
- frequent out-of-range: the probe may be miscalibrated — or the water really
  is out of range; again, an indicator to inspect, not a diagnosis.
"""
from __future__ import annotations

import statistics
from datetime import datetime, timezone

from ..models import SensorReading
from ..thresholds import FRONTEND_KEY, PARAMETERS, parameter_status

WINDOW = 100          # readings considered
RECENT = 10           # "recent" slice for drift comparison
STUCK_RUN = 10        # identical consecutive values => stuck


def _series(readings: list[SensorReading], field: str) -> list[float]:
    return [getattr(r, field) for r in readings if getattr(r, field) is not None]


def _longest_identical_run(values: list[float]) -> int:
    best = run = 1
    for a, b in zip(values, values[1:]):
        run = run + 1 if round(a, 3) == round(b, 3) else 1
        best = max(best, run)
    return best if values else 0


def diagnose(readings: list[SensorReading]) -> dict:
    """readings: newest-first list for one device."""
    total = len(readings)
    sensors = []
    worst = "OK"
    rank = {"OK": 0, "CHECK": 1, "SERVICE": 2}

    for field, cfg in PARAMETERS.items():
        values = list(reversed(_series(readings, field)))  # chronological
        present = len(values)
        missing_pct = round(100.0 * (total - present) / total, 1) if total else 100.0
        reasons: list[str] = []
        health = "OK"

        def escalate(level: str, reason: str):
            nonlocal health
            reasons.append(reason)
            if rank[level] > rank[health]:
                health = level

        if total == 0:
            escalate("CHECK", "No readings stored for this device yet")
        elif present == 0:
            escalate("SERVICE", f"No {cfg['label']} values in the last {total} readings — sensor may be disconnected")
        else:
            run = _longest_identical_run(values[-30:])
            if run >= STUCK_RUN:
                escalate("SERVICE", f"Value unchanged for {run} consecutive readings — possible stuck/fouled sensor")
            if missing_pct >= 50:
                escalate("SERVICE", f"Missing in {missing_pct}% of readings — check connection")
            elif missing_pct >= 20:
                escalate("CHECK", f"Missing in {missing_pct}% of readings")
            if present >= RECENT + 10:
                recent_mean = statistics.fmean(values[-RECENT:])
                older_mean = statistics.fmean(values[:-RECENT])
                width = cfg["max"] - cfg["min"]
                drift = abs(recent_mean - older_mean) / width if width else 0.0
                if drift > 0.25:
                    escalate("CHECK", f"Mean drifted {drift * 100:.0f}% of the configured range width vs earlier readings — possible calibration drift")
            oor = sum(1 for v in values if parameter_status(v, field) != "NORMAL")
            oor_pct = round(100.0 * oor / present, 1)
            if oor_pct >= 30:
                escalate("CHECK", f"Out of configured range in {oor_pct}% of readings — verify calibration and the water source")

        if rank[health] > rank[worst]:
            worst = health
        sensors.append({
            "parameter": FRONTEND_KEY[field],
            "label": cfg["label"],
            "health": health,
            "reasons": reasons,
            "last_value": values[-1] if values else None,
            "present": present,
            "missing_pct": missing_pct,
            "out_of_range_pct": (round(100.0 * sum(
                1 for v in values if parameter_status(v, field) != "NORMAL") / present, 1)
                if present else None),
        })

    last_ts = readings[0].timestamp if readings else None
    age = None
    if last_ts is not None:
        ts = last_ts if last_ts.tzinfo else last_ts.replace(tzinfo=timezone.utc)
        age = round((datetime.now(timezone.utc) - ts).total_seconds(), 1)
    return {
        "overall": worst,
        "window_readings": total,
        "last_reading_age_seconds": age,
        "sensors": sensors,
    }

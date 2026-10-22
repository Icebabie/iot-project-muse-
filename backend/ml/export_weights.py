#!/usr/bin/env python3
"""Export the trained SimpleMLP weights to JSON for NumPy inference.

    python ml/export_weights.py [--pt ../../results/best_model.pt]
                                [--scaler ../../results/scaler.json]
                                [--out ../app/ml_weights.json]
                                [--test ../../processed/aqua_test.csv]

Why: production (free hosting) cannot install PyTorch, but a 4->64->32->3
ReLU MLP is three matrix multiplies — NumPy reproduces it exactly.

How it reads the .pt file without torch: a torch.save zip checkpoint is a
zip containing data.pkl (tensor shapes + which raw storage each tensor uses)
and one raw float32 blob per tensor. This script parses that structure with
a restricted unpickler (only OrderedDict + tensor-rebuild markers are
honoured; nothing is executed). It only ever runs on THIS project's own
artifact, which we trust.

Verification: after exporting, the script evaluates the NumPy model on the
held-out test CSV and prints accuracy / macro-F1. Compare with
results/metrics_per_seed.csv — SimpleMLP seeds scored accuracy 0.686–0.759
there; the exported model must land in that neighbourhood, otherwise the
export is wrong and this script exits non-zero.
"""
from __future__ import annotations

import argparse
import io
import json
import pickle
import struct
import sys
import zipfile
from collections import OrderedDict
from pathlib import Path

import numpy as np
import pandas as pd

EXPECTED = {  # SimpleMLP (4->64->32->3) — anything else means wrong artifact
    "net.0.weight": (64, 4), "net.0.bias": (64,),
    "net.2.weight": (32, 64), "net.2.bias": (32,),
    "net.4.weight": (3, 32), "net.4.bias": (3,),
}


class _RestrictedUnpickler(pickle.Unpickler):
    def persistent_load(self, pid):
        return ("STORAGE", pid)

    def find_class(self, module, name):
        if (module, name) == ("collections", "OrderedDict"):
            return OrderedDict
        if name.startswith("_rebuild_tensor"):
            return lambda storage, offset, size, stride, *r: {
                "storage": storage, "size": tuple(size)}
        if name.startswith("_rebuild"):
            return lambda *a, **k: None

        class _Stub:  # e.g. torch.FloatStorage marker inside persistent ids
            pass

        return _Stub


def read_state_dict(pt_path: Path) -> dict[str, np.ndarray]:
    z = zipfile.ZipFile(pt_path)
    prefix = next(n.rsplit("/data.pkl", 1)[0] for n in z.namelist() if n.endswith("data.pkl"))
    state = _RestrictedUnpickler(io.BytesIO(z.read(f"{prefix}/data.pkl"))).load()
    out: dict[str, np.ndarray] = {}
    for name, spec in state.items():
        (_, (_, _, storage_id, _, numel)) = spec["storage"]
        raw = z.read(f"{prefix}/data/{storage_id}")
        arr = np.frombuffer(raw, dtype="<f4", count=numel).reshape(spec["size"]).copy()
        out[name] = arr
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    here = Path(__file__).resolve()
    ap.add_argument("--pt", default=str(here.parents[2] / "results" / "best_model.pt"))
    ap.add_argument("--scaler", default=str(here.parents[2] / "results" / "scaler.json"))
    ap.add_argument("--out", default=str(here.parent.parent / "app" / "ml_weights.json"))
    ap.add_argument("--test", default=str(here.parents[2] / "processed" / "aqua_test.csv"))
    args = ap.parse_args()

    state = read_state_dict(Path(args.pt))
    for name, shape in EXPECTED.items():
        if name not in state or state[name].shape != shape:
            sys.exit(f"unexpected tensor {name}: {state.get(name, None)}")
    scaler = json.loads(Path(args.scaler).read_text())
    if scaler["model"] != "SimpleMLP":
        sys.exit(f"scaler says model is {scaler['model']}, not SimpleMLP")

    layers = []
    for w, b in (("net.0.weight", "net.0.bias"), ("net.2.weight", "net.2.bias"),
                 ("net.4.weight", "net.4.bias")):
        layers.append({"weight": state[w].tolist(), "bias": state[b].tolist()})
    payload = {
        "model": "SimpleMLP", "features": scaler["features"], "classes": scaler["classes"],
        "scaler_mean": scaler["mean"], "scaler_std": scaler["std"], "layers": layers,
        "source": "results/best_model.pt exported by backend/ml/export_weights.py",
    }
    Path(args.out).write_text(json.dumps(payload))
    print(f"wrote {args.out}")

    # --- verification on the held-out test set ---
    df = pd.read_csv(args.test).dropna(subset=["cpcb_tier"])
    feats = scaler["features"]
    X = df[feats].values.astype(np.float64)
    X = (X - np.array(scaler["mean"])) / np.array(scaler["std"])
    h = X
    for i, layer in enumerate(layers):
        h = h @ np.array(layer["weight"]).T + np.array(layer["bias"])
        if i < len(layers) - 1:
            h = np.maximum(h, 0.0)
    pred = np.array(scaler["classes"])[h.argmax(axis=1)]
    y = df["cpcb_tier"].values
    acc = float((pred == y).mean())
    f1s = []
    for c in scaler["classes"]:
        tp = int(((pred == c) & (y == c)).sum())
        fp = int(((pred == c) & (y != c)).sum())
        fn = int(((pred != c) & (y == c)).sum())
        prec = tp / (tp + fp) if tp + fp else 0.0
        rec = tp / (tp + fn) if tp + fn else 0.0
        f1s.append(2 * prec * rec / (prec + rec) if prec + rec else 0.0)
    print(f"NumPy export on held-out test (n={len(y)}): accuracy={acc:.3f} "
          f"macro-F1={np.mean(f1s):.3f}  (training seeds: acc 0.686-0.759, macro-F1 0.704-0.793)")
    if not (0.60 <= acc <= 0.85):
        sys.exit("accuracy outside the plausible band — export is probably wrong")


if __name__ == "__main__":
    main()

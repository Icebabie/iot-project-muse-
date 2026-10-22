#!/usr/bin/env python3
"""Train an Isolation Forest anomaly detector on the aqua dataset (Phase 4).

Features: the same 4 real, measured features the DL classifier uses
[ph, temperature, dissolvedOxygen, conductivity_log10]. Trained on rows
labelled NORMAL in cpcb_tier (fit "normal water", flag departures).

    pip install -r ../requirements-ml.txt
    python train_anomaly.py --data ../../processed --out ../../results

Writes isolation_forest.joblib (+ a small JSON sidecar with feature order).
NOTE: this is a training utility; backend inference currently reports the
documented rule-based anomaly proxy (app/services/analysis.anomaly_score).
Wiring this artifact into inference is a deliberate next step — do not claim
Isolation Forest scores in the UI until that wiring exists and is tested.
No metrics are printed that were not computed here.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

FEATURES = ["ph", "temperature", "dissolvedOxygen", "conductivity_log10"]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", default="../../processed")
    ap.add_argument("--out", default="../../results")
    args = ap.parse_args()

    df = pd.read_csv(Path(args.data) / "aqua_clean_full.csv")
    normal = df[df["cpcb_tier"] == "NORMAL"][FEATURES].dropna()
    print(f"Training IsolationForest on {len(normal)} NORMAL rows, features {FEATURES}")
    scaler = StandardScaler().fit(normal)
    model = IsolationForest(n_estimators=200, contamination="auto", random_state=42)
    model.fit(scaler.transform(normal))

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "scaler_mean": scaler.mean_, "scaler_std": scaler.scale_,
                 "features": FEATURES}, out / "isolation_forest.joblib")
    (out / "isolation_forest.json").write_text(json.dumps(
        {"features": FEATURES, "trained_on": "cpcb_tier == NORMAL rows",
         "n_rows": int(len(normal))}, indent=2))
    print(f"Saved {out / 'isolation_forest.joblib'}")


if __name__ == "__main__":
    main()

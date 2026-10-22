#!/usr/bin/env python3
"""Build a 6-parameter version of the India aqua dataset.

    python data/augment_dataset.py \
        --input processed/aqua_clean_full.csv --outdir processed

Adds the two parameters the aqua dataset does not contain:

  tds        Copied from the file's own `tds_derived` (= 0.64 x conductivity,
             the standard EC->TDS rule of thumb that real EC/TDS meters use).
             Flagged `tds_is_derived = 1` on every row. It is a conversion,
             not a lab measurement, and it is perfectly collinear with
             conductivity — it adds NO new information to a model that
             already uses conductivity.

  turbidity  *** SYNTHETIC — NOT MEASURED ***
             Generated reproducibly (seed 42) from a documented formula:
             a log-normal baseline typical of Indian surface/ground water
             (median ~2.8 NTU; cross-checked against the Kaggle file in this
             repo, whose measured turbidity has median 3.96 NTU), shifted up
             with BOD and total coliform load (turbid water in Indian river
             monitoring co-occurs with organic/microbial load):
                 ln(turbidity) = ln(2.8) + 0.30*z(bod_log10)
                                          + 0.20*z(total_coliform_log10)
                                          + N(0, 0.35)
             clipped to 0.1–80 NTU. Flagged `turbidity_is_synthetic = 1`.

HONEST-USE RULES (also in docs/DATASET_AUGMENTATION.md):
- Use this file to test the 6-parameter training/inference *pipeline*.
- Do NOT report metrics from a model trained with the synthetic turbidity
  column as real-world performance: the model can partly re-learn the
  generation formula, so those numbers are circular/optimistic.
- Replace the synthetic column with measured turbidity (from the future
  turbidity sensor or a dataset that actually measured it) before drawing
  any scientific conclusion.

Outputs (in --outdir):
  aqua_clean_full_6param_synthetic.csv   full file + new columns/flags
  aqua_train_6param_synthetic.csv        rows where split == 'train'
  aqua_test_6param_synthetic.csv         rows where split == 'test'
  aqua_6param_augmentation_report.json   method, seed, distributions
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd

SEED = 42


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", default="processed/aqua_clean_full.csv")
    ap.add_argument("--outdir", default="processed")
    args = ap.parse_args()

    df = pd.read_csv(args.input)
    rng = np.random.default_rng(SEED)

    # --- TDS: derived conversion already present in the source file ---
    if "tds_derived" not in df.columns:
        df["tds_derived"] = (df["conductivity"] * 0.64).round(1)
    df["tds"] = df["tds_derived"]
    df["tds_is_derived"] = 1

    # --- Turbidity: SYNTHETIC, documented formula (see module docstring) ---
    def z(s: pd.Series) -> pd.Series:
        return (s - s.mean()) / (s.std() or 1.0)

    ln_turb = (
        np.log(2.8)
        + 0.30 * z(df["bod_log10"].fillna(df["bod_log10"].median()))
        + 0.20 * z(df["total_coliform_log10"].fillna(df["total_coliform_log10"].median()))
        + rng.normal(0, 0.35, len(df))
    )
    df["turbidity"] = np.exp(ln_turb).clip(0.1, 80.0).round(2)
    df["turbidity_is_synthetic"] = 1

    # log10(x+1) companions, same convention as the existing *_log10 columns,
    # so a 6-feature version of train_simple_dl.py can use them directly.
    df["turbidity_log10"] = np.log10(df["turbidity"] + 1).round(6)
    df["tds_log10"] = np.log10(df["tds"] + 1).round(6)

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    full = outdir / "aqua_clean_full_6param_synthetic.csv"
    df.to_csv(full, index=False)
    if "split" in df.columns:
        df[df["split"] == "train"].to_csv(outdir / "aqua_train_6param_synthetic.csv", index=False)
        df[df["split"] == "test"].to_csv(outdir / "aqua_test_6param_synthetic.csv", index=False)

    report = {
        "source": args.input,
        "rows": int(len(df)),
        "seed": SEED,
        "tds": {
            "method": "tds = 0.64 * conductivity (copied from source column tds_derived)",
            "is_derived": True,
            "warning": "Perfectly collinear with conductivity; adds no information beyond EC.",
            "describe": df["tds"].describe().round(2).to_dict(),
        },
        "turbidity": {
            "method": "ln(turb) = ln(2.8) + 0.30*z(bod_log10) + 0.20*z(total_coliform_log10) + N(0, 0.35), clip 0.1-80 NTU",
            "is_synthetic": True,
            "warning": ("NOT measured. Metrics of a model trained on this column are "
                        "circular/optimistic and must not be reported as real performance."),
            "describe": df["turbidity"].describe().round(2).to_dict(),
            "pct_within_dashboard_range_0_5_NTU": round(float((df["turbidity"] <= 5).mean() * 100), 1),
            "reference_check": "Kaggle file in this repo (measured): turbidity median 3.96 NTU, range 2.15-5.76.",
        },
        "six_parameters": ["ph", "turbidity", "temperature", "tds", "conductivity", "dissolvedOxygen"],
        "target_unchanged": "cpcb_tier (illustrative CPCB grouping — see processed/README.md)",
    }
    (outdir / "aqua_6param_augmentation_report.json").write_text(json.dumps(report, indent=2))
    print(json.dumps(report, indent=2))
    print(f"\nWrote {full} (+ train/test splits + report) — turbidity is SYNTHETIC, tds is DERIVED.")


if __name__ == "__main__":
    main()

# Dataset augmentation: adding turbidity + TDS to the aqua dataset

Source: `processed/aqua_clean_full.csv` — 1,361 Indian stations, measured
ph / temperature / dissolvedOxygen / conductivity (+ BOD, nitrate, coliforms).
It has **no turbidity** and **no measured TDS**.

Generator: `python data/augment_dataset.py` (seed 42, reproducible).
Outputs: `processed/aqua_clean_full_6param_synthetic.csv`,
`aqua_train_6param_synthetic.csv`, `aqua_test_6param_synthetic.csv`,
`aqua_6param_augmentation_report.json`.

## What was added, and how

| Column | How | Status |
|---|---|---|
| `tds` | Copied from the source file's `tds_derived` = 0.64 x conductivity (the conversion EC/TDS meters themselves use) | **Derived**, flag `tds_is_derived=1` |
| `turbidity` | ln(turb) = ln(2.8) + 0.30*z(BOD log10) + 0.20*z(total coliform log10) + N(0, 0.35), clipped 0.1–80 NTU. Result: mean 3.19, median 2.73 NTU, 88.5% within the dashboard's 0–5 NTU range — in line with Indian surface/ground water and with the *measured* turbidity in this repo's Kaggle file (median 3.96 NTU) | **Synthetic — NOT measured**, flag `turbidity_is_synthetic=1` |
| `turbidity_log10`, `tds_log10` | log10(x+1), same convention as existing `*_log10` columns | Derived from the above |

## Retraining on 6 features — the exact change

In a copy of `train_simple_dl.py`:

```python
FEATURES = ["ph", "temperature", "dissolvedOxygen",
            "conductivity_log10", "turbidity_log10", "tds_log10"]
# and instantiate the models with the new input size, e.g.
MODELS = {"SimpleMLP": lambda: SimpleMLP(n_in=len(FEATURES)), ...}
# point --data at a folder containing aqua_train_6param_synthetic.csv /
# aqua_test_6param_synthetic.csv renamed to aqua_train.csv / aqua_test.csv
```

## Read this before quoting any 6-parameter result

1. **Synthetic turbidity makes metrics circular.** The label (`cpcb_tier`) is
   partly built from BOD/coliform-related class rules, and synthetic turbidity
   is generated from BOD/coliform — a model can re-learn the generator instead
   of learning water chemistry. Accuracy/F1 from this file will look better
   than real-world performance. Use it to prove the 6-parameter *pipeline*
   trains and serves, not to claim a better model.
2. **Derived TDS adds no information** beyond conductivity (it is a constant
   multiple of it). Expect near-zero genuine gain from that feature; a real
   TDS contribution requires independently measured TDS.
3. The right fix is data, not formulas: once the turbidity sensor is online,
   log real (ph, turbidity, temperature, TDS, EC, DO) tuples through this
   backend and retrain on those. The backend's `/api/v1/readings/history`
   export is exactly that future training set.

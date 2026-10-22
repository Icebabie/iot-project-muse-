"""Inference for the trained SimpleMLP (train_simple_dl.py).

Two interchangeable engines, same weights, same scaler:
1. **NumPy** (preferred): app/ml_weights.json was exported from
   results/best_model.pt by ml/export_weights.py and verified to reproduce
   the PyTorch model's test-set accuracy (see that script). A 4->64->32->3
   ReLU MLP forward pass is a few matrix multiplies, so production does not
   need PyTorch installed (important on free hosting tiers).
2. **PyTorch**: used when the .pt artifact + torch are available and the
   NumPy weights are missing.

If neither engine can run, or a reading lacks any of the 4 model features,
inference returns None and callers fall back to the rule-based assessment.
Nothing is fabricated.

Model facts (do not overstate): trained ONLY on
[ph, temperature, dissolvedOxygen, conductivity_log10] with
conductivity_log10 = log10(conductivity + 1), target cpcb_tier — an
illustrative CPCB grouping, not a drinking-water safety label.
`confidence` is the model's own softmax probability for the predicted
class, not a measured accuracy.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

_WEIGHTS_JSON = Path(__file__).resolve().parent.parent / "ml_weights.json"
_np_cache: dict = {"loaded": False, "data": None}
_torch_cache: dict = {"loaded": False, "model": None, "scaler": None, "error": None}

FRONT_KEY = {"ph": "ph", "temperature": "temperature",
             "dissolvedOxygen": "dissolvedOxygen", "conductivity_log10": "conductivity"}


def _load_numpy():
    if _np_cache["loaded"]:
        return _np_cache["data"]
    _np_cache["loaded"] = True
    try:
        _np_cache["data"] = json.loads(_WEIGHTS_JSON.read_text())
    except Exception:
        _np_cache["data"] = None
    return _np_cache["data"]


def _predict_numpy(data: dict, features_raw: dict[str, float]) -> dict:
    import numpy as np

    order, mean, std = data["features"], data["scaler_mean"], data["scaler_std"]
    x = np.array([(features_raw[name] - mean[i]) / std[i] for i, name in enumerate(order)],
                 dtype=np.float64)
    zipped = sorted(zip(order, x), key=lambda t: abs(t[1]), reverse=True)
    h = x
    for layer in data["layers"]:
        h = h @ np.array(layer["weight"], dtype=np.float64).T + np.array(layer["bias"], dtype=np.float64)
        if layer is not data["layers"][-1]:
            h = np.maximum(h, 0.0)  # ReLU between Linear layers
    probs = np.exp(h - h.max())
    probs = probs / probs.sum()
    idx = int(probs.argmax())
    return {
        "label": data["classes"][idx],
        "confidence": round(float(probs[idx]) * 100, 2),
        "probabilities": {c: round(float(p) * 100, 2) for c, p in zip(data["classes"], probs)},
        "contributing_parameters": [FRONT_KEY[name] for name, _ in zipped[:3]],
        "model_name": "SimpleMLP (PyTorch-trained, NumPy inference)",
    }


def _load_torch(model_path: str, scaler_path: str):
    if _torch_cache["loaded"] and _torch_cache.get("paths") == (model_path, scaler_path):
        return _torch_cache["model"], _torch_cache["scaler"]
    _torch_cache.update(loaded=True, paths=(model_path, scaler_path),
                        model=None, scaler=None, error=None)
    try:
        import torch
        import torch.nn as nn

        scaler = json.loads(Path(scaler_path).read_text())
        if scaler.get("model") != "SimpleMLP":
            raise ValueError(f"unsupported saved model type: {scaler.get('model')!r}")

        class SimpleMLP(nn.Module):
            def __init__(self, n_in=4, n_out=3):
                super().__init__()
                self.net = nn.Sequential(
                    nn.Linear(n_in, 64), nn.ReLU(),
                    nn.Linear(64, 32), nn.ReLU(),
                    nn.Linear(32, n_out),
                )

            def forward(self, x):
                return self.net(x)

        model = SimpleMLP()
        model.load_state_dict(torch.load(model_path, map_location="cpu", weights_only=True))
        model.eval()
        _torch_cache.update(model=model, scaler=scaler)
    except Exception as exc:
        _torch_cache.update(model=None, scaler=None, error=str(exc))
    return _torch_cache["model"], _torch_cache["scaler"]


def _predict_torch(model, scaler, features_raw: dict[str, float]) -> dict:
    import torch

    order = scaler["features"]
    mean, std = scaler["mean"], scaler["std"]
    x = [(features_raw[name] - mean[i]) / std[i] for i, name in enumerate(order)]
    zipped = sorted(zip(order, x), key=lambda t: abs(t[1]), reverse=True)
    with torch.no_grad():
        probs = torch.softmax(model(torch.tensor([x], dtype=torch.float32)), dim=1)[0]
    idx = int(probs.argmax())
    return {
        "label": scaler["classes"][idx],
        "confidence": round(float(probs[idx]) * 100, 2),
        "probabilities": {c: round(float(probs[i]) * 100, 2)
                          for i, c in enumerate(scaler["classes"])},
        "contributing_parameters": [FRONT_KEY[name] for name, _ in zipped[:3]],
        "model_name": "SimpleMLP (PyTorch)",
    }


def predict_from_features(ph, temperature, dissolved_oxygen, conductivity,
                          model_path: str, scaler_path: str) -> dict | None:
    """Core entry point (used for stored readings and manual form values)."""
    if any(v is None for v in (ph, temperature, dissolved_oxygen, conductivity)):
        return None
    features_raw = {
        "ph": ph,
        "temperature": temperature,
        "dissolvedOxygen": dissolved_oxygen,
        "conductivity_log10": math.log10(conductivity + 1.0),
    }
    data = _load_numpy()
    if data is not None:
        try:
            return _predict_numpy(data, features_raw)
        except Exception:
            pass  # fall through to torch
    model, scaler = _load_torch(model_path, scaler_path)
    if model is not None and scaler is not None:
        try:
            return _predict_torch(model, scaler, features_raw)
        except Exception:
            return None
    return None


def predict_ml(reading, model_path: str, scaler_path: str) -> dict | None:
    return predict_from_features(
        reading.ph, reading.temperature, reading.dissolved_oxygen,
        reading.conductivity, model_path, scaler_path,
    )

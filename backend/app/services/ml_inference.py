"""Optional PyTorch inference for the trained SimpleMLP (results/best_model.pt).

Design rules:
- torch is an OPTIONAL dependency (backend/requirements-ml.txt). If it is not
  installed, or the artifact/scaler is missing/corrupt, or the reading lacks
  any of the 4 model features, inference returns None and the caller falls
  back to the rule-based assessment. Nothing is fabricated.
- The model was trained ONLY on [ph, temperature, dissolvedOxygen,
  conductivity_log10] with target cpcb_tier (see train_simple_dl.py and
  docs/INSPECTION_AND_PLAN.md for the caveats about that label).
- conductivity_log10 = log10(conductivity + 1), matching the training CSVs.
- `confidence` is the model's own softmax probability for the predicted
  class (x100) — a model output, not a measured accuracy.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

_cache: dict = {"loaded": False, "model": None, "scaler": None, "error": None}


def _load(model_path: str, scaler_path: str):
    if _cache["loaded"] and _cache.get("paths") == (model_path, scaler_path):
        return _cache["model"], _cache["scaler"]
    _cache.update(loaded=True, paths=(model_path, scaler_path), model=None, scaler=None, error=None)
    try:
        import torch
        import torch.nn as nn

        scaler = json.loads(Path(scaler_path).read_text())
        if scaler.get("model") != "SimpleMLP":
            raise ValueError(f"unsupported saved model type: {scaler.get('model')!r}")

        class SimpleMLP(nn.Module):
            """Must match train_simple_dl.SimpleMLP exactly (4->64->32->3)."""

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
        state = torch.load(model_path, map_location="cpu", weights_only=True)
        model.load_state_dict(state)
        model.eval()
        _cache.update(model=model, scaler=scaler)
    except Exception as exc:  # torch missing, file missing, shape mismatch, ...
        _cache.update(model=None, scaler=None, error=str(exc))
    return _cache["model"], _cache["scaler"]


def predict_ml(reading, model_path: str, scaler_path: str) -> dict | None:
    """Return {label, confidence, contributing_parameters, model_name} or None."""
    needed = (reading.ph, reading.temperature, reading.dissolved_oxygen, reading.conductivity)
    if any(v is None for v in needed):
        return None
    model, scaler = _load(model_path, scaler_path)
    if model is None or scaler is None:
        return None
    try:
        import torch

        features_raw = {
            "ph": reading.ph,
            "temperature": reading.temperature,
            "dissolvedOxygen": reading.dissolved_oxygen,
            "conductivity_log10": math.log10(reading.conductivity + 1.0),
        }
        order = scaler["features"]
        mean, std = scaler["mean"], scaler["std"]
        x = [(features_raw[name] - mean[i]) / std[i] for i, name in enumerate(order)]
        with torch.no_grad():
            probs = torch.softmax(model(torch.tensor([x], dtype=torch.float32)), dim=1)[0]
        idx = int(probs.argmax())
        # Contributing = features deviating most from their training mean (|z|),
        # mapped back to frontend keys. A transparent heuristic, labelled as such.
        zipped = sorted(zip(order, x), key=lambda t: abs(t[1]), reverse=True)
        front = {"ph": "ph", "temperature": "temperature",
                 "dissolvedOxygen": "dissolvedOxygen", "conductivity_log10": "conductivity"}
        contributing = [front[name] for name, _ in zipped[:3]]
        return {
            "label": scaler["classes"][idx],
            "confidence": round(float(probs[idx]) * 100, 2),
            "contributing_parameters": contributing,
            "model_name": f"{scaler['model']} (PyTorch, 4-feature)",
        }
    except Exception:
        return None


def ml_status(model_path: str, scaler_path: str) -> str:
    model, _ = _load(model_path, scaler_path)
    return "available" if model is not None else f"unavailable: {_cache.get('error')}"

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import SensorReading
from ..schemas import ManualPredictionOut, ManualPredictionRequest, PredictionOut
from ..services.analysis import anomaly_score, assess_reading, overall_label
from ..services.ml_inference import predict_from_features, predict_ml
from ..thresholds import FRONTEND_KEY
from .readings import get_db

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])


@router.get("/latest", response_model=PredictionOut)
def latest_prediction(request: Request, device_id: str | None = None,
                      db: Session = Depends(get_db)):
    settings = request.app.state.settings
    stmt = select(SensorReading)
    if device_id:
        stmt = stmt.where(SensorReading.device_id == device_id)
    stmt = stmt.order_by(SensorReading.timestamp.desc(), SensorReading.id.desc()).limit(1)
    reading = db.scalar(stmt)
    if reading is None:
        raise HTTPException(status_code=404, detail="no readings stored yet")

    assessments = assess_reading(reading)
    rule_label = overall_label(assessments)
    violating = [FRONTEND_KEY[a["parameter"]] for a in assessments
                 if a["status"] in ("WARNING", "CRITICAL")]

    ml = predict_ml(reading, settings.ml_model_path, settings.ml_scaler_path)
    if ml is not None:
        return PredictionOut(
            device_id=reading.device_id, timestamp=reading.timestamp,
            rule_based_label=rule_label, assessments=assessments,
            label=ml["label"], confidence=ml["confidence"],
            anomaly_score=anomaly_score(assessments), model_name=ml["model_name"],
            is_demo=False, ml_available=True,
            contributing_parameters=violating or ml["contributing_parameters"],
        )
    # Honest fallback: rule-based only, no invented confidence.
    return PredictionOut(
        device_id=reading.device_id, timestamp=reading.timestamp,
        rule_based_label=rule_label, assessments=assessments,
        label=rule_label, confidence=None,
        anomaly_score=anomaly_score(assessments),
        model_name="Rule-based thresholds (ML model not loaded)",
        is_demo=False, ml_available=False,
        contributing_parameters=violating,
    )


@router.post("/manual", response_model=ManualPredictionOut)
def manual_prediction(payload: ManualPredictionRequest, request: Request):
    """'Test DL model' form: values typed in the dashboard, nothing is stored.
    All six values go through the rule engine; the DL model uses the four
    features it was trained on (stated openly in the response)."""
    from types import SimpleNamespace

    probe = SimpleNamespace(
        ph=payload.ph, turbidity=payload.turbidity, temperature=payload.temperature,
        tds=payload.tds, conductivity=payload.conductivity,
        dissolved_oxygen=payload.dissolved_oxygen,
    )
    assessments = assess_reading(probe)  # type: ignore[arg-type]
    rule_label = overall_label(assessments)
    violating = [FRONTEND_KEY[a["parameter"]] for a in assessments
                 if a["status"] in ("WARNING", "CRITICAL")]
    settings = request.app.state.settings
    ml = predict_from_features(payload.ph, payload.temperature,
                               payload.dissolved_oxygen, payload.conductivity,
                               settings.ml_model_path, settings.ml_scaler_path)
    features = ["ph", "temperature", "dissolvedOxygen", "conductivity"]
    if ml is not None:
        return ManualPredictionOut(
            label=ml["label"], confidence=ml["confidence"],
            probabilities=ml["probabilities"], rule_based_label=rule_label,
            assessments=assessments, anomaly_score=anomaly_score(assessments),
            model_name=ml["model_name"], ml_available=True,
            features_used_by_model=features,
            note=("The DL model was trained on 4 features (ph, temperature, "
                  "dissolved oxygen, conductivity). Turbidity and TDS are "
                  "included in the rule-based assessment above, not in the "
                  "DL prediction. Confidence is the model's softmax output, "
                  "not a measured accuracy."),
        )
    return ManualPredictionOut(
        label=rule_label, confidence=None, probabilities=None,
        rule_based_label=rule_label, assessments=assessments,
        anomaly_score=anomaly_score(assessments),
        model_name="Rule-based thresholds (ML model not loaded)",
        ml_available=False, features_used_by_model=features,
        note="ML weights unavailable on this server; showing the rule-based assessment only.",
    )

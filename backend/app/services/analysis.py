"""Rule-based water-quality analysis (Phase 4, first step) + alert creation.

This is a *threshold assessment against configured monitoring ranges*.
It is not an ML prediction and it is not a drinking-water safety
determination — the response types keep those three things separate.
"""
from __future__ import annotations

from ..models import Alert, SensorReading
from ..thresholds import FRONTEND_KEY, PARAMETERS, parameter_status

SEVERITY_FOR_STATUS = {"WARNING": "WARNING", "CRITICAL": "CRITICAL"}


def assess_reading(reading: SensorReading) -> list[dict]:
    """Per-parameter assessments for one reading."""
    out = []
    for field, cfg in PARAMETERS.items():
        value = getattr(reading, field)
        out.append(
            {
                "parameter": field,
                "label": cfg["label"],
                "value": value,
                "unit": cfg["unit"],
                "status": "UNAVAILABLE" if value is None else parameter_status(value, field),
            }
        )
    return out


def overall_label(assessments: list[dict]) -> str:
    """NORMAL | WARNING | ABNORMAL — mirrors getOverallStatus in the frontend."""
    statuses = [a["status"] for a in assessments]
    if "CRITICAL" in statuses:
        return "ABNORMAL"
    if "WARNING" in statuses:
        return "WARNING"
    return "NORMAL"


def anomaly_score(assessments: list[dict]) -> float:
    """Documented rule-based anomaly proxy in [0, 1]:
    mean over *available* parameters of NORMAL=0, WARNING=0.5, CRITICAL=1.
    It is a transparent heuristic, not a trained Isolation Forest score.
    (ml/train_anomaly.py can produce a real IF artifact later; the inference
    service will prefer it when present.)"""
    weights = {"NORMAL": 0.0, "WARNING": 0.5, "CRITICAL": 1.0}
    vals = [weights[a["status"]] for a in assessments if a["status"] in weights]
    return round(sum(vals) / len(vals), 4) if vals else 0.0


def build_alerts(reading: SensorReading, assessments: list[dict]) -> list[Alert]:
    """One persisted alert per out-of-range parameter of this reading."""
    alerts: list[Alert] = []
    for a in assessments:
        if a["status"] not in SEVERITY_FOR_STATUS:
            continue
        field = a["parameter"]
        cfg = PARAMETERS[field]
        direction = "below" if a["value"] < cfg["min"] else "above"
        alerts.append(
            Alert(
                device_id=reading.device_id,
                severity=SEVERITY_FOR_STATUS[a["status"]],
                parameter=FRONTEND_KEY[field],
                message=(
                    f"{cfg['label']} {direction} configured range: "
                    f"{a['value']} {cfg['unit']} (range {cfg['min']}–{cfg['max']} {cfg['unit']})"
                ),
                value=a["value"],
                threshold_min=cfg["min"],
                threshold_max=cfg["max"],
                timestamp=reading.timestamp,
                active=True,
                reading_id=reading.id,
            )
        )
    return alerts

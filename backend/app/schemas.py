"""Request/response schemas (Pydantic v2).

Ingestion validation is deliberately strict about *plausibility* (a pH of
999 is a broken sensor / malformed payload and must not corrupt stored data)
while accepting values outside the *configured monitoring ranges* — those are
real abnormal water conditions and are stored, then flagged by the analysis
service as WARNING/CRITICAL alerts.
"""
from __future__ import annotations

import math
from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator

# Physically plausible limits (aligned with preprocess_water_quality.py,
# widened slightly for TDS so genuinely hard Indian groundwater is storable).
PLAUSIBLE: dict[str, tuple[float, float]] = {
    "ph": (0.0, 14.0),
    "turbidity": (0.0, 1000.0),
    "temperature": (0.0, 50.0),
    "tds": (0.0, 10000.0),
    "conductivity": (0.0, 20000.0),
    "dissolved_oxygen": (0.0, 20.0),
}

SENSOR_FIELDS = list(PLAUSIBLE.keys())


def _check_plausible(field: str, value: float | None) -> float | None:
    if value is None:
        return None
    if isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
        raise ValueError(f"{field} must be a finite number")
    lo, hi = PLAUSIBLE[field]
    if not (lo <= value <= hi):
        raise ValueError(f"{field}={value} is outside the physically plausible range {lo}-{hi}")
    return value


class ReadingCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    device_id: str = Field(min_length=1, max_length=64)
    timestamp: datetime | None = None
    ph: float | None = None
    turbidity: float | None = None
    temperature: float | None = None
    tds: float | None = None
    conductivity: float | None = None
    dissolved_oxygen: float | None = None

    @field_validator("ph", "turbidity", "temperature", "tds", "conductivity", "dissolved_oxygen")
    @classmethod
    def _plausible(cls, v, info):
        return _check_plausible(info.field_name, v)

    @field_validator("timestamp")
    @classmethod
    def _timestamp_sane(cls, v: datetime | None) -> datetime | None:
        if v is None:
            return None
        if v.tzinfo is None:  # treat naive timestamps as UTC (documented for ESP32)
            v = v.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        if (v - now).total_seconds() > 24 * 3600:
            raise ValueError("timestamp is more than 24h in the future")
        return v

    @model_validator(mode="after")
    def _at_least_one_parameter(self):
        if all(getattr(self, f) is None for f in SENSOR_FIELDS):
            raise ValueError("at least one sensor parameter must be present (non-null)")
        return self


class ReadingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_id: str
    timestamp: datetime
    received_at: datetime
    ph: float | None
    turbidity: float | None
    temperature: float | None
    tds: float | None
    conductivity: float | None
    dissolved_oxygen: float | None


class AlertOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    device_id: str
    severity: str
    parameter: str | None
    message: str
    value: float | None
    threshold_min: float | None
    threshold_max: float | None
    timestamp: datetime
    active: bool
    reading_id: int | None


class DeviceStatusOut(BaseModel):
    device_id: str
    state: str  # ONLINE | OFFLINE | DEGRADED
    is_online: bool
    wifi: str  # always UNKNOWN from the API alone — see docs/ESP32_CONTRACT.md
    data_ingestion: str  # ACTIVE | STALLED | NO_DATA
    last_reading_at: datetime | None
    last_received_at: datetime | None
    age_seconds: float | None
    online_window_seconds: int
    sensors_active: int
    sensors_total: int
    backend: str  # CONNECTED
    database: str  # CONNECTED | ERROR


class ParameterAssessment(BaseModel):
    parameter: str
    label: str
    value: float | None
    unit: str
    status: str  # NORMAL | WARNING | CRITICAL | UNAVAILABLE


class PredictionOut(BaseModel):
    device_id: str
    timestamp: datetime
    # Rule-based assessment (always available when a reading exists)
    rule_based_label: str  # NORMAL | WARNING | ABNORMAL
    assessments: list[ParameterAssessment]
    # ML prediction (null when the model cannot run — never fabricated)
    label: str  # ML label when available, otherwise the rule-based label
    confidence: float | None  # ML softmax %, null for rule-based-only
    anomaly_score: float  # documented rule-based proxy, 0..1 (see analysis.py)
    model_name: str
    is_demo: bool  # True only when neither ML nor real data backs the result
    ml_available: bool
    contributing_parameters: list[str]  # frontend camelCase keys


class HealthOut(BaseModel):
    status: str
    database: str
    timestamp: datetime

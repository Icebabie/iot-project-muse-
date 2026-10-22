from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from ..models import SensorReading
from ..schemas import DeviceStatusOut
from ..thresholds import PARAMETERS
from .readings import get_db

router = APIRouter(prefix="/api/v1/device", tags=["device"])


@router.get("/status", response_model=DeviceStatusOut)
def device_status(request: Request, device_id: str | None = None, db: Session = Depends(get_db)):
    """Status derived from actual data freshness.

    ONLINE only when a reading for this device arrived within the configured
    window — the backend merely running does NOT make the device online.
    Wi-Fi is UNKNOWN: receiving an HTTP POST does not prove the device's
    Wi-Fi state at query time."""
    settings = request.app.state.settings
    device = device_id or settings.default_device_id
    stmt = (
        select(SensorReading)
        .where(SensorReading.device_id == device)
        .order_by(SensorReading.timestamp.desc(), SensorReading.id.desc())
        .limit(1)
    )
    latest = db.scalar(stmt)
    try:
        db.execute(text("SELECT 1"))
        database = "CONNECTED"
    except Exception:
        database = "ERROR"

    if latest is None:
        return DeviceStatusOut(
            device_id=device, state="OFFLINE", is_online=False, wifi="UNKNOWN",
            data_ingestion="NO_DATA", last_reading_at=None, last_received_at=None,
            age_seconds=None, online_window_seconds=settings.device_online_window_seconds,
            sensors_active=0, sensors_total=len(PARAMETERS),
            backend="CONNECTED", database=database,
        )

    now = datetime.now(timezone.utc)
    ts = latest.timestamp if latest.timestamp.tzinfo else latest.timestamp.replace(tzinfo=timezone.utc)
    age = max(0.0, (now - ts).total_seconds())
    online = age <= settings.device_online_window_seconds
    active = sum(1 for f in PARAMETERS if getattr(latest, f) is not None)
    return DeviceStatusOut(
        device_id=device,
        state="ONLINE" if online else "OFFLINE",
        is_online=online,
        wifi="UNKNOWN",
        data_ingestion="ACTIVE" if online else "STALLED",
        last_reading_at=latest.timestamp,
        last_received_at=latest.received_at,
        age_seconds=round(age, 1),
        online_window_seconds=settings.device_online_window_seconds,
        sensors_active=active,
        sensors_total=len(PARAMETERS),
        backend="CONNECTED",
        database=database,
    )

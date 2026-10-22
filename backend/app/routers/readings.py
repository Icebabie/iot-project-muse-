from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import SensorReading
from ..schemas import ReadingCreate, ReadingOut
from ..services.analysis import assess_reading, build_alerts

router = APIRouter(prefix="/api/v1/readings", tags=["readings"])


def get_db(request: Request):
    session = request.app.state.session_factory()
    try:
        yield session
    finally:
        session.close()


@router.post("", response_model=ReadingOut, status_code=201)
def create_reading(payload: ReadingCreate, db: Session = Depends(get_db)):
    """Ingest one reading (ESP32 / simulator). Validated by ReadingCreate;
    invalid payloads get 422 and store nothing."""
    reading = SensorReading(
        device_id=payload.device_id,
        timestamp=payload.timestamp or datetime.now(timezone.utc),
        ph=payload.ph,
        turbidity=payload.turbidity,
        temperature=payload.temperature,
        tds=payload.tds,
        conductivity=payload.conductivity,
        dissolved_oxygen=payload.dissolved_oxygen,
    )
    db.add(reading)
    db.flush()  # assigns reading.id for alert linkage
    # Phase 4/5: threshold analysis on ingestion, alerts persisted.
    db.add_all(build_alerts(reading, assess_reading(reading)))
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/latest", response_model=ReadingOut)
def latest_reading(device_id: str | None = None, db: Session = Depends(get_db),
                   request: Request = None):
    stmt = select(SensorReading)
    if device_id:
        stmt = stmt.where(SensorReading.device_id == device_id)
    stmt = stmt.order_by(SensorReading.timestamp.desc(), SensorReading.id.desc()).limit(1)
    reading = db.scalar(stmt)
    if reading is None:
        raise HTTPException(status_code=404, detail="no readings stored yet")
    return reading


@router.get("/history", response_model=list[ReadingOut])
def history(
    device_id: str | None = None,
    limit: int = Query(default=100, ge=1, le=1000),
    since: datetime | None = None,
    until: datetime | None = None,
    db: Session = Depends(get_db),
):
    """Stored readings in chronological order (oldest -> newest), suitable
    for charts. Takes the most recent `limit` rows inside the window, then
    returns them ascending."""
    stmt = select(SensorReading)
    if device_id:
        stmt = stmt.where(SensorReading.device_id == device_id)
    if since:
        stmt = stmt.where(SensorReading.timestamp >= since)
    if until:
        stmt = stmt.where(SensorReading.timestamp <= until)
    stmt = stmt.order_by(SensorReading.timestamp.desc(), SensorReading.id.desc()).limit(limit)
    rows = list(db.scalars(stmt))
    return list(reversed(rows))

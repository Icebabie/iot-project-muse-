from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import SensorReading
from ..schemas import MaintenanceOut
from ..services.maintenance import WINDOW, diagnose
from .readings import get_db

router = APIRouter(prefix="/api/v1/maintenance", tags=["maintenance"])


@router.get("", response_model=MaintenanceOut)
def maintenance(request: Request, device_id: str | None = None,
                db: Session = Depends(get_db)):
    """Predictive-maintenance indicators from the device's recent readings."""
    settings = request.app.state.settings
    device = device_id or settings.default_device_id
    stmt = (select(SensorReading)
            .where(SensorReading.device_id == device)
            .order_by(SensorReading.timestamp.desc(), SensorReading.id.desc())
            .limit(WINDOW))
    result = diagnose(list(db.scalars(stmt)))
    return MaintenanceOut(
        device_id=device,
        disclaimer=("Heuristic maintenance indicators (stuck values, drift, "
                    "missing data, frequent out-of-range) — prompts to inspect "
                    "a sensor, not failure predictions."),
        **result,
    )

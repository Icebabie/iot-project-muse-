from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import Alert
from ..schemas import AlertOut
from .readings import get_db

router = APIRouter(prefix="/api/v1/alerts", tags=["alerts"])


@router.get("", response_model=list[AlertOut])
def list_alerts(
    device_id: str | None = None,
    active_only: bool = False,
    limit: int = Query(default=50, ge=1, le=500),
    db: Session = Depends(get_db),
):
    stmt = select(Alert)
    if device_id:
        stmt = stmt.where(Alert.device_id == device_id)
    if active_only:
        stmt = stmt.where(Alert.active.is_(True))
    stmt = stmt.order_by(Alert.timestamp.desc(), Alert.id.desc()).limit(limit)
    return list(db.scalars(stmt))

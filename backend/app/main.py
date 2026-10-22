"""Smart Water Quality Monitoring — FastAPI backend.

Run locally (from backend/):
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000
Docs: http://localhost:8000/docs
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .config import Settings, get_settings
from .db import init_db, make_engine, make_session_factory
from .routers import alerts, device, predictions, readings
from .schemas import HealthOut


def create_app(settings: Settings | None = None, **overrides) -> FastAPI:
    settings = settings or get_settings(**overrides)
    app = FastAPI(
        title="Smart Water Quality Monitoring API",
        version="1.0.0",
        description=(
            "Ingestion, storage, threshold analysis and (optional) ML prediction "
            "for the Smart Water Quality Monitoring dashboard. Configured ranges "
            "are prototype monitoring ranges, not drinking-water safety limits."
        ),
    )
    engine = make_engine(settings.database_url)
    init_db(engine)
    app.state.settings = settings
    app.state.engine = engine
    app.state.session_factory = make_session_factory(engine)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_origin_regex=settings.cors_origin_regex,
        allow_credentials=False,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    @app.get("/health", response_model=HealthOut, tags=["system"])
    def health(request: Request):
        try:
            with request.app.state.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            db_status = "ok"
        except Exception:
            db_status = "error"
        return HealthOut(
            status="ok" if db_status == "ok" else "degraded",
            database=db_status,
            timestamp=datetime.now(timezone.utc),
        )

    app.include_router(readings.router)
    app.include_router(alerts.router)
    app.include_router(device.router)
    app.include_router(predictions.router)
    return app


app = create_app()

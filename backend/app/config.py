"""Backend configuration, read from environment variables only.

No credentials or production secrets are hardcoded. Copy backend/.env.example
to backend/.env for local development (and never commit the real .env).
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent          # backend/
REPO_ROOT = BACKEND_DIR.parent                                  # repository root


def _split_csv(value: str) -> list[str]:
    return [v.strip() for v in value.split(",") if v.strip()]


@dataclass
class Settings:
    # SQLite by default (local dev). Production: set DATABASE_URL to
    # e.g. postgresql+psycopg://user:password@host:5432/water_quality
    database_url: str = field(
        default_factory=lambda: os.getenv(
            "DATABASE_URL", f"sqlite:///{BACKEND_DIR / 'water_quality.db'}"
        )
    )
    # Comma-separated exact origins, plus an optional regex (Vercel previews).
    cors_origins: list[str] = field(
        default_factory=lambda: _split_csv(
            os.getenv(
                "CORS_ORIGINS",
                "http://localhost:5173,http://127.0.0.1:5173,"
                "http://localhost:4173,http://127.0.0.1:4173",
            )
        )
    )
    cors_origin_regex: str | None = field(
        default_factory=lambda: os.getenv(
            "CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app"
        )
        or None
    )
    # A device is ONLINE only if a reading arrived within this window.
    device_online_window_seconds: int = field(
        default_factory=lambda: int(os.getenv("DEVICE_ONLINE_WINDOW_SECONDS", "180"))
    )
    default_device_id: str = field(
        default_factory=lambda: os.getenv("DEFAULT_DEVICE_ID", "ESP32-001")
    )
    # Optional PyTorch model (results/ of the training script). If torch is not
    # installed or the files are missing, ML inference is skipped gracefully
    # and predictions fall back to the rule-based assessment (never faked).
    ml_model_path: str = field(
        default_factory=lambda: os.getenv(
            "ML_MODEL_PATH", str(REPO_ROOT / "results" / "best_model.pt")
        )
    )
    ml_scaler_path: str = field(
        default_factory=lambda: os.getenv(
            "ML_SCALER_PATH", str(REPO_ROOT / "results" / "scaler.json")
        )
    )


def get_settings(**overrides) -> Settings:
    settings = Settings()
    for key, value in overrides.items():
        if value is not None:
            setattr(settings, key, value)
    return settings

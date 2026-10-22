"""Configured parameter ranges and status logic.

These mirror the frontend exactly (src/data/parameters.ts + src/lib/status.ts)
so the API and the dashboard never disagree. They are *configured monitoring
ranges for this prototype* — they are NOT validated drinking-water limits and
a NORMAL result here is not a statement that water is safe to drink.
"""
from __future__ import annotations

# api field name -> (label, unit, range_min, range_max)
PARAMETERS: dict[str, dict] = {
    "ph": {"label": "pH", "unit": "pH", "min": 6.5, "max": 8.5},
    "turbidity": {"label": "Turbidity", "unit": "NTU", "min": 0.0, "max": 5.0},
    "temperature": {"label": "Temperature", "unit": "°C", "min": 15.0, "max": 35.0},
    "tds": {"label": "TDS", "unit": "ppm", "min": 0.0, "max": 500.0},
    "conductivity": {"label": "Conductivity", "unit": "µS/cm", "min": 0.0, "max": 1000.0},
    "dissolved_oxygen": {"label": "Dissolved Oxygen", "unit": "mg/L", "min": 5.0, "max": 12.0},
}

# Frontend (camelCase) key for each API field, used in prediction responses.
FRONTEND_KEY = {
    "ph": "ph",
    "turbidity": "turbidity",
    "temperature": "temperature",
    "tds": "tds",
    "conductivity": "conductivity",
    "dissolved_oxygen": "dissolvedOxygen",
}


def parameter_status(value: float, field: str) -> str:
    """NORMAL | WARNING | CRITICAL — same rule as src/lib/status.ts:
    outside the range = WARNING; outside by more than 25% of the range
    width = CRITICAL."""
    cfg = PARAMETERS[field]
    lo, hi = cfg["min"], cfg["max"]
    if lo <= value <= hi:
        return "NORMAL"
    width = hi - lo
    outside = (lo - value) if value < lo else (value - hi)
    return "CRITICAL" if outside > width * 0.25 else "WARNING"

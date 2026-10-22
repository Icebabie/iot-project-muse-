"""Phase 1 acceptance tests + validation + persistence.

Run (from backend/):  .venv/bin/pytest -q
Covers the user's acceptance test:
  POST a reading -> GET latest -> GET history -> (data lives in a real
  SQLite file, so a fresh app instance on the same file still sees it).
"""
import os
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.main import create_app  # noqa: E402

SAMPLE = {
    "device_id": "ESP32-001",
    "timestamp": "2026-10-22T10:00:00Z",
    "ph": 7.24, "turbidity": 3.42, "temperature": 26.8,
    "tds": 318, "conductivity": 642, "dissolved_oxygen": 6.7,
}
ABNORMAL = {
    "device_id": "ESP32-001",
    "timestamp": "2026-10-22T10:01:00Z",
    "ph": 7.1, "turbidity": 9.5, "temperature": 27.0,
    "tds": 950, "conductivity": 1500, "dissolved_oxygen": 6.5,
}


@pytest.fixture()
def db_file(tmp_path):
    return tmp_path / "test.db"


@pytest.fixture()
def client(db_file):
    app = create_app(database_url=f"sqlite:///{db_file}")
    with TestClient(app) as c:
        yield c


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["database"] == "ok"


def test_empty_state_404s_and_device_offline(client):
    assert client.get("/api/v1/readings/latest").status_code == 404
    assert client.get("/api/v1/predictions/latest").status_code == 404
    status = client.get("/api/v1/device/status").json()
    assert status["state"] == "OFFLINE"
    assert status["data_ingestion"] == "NO_DATA"
    assert status["sensors_active"] == 0


def test_post_then_latest_and_history(client):
    r = client.post("/api/v1/readings", json=SAMPLE)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["device_id"] == "ESP32-001" and body["ph"] == 7.24
    assert body["received_at"] is not None

    latest = client.get("/api/v1/readings/latest", params={"device_id": "ESP32-001"})
    assert latest.status_code == 200
    assert latest.json()["turbidity"] == 3.42

    history = client.get("/api/v1/readings/history", params={"device_id": "ESP32-001"})
    assert history.status_code == 200
    assert len(history.json()) == 1


def test_history_is_chronological(client):
    client.post("/api/v1/readings", json=ABNORMAL)   # later timestamp, posted first
    client.post("/api/v1/readings", json=SAMPLE)
    rows = client.get("/api/v1/readings/history").json()
    assert [r["timestamp"] for r in rows] == sorted(r["timestamp"] for r in rows)
    latest = client.get("/api/v1/readings/latest").json()
    assert latest["turbidity"] == 9.5  # newest by timestamp wins


def test_persistence_across_app_restart(client, db_file):
    """Same SQLite file, brand-new app instance (simulated restart)."""
    assert client.post("/api/v1/readings", json=SAMPLE).status_code == 201
    app2 = create_app(database_url=f"sqlite:///{db_file}")
    with TestClient(app2) as client2:
        latest = client2.get("/api/v1/readings/latest")
        assert latest.status_code == 200
        assert latest.json()["ph"] == 7.24


@pytest.mark.parametrize("bad", [
    {**SAMPLE, "ph": 99},                       # implausible
    {**SAMPLE, "turbidity": -1},                 # negative
    {**SAMPLE, "ph": "seven"},                   # non-numeric
    {k: v for k, v in SAMPLE.items() if k != "device_id"},  # missing device
    {"device_id": "ESP32-001"},                  # no parameters at all
    {**SAMPLE, "surprise_field": 1},             # unknown field
    {**SAMPLE, "timestamp": "2999-01-01T00:00:00Z"},  # far future
])
def test_invalid_payloads_rejected_and_not_stored(client, bad):
    r = client.post("/api/v1/readings", json=bad)
    assert r.status_code == 422, r.text
    assert client.get("/api/v1/readings/history").json() == []


def test_partial_reading_with_nulls_is_stored(client):
    partial = {"device_id": "ESP32-002", "timestamp": "2026-10-22T11:00:00Z",
               "ph": 7.0, "turbidity": None, "temperature": 25.0,
               "tds": None, "conductivity": None, "dissolved_oxygen": None}
    r = client.post("/api/v1/readings", json=partial)
    assert r.status_code == 201
    assert r.json()["turbidity"] is None  # missing sensor stays null, not invented
    status = client.get("/api/v1/device/status", params={"device_id": "ESP32-002"}).json()
    assert status["sensors_active"] == 2 and status["sensors_total"] == 6


def test_alerts_generated_and_persisted_for_abnormal_reading(client):
    client.post("/api/v1/readings", json=SAMPLE)      # all in range -> no alerts
    assert client.get("/api/v1/alerts").json() == []
    client.post("/api/v1/readings", json=ABNORMAL)    # turbidity/tds/conductivity out
    alerts = client.get("/api/v1/alerts").json()
    params = {a["parameter"] for a in alerts}
    assert params == {"turbidity", "tds", "conductivity"}
    assert all(a["active"] for a in alerts)
    turb = next(a for a in alerts if a["parameter"] == "turbidity")
    assert turb["severity"] == "CRITICAL"  # 9.5 is >25% of range width above max 5


def test_prediction_latest_includes_rule_and_ml(client):
    client.post("/api/v1/readings", json=ABNORMAL)
    pred = client.get("/api/v1/predictions/latest").json()
    assert pred["rule_based_label"] == "ABNORMAL"   # turbidity/tds/EC far out of range
    assert pred["ml_available"] is True            # exported numpy weights ship in-app
    assert pred["label"] in ("NORMAL", "WARNING", "ABNORMAL")
    assert 0.0 <= pred["anomaly_score"] <= 1.0


def test_prediction_fallback_when_ml_unavailable(client, monkeypatch):
    """If neither numpy weights nor torch can load, predictions must fall
    back to rule-based with confidence null — never a fabricated number."""
    import app.services.ml_inference as ml

    monkeypatch.setitem(ml._np_cache, "loaded", True)
    monkeypatch.setitem(ml._np_cache, "data", None)
    monkeypatch.setitem(ml._torch_cache, "loaded", True)
    monkeypatch.setitem(ml._torch_cache, "paths", ("/nonexistent/best_model.pt", "/nonexistent/scaler.json"))
    monkeypatch.setitem(ml._torch_cache, "model", None)
    monkeypatch.setitem(ml._torch_cache, "scaler", None)
    client.post("/api/v1/readings", json=ABNORMAL)
    pred = client.get("/api/v1/predictions/latest").json()
    assert pred["ml_available"] is False
    assert pred["label"] == "ABNORMAL"              # rule-based label takes over
    assert pred["confidence"] is None


def test_manual_prediction_uses_exported_ml_weights(client):
    r = client.post("/api/v1/predictions/manual", json={
        "ph": 7.24, "turbidity": 3.42, "temperature": 26.8,
        "tds": 318, "conductivity": 642, "dissolved_oxygen": 6.7})
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["ml_available"] is True            # numpy weights ship with the app
    assert d["label"] in ("NORMAL", "WARNING", "ABNORMAL")
    assert d["confidence"] is not None and 0 <= d["confidence"] <= 100
    assert abs(sum(d["probabilities"].values()) - 100) < 0.5
    assert d["features_used_by_model"] == ["ph", "temperature", "dissolvedOxygen", "conductivity"]
    # manual predictions must not be stored as readings
    assert client.get("/api/v1/readings/history").json() == []


def test_manual_prediction_rejects_implausible(client):
    r = client.post("/api/v1/predictions/manual", json={
        "ph": 42, "temperature": 26.8, "conductivity": 642, "dissolved_oxygen": 6.7})
    assert r.status_code == 422


def test_maintenance_flags_stuck_sensor(client):
    stuck = {"device_id": "ESP32-001", "ph": 7.0, "turbidity": 3.0,
             "temperature": 25.0, "tds": 300, "conductivity": 600,
             "dissolved_oxygen": 6.5}
    for minute in range(12):  # 12 identical readings => stuck on every parameter
        payload = {**stuck, "timestamp": f"2026-10-22T12:{minute:02d}:00Z"}
        assert client.post("/api/v1/readings", json=payload).status_code == 201
    m = client.get("/api/v1/maintenance", params={"device_id": "ESP32-001"}).json()
    assert m["overall"] == "SERVICE"
    ph = next(s for s in m["sensors"] if s["parameter"] == "ph")
    assert ph["health"] == "SERVICE"
    assert any("stuck" in r for r in ph["reasons"])

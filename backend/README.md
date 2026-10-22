# Backend — Smart Water Quality Monitoring API

FastAPI + SQLAlchemy. SQLite for local development, PostgreSQL in production
(set `DATABASE_URL`). The frontend (repo root) is a separate application.

## Run locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs · Health: http://localhost:8000/health
- Database file `water_quality.db` is created automatically on first start.

## Quick acceptance test

```bash
curl -X POST localhost:8000/api/v1/readings -H 'Content-Type: application/json' -d \
  '{"device_id":"ESP32-001","ph":7.24,"turbidity":3.42,"temperature":26.8,"tds":318,"conductivity":642,"dissolved_oxygen":6.7}'
curl "localhost:8000/api/v1/readings/latest?device_id=ESP32-001"
curl "localhost:8000/api/v1/readings/history?device_id=ESP32-001"
# restart uvicorn, then repeat the latest call — the reading persists.
```

## Simulator

```bash
python simulator/simulator.py                                   # normal, 5 s cadence, device SIM-001
python simulator/simulator.py --scenario turbidity_spike --count 30 --interval 2
python simulator/simulator.py --source-csv ../processed/aqua_clean_full.csv --count 20 --interval 1
```

## Tests

```bash
pytest -q        # 15 tests: acceptance flow, validation, persistence, alerts, prediction
```

## Endpoints

| Method & path | Notes |
|---|---|
| `GET /health` | status + DB check |
| `POST /api/v1/readings` | ingest (ESP32 contract: `../docs/ESP32_CONTRACT.md`), 201 / 422 |
| `GET /api/v1/readings/latest?device_id=` | 404 until the first reading |
| `GET /api/v1/readings/history?device_id=&limit=100&since=&until=` | chronological |
| `GET /api/v1/alerts?device_id=&limit=50&active_only=` | persisted, newest first |
| `GET /api/v1/device/status?device_id=` | freshness-derived; never claims online without data |
| `GET /api/v1/predictions/latest?device_id=` | rule-based always; ML (PyTorch SimpleMLP) when `requirements-ml.txt` is installed and `results/best_model.pt` + `scaler.json` are present; `confidence` is `null` in rule-based-only mode — never fabricated |

## Configuration (environment)

See `.env.example`. Key variables: `DATABASE_URL`, `CORS_ORIGINS`,
`CORS_ORIGIN_REGEX` (Vercel), `DEVICE_ONLINE_WINDOW_SECONDS` (default 180),
`DEFAULT_DEVICE_ID`, `ML_MODEL_PATH`, `ML_SCALER_PATH`. No secrets in code.

## Production deployment

Free-tier walkthrough (Render + Neon, $0, no card): see
`../docs/DEPLOYMENT_FREE.md`. The repo root has a `render.yaml` Blueprint,
and `psycopg[binary]` is already in requirements.txt.

1. Provision PostgreSQL; set `DATABASE_URL=postgresql+psycopg://…`.
2. Run behind a process manager / container: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
   (Render, Railway, Fly.io, a VPS, etc. all work — it is a plain ASGI app).
3. Set `CORS_ORIGINS` to your Vercel domain (the default regex already
   allows `https://*.vercel.app`).
4. In Vercel: set `VITE_API_BASE_URL` to the backend's public HTTPS URL and redeploy.

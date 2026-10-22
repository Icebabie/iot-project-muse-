# Inspection findings & implementation plan
_Generated 2026-10-22 from a fresh clone of https://github.com/Icebabie/Water-Quality-Monitoring-IoT-project (main, commit d8fbe94)._

## 1. What already exists

### Frontend (repo root — keep it there, Vercel deploys from root)
- React 18.3 + Vite 5 + TypeScript + Tailwind 3, Recharts for charts, lucide-react icons. Scripts: `npm run dev|build|preview` (`build` = `tsc -b && vite build`).
- Single page: `src/App.tsx` -> `src/pages/Dashboard.tsx`.
- Components (all presentational, props-only): `Header`, `SensorCard` (x6), `WaterQualityStatus`,
  `TrendChart` (parameter switcher, configured-range band, min/max/avg), `AlertsPanel`,
  `PredictionCard`, `ParameterTable`, `DeviceStatus`, `StatusBadge`.
- **Data flow (the key finding):** every byte the UI shows comes through ONE module,
  `src/services/waterQualityService.ts`, called by `src/hooks/useWaterQualityData.ts`
  (loads all five resources, polls every 5 s when auto-refresh is on). Components never
  fetch or import mock data directly. So Phase 3 only rewrites the service layer
  (+ null/empty handling) — no component redesign is needed.
- Service functions today (all mock, from `src/data/mockData.ts`):
  `getLatestReading`, `getHistoricalReadings`, `getAlerts`, `getPrediction`, `getDeviceStatus`.
- Mock behaviour worth knowing: `getLatestReading()` *invents* a new reading on every poll
  (mean-reverting random walk around baseline pH 7.22 / turbidity 3.3 NTU / 26.6 C /
  TDS 316 ppm / EC 640 uS/cm / DO 6.8 mg/L, 40-point history at 1 sample/min).
  The backend/simulator baseline mirrors these numbers so the UI looks the same.
- Types (`src/types/waterQuality.ts`) are camelCase (`deviceId`, `dissolvedOxygen`) and
  currently require every parameter to be a `number`. The API is snake_case
  (`device_id`, `dissolved_oxygen`, per the ESP32 contract), so the service layer maps
  between the two, and the types are widened to `number | null` for missing sensors.
- Parameter config (`src/data/parameters.ts`) — demo ranges, explicitly *not* validated
  drinking-water limits: pH 6.5–8.5, turbidity 0–5 NTU, temperature 15–35 °C,
  TDS 0–500 ppm, conductivity 0–1000 µS/cm, dissolved oxygen 5–12 mg/L.
  Status logic (`src/lib/status.ts`): outside range = WARNING; outside by >25% of the
  range width = CRITICAL. The backend thresholds mirror this exactly so UI and API agree.

### ML / data (repo root + `processed/`, `results/`)
- `train_simple_dl.py`: PyTorch, 3 models (SimpleMLP, DeepMLP, CNN1D), **AdamW**
  (lr 1e-3, wd 1e-4), early stopping, class-weighted loss. Best = **SimpleMLP**
  (4 -> 64 -> 32 -> 3). Features (4 only): `ph, temperature, dissolvedOxygen, conductivity_log10`
  where `conductivity_log10 = log10(conductivity + 1)`. Target `cpcb_tier`
  (NORMAL / WARNING / ABNORMAL).
- `results/best_model.pt` (SimpleMLP state_dict) + `results/scaler.json` (feature order,
  mean/std) are present and are exactly what an inference service needs.
  Repo-reported test metrics for SimpleMLP (mean of 5 seeds): accuracy 0.720 ± 0.032,
  macro-F1 0.745 ± 0.037, AUC 0.842 ± 0.036, ABNORMAL recall 1.00. These are the
  *training script's* numbers — they are quoted, not re-measured here.
- `processed/aqua_clean_full.csv` (the file the user called `aqua_clean_full.csn`):
  India Aquaattributes, **1,361 rows**. Columns: ph, temperature, dissolvedOxygen,
  conductivity, bod, nitrate, fecal/total coliform, `cpcb_class`, `cpcb_tier`
  (397 NORMAL / 689 WARNING / 68 ABNORMAL / 207 unlabelled), plus `tds_derived`.
  **No turbidity column. No measured TDS** — `tds_derived = 0.64 x conductivity`
  (standard rule of thumb, already in the file).
- `processed/kaggle_clean_full.csv` *does* have turbidity (mean 3.97, range 2.15–5.76 NTU)
  and a `tds` column, but that column is Kaggle "Solids" (~22,000 ppm scale) — it is NOT
  dashboard-scale TDS (0–500 ppm) and must not be merged in as TDS. Its turbidity
  distribution is, however, a sane shape reference for synthetic turbidity.
- `cpcb_tier` caveat (from `processed/README.md`): it is an *illustrative* grouping of
  CPCB classes (A,B=NORMAL; C,D=WARNING; E,Below E=ABNORMAL), not an official CPCB
  grouping, and not a drinking-water safety determination.

### Backend
- **None.** `main.py` is a hello-world stub; `pyproject.toml` only lists ML deps.
  `vite.config.ts` even contains a comment anticipating a FastAPI proxy. Green field,
  built in `backend/` so frontend and backend stay separate applications.

## 2. API contract (canonical, snake_case)

| Endpoint | Purpose |
|---|---|
| `GET /health` | Liveness + DB check |
| `POST /api/v1/readings` | Ingest one reading (ESP32 + simulator use this). 201 on success |
| `GET /api/v1/readings/latest?device_id=` | Most recent reading, 404 if none |
| `GET /api/v1/readings/history?device_id=&limit=100` | Stored readings, chronological (oldest -> newest) |
| `GET /api/v1/alerts?device_id=&limit=50&active_only=` | Persisted alerts, newest first |
| `GET /api/v1/device/status?device_id=` | Freshness-derived device/system status |
| `GET /api/v1/predictions/latest?device_id=` | Rule-based assessment + ML prediction if the model loads, 404 if no readings |

Reading payload: `device_id` (required), `timestamp` (optional ISO-8601; server stamps
receipt time if absent), and any of `ph, turbidity, temperature, tds, conductivity,
dissolved_oxygen` — each nullable; `null` = sensor not installed / no value, never invented.
Validation rejects non-numeric, NaN/inf, and physically implausible values
(pH 0–14, turbidity 0–1000 NTU, temperature 0–50 °C, TDS 0–10000 ppm,
conductivity 0–20000 µS/cm, DO 0–20 mg/L) and payloads with no parameter at all.

Device status honesty rule: `state` is derived from the age of the last stored reading
(`DEVICE_ONLINE_WINDOW_SECONDS`, default 180 s). No readings => `OFFLINE`, never "online
because the API is up". Wi-Fi is reported as `UNKNOWN` by the API (a POST alone cannot
prove Wi-Fi state); the frontend adapter labels it from data freshness and documents that.

## 3. File structure added

```
backend/
  app/  config.py db.py models.py schemas.py thresholds.py main.py
        routers/ readings.py alerts.py device.py predictions.py
        services/ analysis.py ml_inference.py
  simulator/simulator.py     # stdlib-only, random-walk + CSV-replay, scenarios
  ml/train_anomaly.py        # optional IsolationForest training (Phase 4)
  tests/test_api.py          # pytest acceptance + validation + persistence
  requirements.txt  requirements-ml.txt  .env.example  README.md
data/augment_dataset.py      # builds the 6-parameter SYNTHETIC-augmented CSV
docs/  (this file, ESP32_CONTRACT.md, DATASET_AUGMENTATION.md)
```

## 4. Phases / order of work
1. Backend ingestion + persistence + health (acceptance test below). **First.**
2. Simulator (normal / turbidity_spike / tds_rise / do_drop / replay of real CSV rows).
3. Threshold analysis + persisted alerts + device status (built into ingestion from day 1).
4. ML inference (optional torch; graceful fallback to rule-based, `is_demo` stays honest)
   + dataset augmentation for the requested 6-parameter retrain.
5. Frontend service-layer swap, `VITE_API_BASE_URL`, CORS, loading/error/empty/stale states.
6. Tests, README, deployment notes (SQLite local, `DATABASE_URL` PostgreSQL in prod,
   Vercel env var instructions).

## 5. Acceptance test (Phase 1)
Start backend -> POST a sample reading -> GET latest returns it -> GET history returns it ->
restart backend -> GET latest still returns it (SQLite persistence) -> invalid payloads get 422
and store nothing. Covered by `backend/tests/test_api.py` and a manual curl run.

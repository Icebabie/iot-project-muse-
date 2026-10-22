# Work done till now — Smart Water Quality Monitoring System
_Handover note (for the user / the next assistant). 2026-10-22._
_Repo: https://github.com/Icebabie/Water-Quality-Monitoring-IoT-project — all work is in the local clone at ~/workspace/projects/water-quality, NOT yet committed/pushed._

## Inspected first (no assumptions)
React 18 + Vite + TS + Tailwind dashboard at repo root; all data flows through
`src/services/waterQualityService.ts`. DL: `train_simple_dl.py`, SimpleMLP (AdamW),
4 features [ph, temperature, dissolvedOxygen, conductivity_log10] -> cpcb_tier,
artifacts in `results/` (best_model.pt + scaler.json). Dataset
`processed/aqua_clean_full.csv`: 1,361 India rows, NO turbidity, NO measured TDS
(tds_derived = 0.64*EC exists). Full findings: `docs/INSPECTION_AND_PLAN.md`.

## Done and verified
1. **Phase 1 backend** (`backend/app/`): FastAPI + SQLAlchemy, endpoints
   POST/GET `/api/v1/readings`, `/latest`, `/history`, `/api/v1/alerts`,
   `/api/v1/device/status`, `/api/v1/predictions/latest`, `/health`.
   Strict validation (plausible ranges, finite numbers, >=1 parameter, unknown
   fields rejected -> 422, nothing stored). Nullable parameters end-to-end.
   SQLite local, `DATABASE_URL` for PostgreSQL. CORS for localhost + *.vercel.app.
2. **Acceptance test PASSED live**: POST sample -> 201, GET latest/history return
   it, invalid payload -> 422, server restarted -> reading still returned.
   `pytest`: **15 passed**. Frontend `npm run build`: **passes**.
3. **Phase 2 simulator** (`backend/simulator/simulator.py`, stdlib only):
   scenarios normal / turbidity_spike / tds_rise / do_drop / mixed, plus
   `--source-csv` replay of real aqua rows (turbidity sent as honest null).
   Tested live: spike produced WARNING then CRITICAL turbidity alerts.
4. **Phases 4/5 (rule-based core)**: thresholds mirror the frontend exactly;
   alerts generated on ingestion and persisted; device status derived from
   data freshness (180 s window) — OFFLINE when no data, Wi-Fi reported
   UNKNOWN by the API. ML inference (`app/services/ml_inference.py`) loads the
   real SimpleMLP when torch is installed; otherwise predictions are
   rule-based with `confidence: null` (never fabricated). Isolation Forest
   trainer written (`backend/ml/train_anomaly.py`) but NOT yet wired into
   inference — the API's anomaly_score is the documented rule-based proxy.
5. **Phase 3 frontend**: service layer rewritten to call the real API
   (snake_case -> camelCase mapping, UTC fix), `VITE_API_BASE_URL` env
   (`.env.example`; localhost fallback only in `vite dev`), types widened to
   `number | null`, and loading / error / empty-data / stale-data states added
   to the Dashboard. No component redesign; mock file retained but unused.
   End-to-end smoke: all 5 API endpoints 200, CORS preflight from a
   vercel.app origin 200.
6. **Dataset augmentation** (`data/augment_dataset.py`, seed 42):
   `processed/aqua_*_6param_synthetic.csv` — `tds` = derived (0.64*EC, flagged),
   `turbidity` = SYNTHETIC (flagged; mean 3.19 / median 2.73 NTU, formula +
   warnings in `docs/DATASET_AUGMENTATION.md`). **Do not quote metrics trained
   on the synthetic column as real performance** (circular + TDS is collinear
   with EC). Exact retrain changes for train_simple_dl.py are documented there.
7. **Docs**: root + backend READMEs (run commands for all three processes),
   `docs/ESP32_CONTRACT.md` (payload, units, null rules, cadence),
   backend `.env.example`, deployment sketch (Postgres + Vercel env var).

## Not done / next steps
- Commit + push to GitHub (user to review the diff first), deploy the backend
  (Render/Railway/Fly/VPS), set `VITE_API_BASE_URL` in Vercel, redeploy.
- Install `backend/requirements-ml.txt` (torch) in the deployment and verify
  the SimpleMLP inference path live; wire Isolation Forest artifact into the
  anomaly score if wanted.
- ESP32 firmware per `docs/ESP32_CONTRACT.md` when hardware is ready.
- Replace synthetic turbidity with measured data before any scientific claim
  about a 6-parameter model.

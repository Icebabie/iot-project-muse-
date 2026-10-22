# Smart Water Quality Monitoring and Prediction System

Live-monitoring prototype for pH, turbidity, temperature, TDS, conductivity and
dissolved oxygen. React dashboard + FastAPI backend + (future) ESP32 hardware.
Simulated readings stand in for the hardware until it is integrated — the whole
software path (ingest -> store -> analyse -> alert -> display) works today.

> Configured ranges in this project are prototype monitoring ranges.
> They are **not** validated drinking-water limits, and a NORMAL result is
> not a statement that water is safe to drink.

## Repository layout

| Path | What |
|---|---|
| `src/` | React + Vite + TypeScript dashboard (deployed on Vercel) |
| `backend/` | FastAPI backend — see `backend/README.md` |
| `backend/simulator/` | Sensor simulator (random-walk scenarios + real-CSV replay) |
| `processed/` | Cleaned datasets (India aqua + Kaggle) and 6-parameter synthetic augmentation |
| `train_simple_dl.py`, `results/` | PyTorch DL training (SimpleMLP/DeepMLP/CNN1D, AdamW) + trained artifacts |
| `data/augment_dataset.py` | Builds the 6-parameter dataset — read `docs/DATASET_AUGMENTATION.md` first |
| `docs/` | `INSPECTION_AND_PLAN.md`, `ESP32_CONTRACT.md`, `DATASET_AUGMENTATION.md` |

## Run the whole prototype locally

Terminal 1 — backend:
```bash
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — simulator (sends readings every 5 s):
```bash
python backend/simulator/simulator.py --scenario mixed --device-id ESP32-001
```
(Use `--device-id ESP32-001` so the dashboard, which watches that device by
default, shows the simulated stream. The simulator's own default is SIM-001
so simulated data is never confused with a real device.)

Terminal 3 — dashboard:
```bash
npm install
cp .env.example .env.local   # VITE_API_BASE_URL=http://localhost:8000
npm run dev                  # http://localhost:5173
```

## Tests

```bash
cd backend && pytest -q      # API acceptance, validation, persistence, alerts
npm run build                # frontend type-check + production build
```

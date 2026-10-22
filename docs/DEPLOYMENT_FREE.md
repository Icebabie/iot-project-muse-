# Free deployment guide (total cost: $0, no credit card)

Stack chosen for this project — all free tiers, verified Oct 2026:

| Piece | Platform | Why / limits that matter |
|---|---|---|
| Frontend | **Vercel** (Hobby) | Same as before, static Vite build, free |
| Backend | **Render** free Web Service | No card required. Spins down after **15 min** without traffic; first request afterwards takes **~1 minute** to wake. **Filesystem is ephemeral** — a local SQLite file would be wiped on every spin-down/redeploy, which is why the database is external (next row) |
| Database | **Neon** free PostgreSQL | No card required, permanent free tier (1 GB storage/project, 100 compute-hours/month, scales to zero when idle). Render's own free Postgres **expires after 30 days**, so we don't use it |

Free hours note: Render gives 750 instance-hours/month per workspace — plenty
for one service that is allowed to sleep. Don't run an aggressive external
"keep-alive pinger": a permanently-awake service eats the whole allowance.

Order matters: database first (you need its URL), then backend (you need its
URL), then frontend.

---

## Step 1 — Neon database (~3 minutes)

1. Sign up at **neon.tech** (GitHub/Google login, no card).
2. *Create project*: name `water-quality`. Region: pick the closest offered
   (for India that is usually **Singapore / ap-southeast-1**). Default
   database name is fine.
3. On the project dashboard, open **Connect** and copy the connection string.
   It looks like:
   `postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require`
4. Edit it in exactly one place — add the driver name our SQLAlchemy setup uses:
   `postgresql+psycopg://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require`
   Keep this string private; it contains your DB password. You will paste it
   into Render in Step 2 — never commit it to GitHub.

## Step 2 — Render backend (~5 minutes + first build)

1. Sign up at **render.com** with your GitHub account (no card for free tier).
2. **New → Blueprint**, connect `Icebabie/iot-project-muse-`. The repo root
   contains `render.yaml`, which pre-fills: root directory `backend`,
   build `pip install -r requirements.txt`,
   start `uvicorn app.main:app --host 0.0.0.0 --port $PORT`,
   health check `/health`, plan **free**.
   (Manual alternative: **New → Web Service**, same repo, and type those
   settings in yourself.)
3. When asked for `DATABASE_URL`, paste the edited Neon string from Step 1.
4. **Apply / Create**. First build takes a few minutes.
5. Verify (replace with your service URL, e.g. `https://water-quality-api.onrender.com`):
   - Open `https://YOUR-API.onrender.com/health` → expect
     `{"status":"ok","database":"ok",...}` (first hit may take ~1 min — cold start).
   - Test ingestion:
     ```bash
     curl -X POST https://YOUR-API.onrender.com/api/v1/readings \
       -H 'Content-Type: application/json' \
       -d '{"device_id":"ESP32-001","ph":7.24,"turbidity":3.42,"temperature":26.8,"tds":318,"conductivity":642,"dissolved_oxygen":6.7}'
     curl "https://YOUR-API.onrender.com/api/v1/readings/latest?device_id=ESP32-001"
     ```
     The second call returning your reading from Neon Postgres is the
     production version of the persistence acceptance test.

## Step 3 — Vercel frontend (new project, ~3 minutes)

1. **Add New → Project**, import `Icebabie/iot-project-muse-`.
2. Framework preset: **Vite** (auto-detected). Root directory: `./` (repo root).
   Build/output defaults are correct (`npm run build`, `dist`).
3. **Environment Variables** (Production):
   - `VITE_API_BASE_URL` = `https://YOUR-API.onrender.com`  ← no trailing slash
   - `VITE_DEVICE_ID` = `ESP32-001`
4. **Deploy**. CORS is already configured on the backend for
   `https://*.vercel.app`, so no backend change is needed for your new domain.
5. If you ever change an env var, redeploy — Vite bakes them in at build time.

## Step 4 — Show live data on the deployed dashboard

The deployed system starts empty on purpose (no fake data anymore). Feed it:

```bash
python backend/simulator/simulator.py \
  --base-url https://YOUR-API.onrender.com \
  --device-id ESP32-001 --scenario mixed
```

Then open the Vercel URL: real readings, charts, alerts and device status,
all served from Neon via Render. First load after 15 idle minutes will be
slow (~1 min) while Render wakes — the dashboard's error/stale banners are
honest about this. For a viva/demo, open the backend `/health` URL a minute
before you start, to wake it up.

## Troubleshooting

- Backend `/health` says database `error` → `DATABASE_URL` is wrong; check the
  `+psycopg` edit and that Neon's `sslmode=require` is still on the string.
- Dashboard shows the red "could not reach the backend" banner → wrong
  `VITE_API_BASE_URL` in Vercel, or you changed it without redeploying.
- Dashboard says "No sensor readings yet" → backend is fine, it just has no
  data for `ESP32-001` yet; run Step 4.
- Everything is slow once, then fast → that's the Render free cold start,
  not a bug.

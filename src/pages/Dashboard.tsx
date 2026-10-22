import { Pause, Play } from "lucide-react";
import { useMemo, useState } from "react";
import AlertsPanel from "../components/AlertsPanel";
import DeviceStatus from "../components/DeviceStatus";
import Header from "../components/Header";
import ParameterTable from "../components/ParameterTable";
import PredictionCard from "../components/PredictionCard";
import SensorCard from "../components/SensorCard";
import TrendChart from "../components/TrendChart";
import WaterQualityStatus from "../components/WaterQualityStatus";
import { useWaterQualityData } from "../hooks/useWaterQualityData";
import { formatTime } from "../lib/format";
import { buildParameters, getOverallStatus } from "../lib/status";

export default function Dashboard() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { latest, previous, history, alerts, prediction, device, loading, error, stale } =
    useWaterQualityData(autoRefresh);

  const params = useMemo(
    () => (latest ? buildParameters(latest, previous ?? undefined) : []),
    [latest, previous],
  );
  const overall = getOverallStatus(params);
  const attention = params.filter((p) => p.status !== "NORMAL").length;
  const activeAlerts = alerts.filter((a) => a.active).length;

  return (
    <div className="min-h-screen">
      <Header device={device} />

      <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Water Quality Overview</h1>
            <p className="text-sm text-ink-500">
              Real-time monitoring and intelligent analysis of water-quality parameters.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-ink-700">
            <span>
              Last updated: <span className="font-mono">{latest ? formatTime(latest.timestamp) : "--:--:--"}</span>
            </span>
            <button
              onClick={() => setAutoRefresh((v) => !v)}
              className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 hover:bg-slate-50"
              aria-pressed={autoRefresh}
            >
              {autoRefresh ? <Pause size={12} /> : <Play size={12} />}
              Auto-refresh: <strong>{autoRefresh ? "ON" : "OFF"}</strong>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            Could not reach the backend API. Check that FastAPI is running and VITE_API_BASE_URL is set. ({error})
          </div>
        )}

        {stale && latest && (
          <div className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Stale data — the last reading is more than 3 minutes old. The device may be offline.
          </div>
        )}

        {loading ? (
          <div className="panel p-10 text-center text-sm text-ink-500">Loading sensor data…</div>
        ) : !latest ? (
          <div className="panel space-y-2 p-10 text-center text-sm text-ink-500">
            <p className="font-medium text-ink-700">No sensor readings yet</p>
            <p>
              The backend is reachable but has no stored data for this device. Start the simulator
              (<span className="font-mono">python backend/simulator/simulator.py</span>) or connect
              the ESP32 — readings will appear here automatically.
            </p>
            {device && <div className="mx-auto max-w-md pt-2 text-left"><DeviceStatus device={device} /></div>}
          </div>
        ) : (
          <>
            <section aria-label="Current sensor readings">
              <h2 className="panel-title mb-2">Current Sensor Readings</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {params.map((p) => (
                  <SensorCard key={p.config.key} param={p} />
                ))}
              </div>
            </section>

            <WaterQualityStatus
              status={overall}
              monitored={params.length}
              needingAttention={attention}
              activeAlerts={activeAlerts}
            />

            <TrendChart history={history} />

            <div className="grid gap-5 lg:grid-cols-5">
              <div className="lg:col-span-3"><AlertsPanel alerts={alerts} /></div>
              <div className="lg:col-span-2">
                {prediction ? (
                  <PredictionCard prediction={prediction} />
                ) : (
                  <section className="panel p-6 text-sm text-ink-500">No prediction available yet.</section>
                )}
              </div>
            </div>

            <ParameterTable params={params} />
            {device && <DeviceStatus device={device} />}
          </>
        )}

        <footer className="pb-4 pt-2 text-center text-[11px] text-ink-500">
          Demonstration data. Configured ranges are illustrative and are not validated drinking-water limits.
        </footer>
      </main>
    </div>
  );
}

import DataBanners, { type AppMode } from "../components/DataBanners";
import ParameterChart from "../components/ParameterChart";
import { PARAMETERS } from "../data/parameters";
import type { DashboardData } from "../hooks/useWaterQualityData";
import { formatTime } from "../lib/format";

/** Monitoring tab: a live chart per parameter, red wherever a value
 * leaves its configured range. Data refreshes on the same 5 s poll. */
export default function MonitoringPage({ data, mode }: { data: DashboardData; mode: AppMode }) {
  const { history, latest, loading } = data;
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Monitoring</h1>
          <p className="text-sm text-ink-500">
            Live chart for every parameter. Red segments = outside the configured range.
          </p>
        </div>
        <span className="text-xs text-ink-700">
          Last updated:{" "}
          <span className="font-mono">{latest ? formatTime(latest.timestamp) : "--:--:--"}</span>
          {" · "}{history.length} samples
        </span>
      </div>

      <DataBanners data={data} mode={mode} />

      {loading ? (
        <div className="panel p-10 text-center text-sm text-ink-500">Loading sensor data…</div>
      ) : history.length === 0 ? (
        <div className="panel p-10 text-center text-sm text-ink-500">
          No readings stored for this device yet — charts will appear as data arrives.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {PARAMETERS.map((cfg) => (
            <ParameterChart key={cfg.key} config={cfg} history={history} />
          ))}
        </div>
      )}
    </main>
  );
}

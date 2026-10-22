import { useMemo, useState } from "react";
import AlertsPanel from "../components/AlertsPanel";
import DataBanners, { type AppMode } from "../components/DataBanners";
import type { DashboardData } from "../hooks/useWaterQualityData";
import type { AlertSeverity } from "../types/waterQuality";

const FILTERS = ["ALL", "CRITICAL", "WARNING", "INFO"] as const;

/** Alerts tab: every alert generated when a value left its configured
 * range (plus its severity), most recent first, with severity filters. */
export default function AlertsPage({ data, mode }: { data: DashboardData; mode: AppMode }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const { alerts, loading } = data;

  const counts = useMemo(() => ({
    ALL: alerts.length,
    CRITICAL: alerts.filter((a) => a.severity === "CRITICAL").length,
    WARNING: alerts.filter((a) => a.severity === "WARNING").length,
    INFO: alerts.filter((a) => a.severity === "INFO").length,
  }), [alerts]);

  const shown = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Alerts</h1>
        <p className="text-sm text-ink-500">
          Generated automatically whenever a reading goes outside its configured
          range — WARNING just outside, CRITICAL when far outside. Stored in the
          database, newest first (latest 100).
        </p>
      </div>

      <DataBanners data={data} mode={mode} />

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Severity filter">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded border px-3 py-1 text-sm ${
              filter === f
                ? "border-aqua-600 bg-aqua-600 text-white"
                : "border-slate-200 bg-white text-ink-700 hover:bg-slate-50"
            }`}
          >
            {f} <span className="font-mono text-xs">({counts[f as AlertSeverity] ?? counts.ALL})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="panel p-10 text-center text-sm text-ink-500">Loading alerts…</div>
      ) : (
        <AlertsPanel alerts={shown} />
      )}
    </main>
  );
}

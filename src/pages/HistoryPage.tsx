import { useEffect, useState } from "react";
import DataBanners, { type AppMode } from "../components/DataBanners";
import StatusBadge from "../components/StatusBadge";
import { formatValue } from "../lib/format";
import { getReadingStatus } from "../lib/status";
import { getHistoricalReadings } from "../services/waterQualityService";
import type { DashboardData } from "../hooks/useWaterQualityData";
import type { SensorReading } from "../types/waterQuality";

const LIMITS = [50, 100, 250, 500, 1000];

/** Historical Data tab: the recorded readings table, straight from the
 * database via the API (newest first). Refreshes with the app poll. */
export default function HistoryPage({
  data, mode, deviceId,
}: {
  data: DashboardData;
  mode: AppMode;
  deviceId: string;
}) {
  const [limit, setLimit] = useState(250);
  const [rows, setRows] = useState<SensorReading[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHistoricalReadings(deviceId, limit)
      .then((r) => {
        if (!cancelled) {
          setRows([...r].reverse()); // API returns chronological; table shows newest first
          setLoadingRows(false);
          setFetchError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setLoadingRows(false);
          setFetchError(e instanceof Error ? e.message : "Failed to load history");
        }
      });
    return () => {
      cancelled = true;
    };
    // data.latest?.timestamp changes every poll -> table stays fresh
  }, [deviceId, limit, data.latest?.timestamp]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Historical Data</h1>
          <p className="text-sm text-ink-500">
            Recorded readings stored in the database for device{" "}
            <span className="font-mono">{deviceId}</span>, newest first.
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-ink-700">
          Show last
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="rounded border border-slate-200 bg-white px-2 py-1"
          >
            {LIMITS.map((n) => (
              <option key={n} value={n}>{n} readings</option>
            ))}
          </select>
        </label>
      </div>

      <DataBanners data={data} mode={mode} />
      {fetchError && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{fetchError}</div>
      )}

      <section className="panel overflow-hidden">
        <div className="border-b border-slate-200 px-4 py-3 text-xs text-ink-500">
          {loadingRows ? "Loading…" : `${rows.length} readings`}
        </div>
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="sticky top-0 bg-slate-50 text-xs text-ink-500">
              <tr>
                {["#", "Recorded at", "pH", "Turbidity (NTU)", "Temp (°C)", "TDS (ppm)",
                  "Conductivity (µS/cm)", "DO (mg/L)", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={`${r.timestamp}-${i}`} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-mono text-xs text-ink-500">{rows.length - i}</td>
                  <td className="px-4 py-2 font-mono text-xs">{fmtDate(r.timestamp)}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{formatValue(r.ph, 2)}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{formatValue(r.turbidity, 2)}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{formatValue(r.temperature, 1)}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{formatValue(r.tds, 0)}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{formatValue(r.conductivity, 0)}</td>
                  <td className="px-4 py-2 font-mono tabular-nums">{formatValue(r.dissolvedOxygen, 1)}</td>
                  <td className="px-4 py-2"><StatusBadge level={getReadingStatus(r)} /></td>
                </tr>
              ))}
              {!loadingRows && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-ink-500">
                    No readings recorded for this device yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

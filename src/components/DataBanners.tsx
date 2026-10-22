import type { DashboardData } from "../hooks/useWaterQualityData";

export type AppMode = "demo" | "real";

/** Shared status banners (error / stale / demo-source) shown on every tab. */
export default function DataBanners({ data, mode }: { data: DashboardData; mode: AppMode }) {
  return (
    <>
      {data.error && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          Could not reach the backend API. If it has been idle, the free server
          may need ~1 minute to wake up. ({data.error})
        </div>
      )}
      {mode === "demo" && (
        <div className="rounded border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-800">
          <strong>Demo mode</strong> — live feed of recorded Indian station data
          (aqua_clean_full.csv; TDS derived, turbidity synthetic).
          {data.demoRow && (
            <> Now showing: <strong>{data.demoRow.station}</strong>
              {data.demoRow.state ? `, ${data.demoRow.state}` : ""}.</>
          )}
          {" "}Switch to <strong>Real</strong> (top right) for live ESP32 sensor data.
        </div>
      )}
      {data.stale && data.latest && mode === "real" && (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Stale data — the last reading is more than 3 minutes old. The device may be offline.
        </div>
      )}
    </>
  );
}

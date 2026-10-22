import { useMemo } from "react";
import {
  CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { ParameterConfig } from "../types/waterQuality";
import type { SensorReading } from "../types/waterQuality";
import { formatTime, formatValue } from "../lib/format";
import { getParameterStatus } from "../lib/status";
import StatusBadge from "./StatusBadge";

/**
 * One parameter's live chart. The main line is teal; any stretch where the
 * value is outside the configured range is drawn again in RED (the overlay
 * series is null inside the range, so red segments appear exactly where the
 * reading left the normal band). The shaded band is the configured range.
 */
export default function ParameterChart({
  config, history,
}: {
  config: ParameterConfig;
  history: SensorReading[];
}) {
  const series = useMemo(
    () =>
      history.map((r) => {
        const v = r[config.key];
        const out = v !== null && getParameterStatus(v, config) !== "NORMAL";
        return { t: formatTime(r.timestamp, false), v, vOut: out ? v : null };
      }),
    [history, config],
  );
  const values = series.map((s) => s.v).filter((v): v is number => v !== null);
  const current = values.length ? values[values.length - 1] : null;
  const status = current === null ? "UNAVAILABLE" : getParameterStatus(current, config);
  const outCount = series.filter((s) => s.vOut !== null).length;

  const lo = Math.min(...(values.length ? values : [config.range.min]), config.range.min);
  const hi = Math.max(...(values.length ? values : [config.range.max]), config.range.max);
  const pad = (hi - lo) * 0.12 || 1;

  return (
    <section className="panel p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{config.label}</h3>
          <p className="text-[11px] text-ink-500">
            Range {config.range.min}–{config.range.max} {config.unit}
            {outCount > 0 && (
              <span className="font-medium text-red-600"> · {outCount} samples out of range</span>
            )}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-xl tabular-nums">
            {formatValue(current, config.decimals)}{" "}
            <span className="text-xs text-ink-500">{config.unit}</span>
          </div>
          <StatusBadge level={status} />
        </div>
      </div>

      <div className="mt-3 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <ReferenceArea y1={config.range.min} y2={config.range.max} fill="#10b981" fillOpacity={0.07} />
            <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#64748b" }} minTickGap={40} />
            <YAxis
              domain={[lo - pad, hi + pad]}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickFormatter={(v: number) => formatValue(v, config.decimals > 1 ? 1 : config.decimals)}
              width={44}
            />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 4, border: "1px solid #e2e8f0" }}
              formatter={(v: number, name: string) => [
                `${formatValue(v, config.decimals)} ${config.unit}`,
                name === "vOut" ? `${config.label} (out of range)` : config.label,
              ]}
            />
            <Line type="monotone" dataKey="v" stroke="#1d7fa8" strokeWidth={2}
              dot={false} activeDot={{ r: 3 }} isAnimationActive={false} connectNulls name="v" />
            <Line type="monotone" dataKey="vOut" stroke="#dc2626" strokeWidth={2.5}
              dot={{ r: 2.5, fill: "#dc2626", strokeWidth: 0 }} activeDot={{ r: 4 }}
              isAnimationActive={false} connectNulls={false} name="vOut" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

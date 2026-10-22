import { PARAMETERS } from "../data/parameters";
import type {
  OverallStatus,
  ParameterConfig,
  ParameterStatus,
  SensorParameter,
  SensorReading,
} from "../types/waterQuality";

/** Status vs. the configured range. Beyond 25% of the range width outside → CRITICAL. */
export function getParameterStatus(value: number, cfg: ParameterConfig): ParameterStatus {
  const { min, max } = cfg.range;
  if (value >= min && value <= max) return "NORMAL";
  const width = max - min;
  const outside = value < min ? min - value : value - max;
  return outside > width * 0.25 ? "CRITICAL" : "WARNING";
}

/** Combine the latest (and previous) reading into per-parameter view models. */
export function buildParameters(latest: SensorReading, previous?: SensorReading): SensorParameter[] {
  return PARAMETERS.map((config) => {
    const value = latest[config.key];
    const prevValue = previous?.[config.key];
    return {
      config,
      value,
      status: value === null ? "UNAVAILABLE" : getParameterStatus(value, config),
      delta: value !== null && prevValue != null ? value - prevValue : 0,
      timestamp: latest.timestamp,
    };
  });
}

export function getOverallStatus(params: SensorParameter[]): OverallStatus {
  if (params.some((p) => p.status === "CRITICAL")) return "ABNORMAL";
  if (params.some((p) => p.status === "WARNING")) return "WARNING";
  return "NORMAL";
}

/** Overall status of a single stored reading (for the Historical Data table). */
export function getReadingStatus(reading: SensorReading): OverallStatus {
  return getOverallStatus(buildParameters(reading));
}

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAlerts,
  getDeviceStatus,
  getHistoricalReadings,
  getLatestReading,
  getPrediction,
} from "../services/waterQualityService";
import type { Alert, DeviceStatus, Prediction, SensorReading } from "../types/waterQuality";

export interface DashboardData {
  latest: SensorReading | null;
  previous: SensorReading | null;
  history: SensorReading[];
  alerts: Alert[];
  prediction: Prediction | null;
  device: DeviceStatus | null;
  loading: boolean;
  error: string | null;
  /** Latest reading is older than the backend's online window (3 min). */
  stale: boolean;
}

/** Loads everything through the service layer and polls on an interval. */
export function useWaterQualityData(autoRefresh: boolean, intervalMs = 5000): DashboardData {
  const [data, setData] = useState<DashboardData>({
    latest: null, previous: null, history: [], alerts: [], prediction: null, device: null,
    loading: true, error: null, stale: false,
  });
  const latestRef = useRef<SensorReading | null>(null);

  const load = useCallback(async () => {
    try {
      const latest = await getLatestReading();
      const [history, alerts, prediction, device] = await Promise.all([
        getHistoricalReadings(), getAlerts(), getPrediction(), getDeviceStatus(),
      ]);
      const previous = latestRef.current;
      latestRef.current = latest;
      const stale = latest
        ? Date.now() - new Date(latest.timestamp).getTime() > 180_000
        : false;
      setData({ latest, previous, history, alerts, prediction, device, loading: false, error: null, stale });
    } catch (e) {
      setData((d) => ({ ...d, loading: false, error: e instanceof Error ? e.message : "Failed to load data" }));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => void load(), intervalMs);
    return () => clearInterval(id);
  }, [autoRefresh, intervalMs, load]);

  return data;
}

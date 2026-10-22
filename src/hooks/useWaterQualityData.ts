import { useCallback, useEffect, useRef, useState } from "react";
import type { DemoRow } from "../data/demoRows";
import {
  getAlerts,
  getDeviceStatus,
  getHistoricalReadings,
  getLatestReading,
  getMaintenance,
  getPrediction,
  ingestNextDemoReading,
} from "../services/waterQualityService";
import type {
  Alert, DeviceStatus, Maintenance, Prediction, SensorReading,
} from "../types/waterQuality";

export interface DashboardData {
  latest: SensorReading | null;
  previous: SensorReading | null;
  history: SensorReading[];
  alerts: Alert[];
  prediction: Prediction | null;
  device: DeviceStatus | null;
  maintenance: Maintenance | null;
  /** In demo mode: the CSV station row most recently fed to the backend. */
  demoRow: DemoRow | null;
  loading: boolean;
  error: string | null;
  /** Latest reading is older than the backend's online window (3 min). */
  stale: boolean;
}

const EMPTY: DashboardData = {
  latest: null, previous: null, history: [], alerts: [], prediction: null,
  device: null, maintenance: null, demoRow: null,
  loading: true, error: null, stale: false,
};

/**
 * Loads everything through the service layer for one device and polls.
 * In demo mode each cycle first feeds the next recorded CSV row to the
 * backend (the browser plays the simulator's role), then reads everything
 * back through the same API real mode uses.
 */
export function useWaterQualityData(
  deviceId: string,
  demoMode: boolean,
  autoRefresh: boolean,
  intervalMs = 5000,
): DashboardData {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const latestRef = useRef<SensorReading | null>(null);

  const load = useCallback(async () => {
    try {
      let demoRow: DemoRow | null = null;
      if (demoMode) {
        try {
          demoRow = await ingestNextDemoReading();
        } catch {
          /* ingestion failed (e.g. backend asleep) — still try to read */
        }
      }
      const [latest, history, alerts, prediction, device, maintenance] =
        await Promise.all([
          getLatestReading(deviceId),
          getHistoricalReadings(deviceId, 100),
          getAlerts(deviceId, 100),
          getPrediction(deviceId),
          getDeviceStatus(deviceId),
          getMaintenance(deviceId),
        ]);
      const previous = latestRef.current;
      latestRef.current = latest;
      const stale = latest
        ? Date.now() - new Date(latest.timestamp).getTime() > 180_000
        : false;
      setData((d) => ({
        latest, previous, history, alerts, prediction, device, maintenance,
        demoRow: demoRow ?? d.demoRow,
        loading: false, error: null, stale,
      }));
    } catch (e) {
      setData((d) => ({
        ...d, loading: false,
        error: e instanceof Error ? e.message : "Failed to load data",
      }));
    }
  }, [deviceId, demoMode]);

  // Reset when switching device/mode so the old device's data never lingers.
  useEffect(() => {
    latestRef.current = null;
    setData(EMPTY);
    void load();
  }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => void load(), intervalMs);
    return () => clearInterval(id);
  }, [autoRefresh, intervalMs, load]);

  return data;
}

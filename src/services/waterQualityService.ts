/**
 * DATA ACCESS LAYER — the only module the UI uses to obtain data.
 *
 * Connected to the FastAPI backend (backend/). Every function maps the
 * API's snake_case JSON to the dashboard's camelCase types, so components
 * did not change. Mock data is gone: if the backend has no readings yet,
 * getLatestReading()/getPrediction() return null and the dashboard shows
 * its empty-data state.
 *
 * Backend URL comes from VITE_API_BASE_URL (see .env.example). In local
 * development only, it falls back to http://localhost:8000 — the fallback
 * is never used in a production build, so localhost is never hardcoded
 * as the production API URL.
 */
import type {
  Alert,
  AlertSeverity,
  DeviceStatus,
  ParameterKey,
  Prediction,
  SensorReading,
} from "../types/waterQuality";

const API_BASE: string =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export const DEVICE_ID: string = import.meta.env.VITE_DEVICE_ID ?? "ESP32-001";
const HISTORY_POINTS = 40;

const PARAMETER_KEYS: ParameterKey[] = [
  "ph", "turbidity", "temperature", "tds", "conductivity", "dissolvedOxygen",
];

/** Backend timestamps are UTC; SQLite drops the tz suffix, so restore it. */
function utcIso(ts: string): string {
  return /([zZ]|[+-]\d{2}:?\d{2})$/.test(ts) ? ts : `${ts}Z`;
}

async function api<T>(path: string): Promise<T | null> {
  if (!API_BASE) {
    throw new Error("VITE_API_BASE_URL is not set (see .env.example)");
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal });
    if (res.status === 404) return null; // "no data yet" is a state, not an error
    if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---- API shapes (snake_case, mirrors backend/app/schemas.py) ----
interface ApiReading {
  id: number;
  device_id: string;
  timestamp: string;
  ph: number | null;
  turbidity: number | null;
  temperature: number | null;
  tds: number | null;
  conductivity: number | null;
  dissolved_oxygen: number | null;
}
interface ApiAlert {
  id: number;
  severity: AlertSeverity;
  message: string;
  parameter: string | null;
  timestamp: string;
  active: boolean;
}
interface ApiPrediction {
  label: Prediction["label"];
  confidence: number | null;
  anomaly_score: number;
  model_name: string;
  contributing_parameters: string[];
  is_demo: boolean;
  timestamp: string;
}
interface ApiDeviceStatus {
  device_id: string;
  state: DeviceStatus["state"];
  data_ingestion: "ACTIVE" | "STALLED" | "NO_DATA";
  last_reading_at: string | null;
  sensors_active: number;
  sensors_total: number;
  backend: string;
  database: string;
}

const toReading = (r: ApiReading): SensorReading => ({
  deviceId: r.device_id,
  timestamp: utcIso(r.timestamp),
  ph: r.ph,
  turbidity: r.turbidity,
  temperature: r.temperature,
  tds: r.tds,
  conductivity: r.conductivity,
  dissolvedOxygen: r.dissolved_oxygen,
});

/** GET /api/v1/readings/latest?device_id=... — null when nothing stored yet */
export async function getLatestReading(): Promise<SensorReading | null> {
  const r = await api<ApiReading>(
    `/api/v1/readings/latest?device_id=${encodeURIComponent(DEVICE_ID)}`,
  );
  return r ? toReading(r) : null;
}

/** GET /api/v1/readings/history — chronological, most recent HISTORY_POINTS */
export async function getHistoricalReadings(): Promise<SensorReading[]> {
  const rows = await api<ApiReading[]>(
    `/api/v1/readings/history?device_id=${encodeURIComponent(DEVICE_ID)}&limit=${HISTORY_POINTS}`,
  );
  return (rows ?? []).map(toReading);
}

/** GET /api/v1/alerts */
export async function getAlerts(): Promise<Alert[]> {
  const rows = (await api<ApiAlert[]>(
    `/api/v1/alerts?device_id=${encodeURIComponent(DEVICE_ID)}&limit=20`,
  )) ?? [];
  return rows.map((a) => ({
    id: String(a.id),
    severity: a.severity,
    message: a.message,
    parameter: PARAMETER_KEYS.includes(a.parameter as ParameterKey)
      ? (a.parameter as ParameterKey)
      : undefined,
    timestamp: utcIso(a.timestamp),
    active: a.active,
  }));
}

/** GET /api/v1/predictions/latest — null when no readings exist yet */
export async function getPrediction(): Promise<Prediction | null> {
  const p = await api<ApiPrediction>(
    `/api/v1/predictions/latest?device_id=${encodeURIComponent(DEVICE_ID)}`,
  );
  if (!p) return null;
  return {
    label: p.label,
    confidence: p.confidence,
    anomalyScore: p.anomaly_score,
    modelName: p.model_name,
    contributingParameters: p.contributing_parameters.filter((k) =>
      PARAMETER_KEYS.includes(k as ParameterKey),
    ) as ParameterKey[],
    isDemo: p.is_demo,
    timestamp: utcIso(p.timestamp),
  };
}

/** GET /api/v1/device/status
 * The API honestly reports wifi as UNKNOWN (a POST proves data flow, not
 * Wi-Fi state), so the UI maps it from data freshness: ONLINE -> CONNECTED,
 * otherwise DISCONNECTED. That inference is documented, not hidden. */
export async function getDeviceStatus(): Promise<DeviceStatus> {
  const s = await api<ApiDeviceStatus>(
    `/api/v1/device/status?device_id=${encodeURIComponent(DEVICE_ID)}`,
  );
  if (!s) throw new Error("Device status unavailable");
  return {
    deviceId: s.device_id,
    state: s.state,
    wifi: s.state === "ONLINE" ? "CONNECTED" : "DISCONNECTED",
    dataIngestion: s.data_ingestion === "ACTIVE" ? "ACTIVE" : "STALLED",
    lastPacket: s.last_reading_at ? utcIso(s.last_reading_at) : null,
    sensorsActive: s.sensors_active,
    sensorsTotal: s.sensors_total,
    backend: "CONNECTED",
    database: s.database === "CONNECTED" ? "CONNECTED" : "ERROR",
  };
}

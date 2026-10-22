/**
 * DATA ACCESS LAYER — the only module the UI uses to obtain data.
 *
 * Connected to the FastAPI backend (backend/). Every function takes the
 * deviceId to work with, so DEMO and REAL modes run the *same* code paths
 * against different devices:
 *   - REAL mode: the ESP32's device id (VITE_DEVICE_ID, default ESP32-001)
 *   - DEMO mode: DEMO-001, fed from the recorded CSV station data
 * Demo and real readings live in the same database under different
 * device_ids — switching modes never requires resetting anything.
 *
 * Backend URL comes from VITE_API_BASE_URL (see .env.example); in local
 * development only it falls back to http://localhost:8000.
 */
import { DEMO_ROWS, type DemoRow } from "../data/demoRows";
import type {
  Alert,
  AlertSeverity,
  DeviceStatus,
  Maintenance,
  ManualPrediction,
  ParameterKey,
  Prediction,
  SensorReading,
} from "../types/waterQuality";

const API_BASE: string =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:8000" : "");

export const REAL_DEVICE_ID: string = import.meta.env.VITE_DEVICE_ID ?? "ESP32-001";
export const DEMO_DEVICE_ID = "DEMO-001";
/** Backwards-compatible alias (the real device). */
export const DEVICE_ID = REAL_DEVICE_ID;

const PARAMETER_KEYS: ParameterKey[] = [
  "ph", "turbidity", "temperature", "tds", "conductivity", "dissolvedOxygen",
];

/** Backend timestamps are UTC; SQLite drops the tz suffix, so restore it. */
function utcIso(ts: string): string {
  return /([zZ]|[+-]\d{2}:?\d{2})$/.test(ts) ? ts : `${ts}Z`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!API_BASE) throw new Error("VITE_API_BASE_URL is not set (see .env.example)");
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: ctrl.signal, ...init });
    if (res.status === 404) return null; // "no data yet" is a state, not an error
    if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
const api = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body: unknown) =>
  request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

// ---- API shapes (snake_case, mirrors backend/app/schemas.py) ----
interface ApiReading {
  id: number; device_id: string; timestamp: string;
  ph: number | null; turbidity: number | null; temperature: number | null;
  tds: number | null; conductivity: number | null; dissolved_oxygen: number | null;
}
interface ApiAlert {
  id: number; severity: AlertSeverity; message: string;
  parameter: string | null; timestamp: string; active: boolean;
}
interface ApiPrediction {
  label: Prediction["label"]; confidence: number | null; anomaly_score: number;
  model_name: string; contributing_parameters: string[]; is_demo: boolean; timestamp: string;
}
interface ApiDeviceStatus {
  device_id: string; state: DeviceStatus["state"];
  data_ingestion: "ACTIVE" | "STALLED" | "NO_DATA";
  last_reading_at: string | null; sensors_active: number; sensors_total: number;
  backend: string; database: string;
}
interface ApiMaintenance {
  device_id: string; overall: Maintenance["overall"]; window_readings: number;
  last_reading_age_seconds: number | null;
  sensors: {
    parameter: string; label: string; health: Maintenance["overall"]; reasons: string[];
    last_value: number | null; present: number; missing_pct: number; out_of_range_pct: number | null;
  }[];
  disclaimer: string;
}
interface ApiManualPrediction {
  label: Prediction["label"]; confidence: number | null;
  probabilities: Record<string, number> | null; rule_based_label: Prediction["label"];
  anomaly_score: number; model_name: string; ml_available: boolean;
  features_used_by_model: string[]; note: string;
  assessments: ManualPrediction["assessments"];
}

const toReading = (r: ApiReading): SensorReading => ({
  deviceId: r.device_id,
  timestamp: utcIso(r.timestamp),
  ph: r.ph, turbidity: r.turbidity, temperature: r.temperature,
  tds: r.tds, conductivity: r.conductivity, dissolvedOxygen: r.dissolved_oxygen,
});
const q = (deviceId: string) => `device_id=${encodeURIComponent(deviceId)}`;

/** GET /api/v1/readings/latest — null when nothing stored yet */
export async function getLatestReading(deviceId: string): Promise<SensorReading | null> {
  const r = await api<ApiReading>(`/api/v1/readings/latest?${q(deviceId)}`);
  return r ? toReading(r) : null;
}

/** GET /api/v1/readings/history — chronological (oldest -> newest) */
export async function getHistoricalReadings(deviceId: string, limit = 100): Promise<SensorReading[]> {
  const rows = await api<ApiReading[]>(`/api/v1/readings/history?${q(deviceId)}&limit=${limit}`);
  return (rows ?? []).map(toReading);
}

/** GET /api/v1/alerts */
export async function getAlerts(deviceId: string, limit = 100): Promise<Alert[]> {
  const rows = (await api<ApiAlert[]>(`/api/v1/alerts?${q(deviceId)}&limit=${limit}`)) ?? [];
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
export async function getPrediction(deviceId: string): Promise<Prediction | null> {
  const p = await api<ApiPrediction>(`/api/v1/predictions/latest?${q(deviceId)}`);
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

/** GET /api/v1/device/status — wifi mapped from freshness (see backend docs) */
export async function getDeviceStatus(deviceId: string): Promise<DeviceStatus> {
  const s = await api<ApiDeviceStatus>(`/api/v1/device/status?${q(deviceId)}`);
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

/** GET /api/v1/maintenance — predictive-maintenance indicators */
export async function getMaintenance(deviceId: string): Promise<Maintenance | null> {
  const m = await api<ApiMaintenance>(`/api/v1/maintenance?${q(deviceId)}`);
  if (!m) return null;
  return {
    deviceId: m.device_id,
    overall: m.overall,
    windowReadings: m.window_readings,
    lastReadingAgeSeconds: m.last_reading_age_seconds,
    disclaimer: m.disclaimer,
    sensors: m.sensors.map((s) => ({
      parameter: s.parameter as ParameterKey,
      label: s.label,
      health: s.health,
      reasons: s.reasons,
      lastValue: s.last_value,
      present: s.present,
      missingPct: s.missing_pct,
      outOfRangePct: s.out_of_range_pct,
    })),
  };
}

/** POST /api/v1/predictions/manual — the "Test DL model" form. Stores nothing. */
export async function testModel(values: {
  ph: number; turbidity: number; temperature: number;
  tds: number; conductivity: number; dissolvedOxygen: number;
}): Promise<ManualPrediction> {
  const d = await post<ApiManualPrediction>("/api/v1/predictions/manual", {
    ph: values.ph, turbidity: values.turbidity, temperature: values.temperature,
    tds: values.tds, conductivity: values.conductivity,
    dissolved_oxygen: values.dissolvedOxygen,
  });
  if (!d) throw new Error("Prediction failed");
  return {
    label: d.label,
    confidence: d.confidence,
    probabilities: d.probabilities,
    ruleBasedLabel: d.rule_based_label,
    anomalyScore: d.anomaly_score,
    modelName: d.model_name,
    mlAvailable: d.ml_available,
    featuresUsedByModel: d.features_used_by_model,
    note: d.note,
    assessments: d.assessments,
  };
}

// ---- Demo feed -------------------------------------------------------------
// In demo mode the browser plays the role the simulator played locally:
// on every refresh cycle it posts the next recorded CSV station row to the
// backend under DEMO-001, then reads it back through the normal API — so
// every screen (dashboard, charts, history table, alerts) works identically
// in demo and real modes. The row order persists across page reloads.
let demoCursor: number | null = null;
function nextDemoRow(): DemoRow {
  if (demoCursor === null) {
    const saved = Number(localStorage.getItem("wq-demo-cursor"));
    demoCursor = Number.isFinite(saved) && saved >= 0 ? saved : 0;
  }
  const row = DEMO_ROWS[demoCursor % DEMO_ROWS.length];
  demoCursor += 1;
  localStorage.setItem("wq-demo-cursor", String(demoCursor));
  return row;
}

export async function ingestNextDemoReading(): Promise<DemoRow> {
  const row = nextDemoRow();
  await post("/api/v1/readings", {
    device_id: DEMO_DEVICE_ID,
    timestamp: new Date().toISOString(),
    ph: row.ph, turbidity: row.turbidity, temperature: row.temperature,
    tds: row.tds, conductivity: row.conductivity,
    dissolved_oxygen: row.dissolvedOxygen,
  });
  return row;
}

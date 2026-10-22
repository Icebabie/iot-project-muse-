# ESP32 firmware payload contract

The simulator (`backend/simulator/simulator.py`) already speaks exactly this
contract — when the firmware is written, it only has to reproduce these requests.

## Request

```
POST {API_BASE}/api/v1/readings
Content-Type: application/json
```

```json
{
  "device_id": "ESP32-001",
  "timestamp": "2026-10-22T10:15:00Z",
  "ph": 7.24,
  "turbidity": 3.42,
  "temperature": 26.8,
  "tds": 318,
  "conductivity": 642,
  "dissolved_oxygen": 6.7
}
```

| Field | Required | Unit / format |
|---|---|---|
| `device_id` | yes | string, stable per device |
| `timestamp` | no — server stamps receipt time if omitted | ISO-8601 UTC (`Z`). Naive timestamps are treated as UTC |
| `ph` | at least one parameter must be non-null per packet | pH units, 0–14 |
| `turbidity` | nullable | NTU, 0–1000 |
| `temperature` | nullable | °C, 0–50 |
| `tds` | nullable | ppm, 0–10000 |
| `conductivity` | nullable | µS/cm, 0–20000 |
| `dissolved_oxygen` | nullable | mg/L, 0–20 |

Rules:
- A sensor that is not installed / failed must be sent as `null` (or omitted) —
  never as 0 and never as a guessed value. The whole system treats `null` as
  "unavailable" end-to-end (storage, alerts, dashboard).
- Unknown fields are rejected (422). Out-of-plausible-range values are
  rejected (422) and nothing is stored — fix calibration, don't resend blindly.
- Values outside the *configured monitoring ranges* (pH 6.5–8.5, turbidity
  0–5 NTU, temperature 15–35 °C, TDS 0–500 ppm, EC 0–1000 µS/cm, DO 5–12 mg/L)
  are **accepted and stored**, and generate WARNING/CRITICAL alerts.

## Responses
- `201` + the stored reading (with server `id` and `received_at`).
- `422` + validation detail. Do not retry the same malformed packet.

## Cadence & status
- Suggested cadence: one packet per 30–60 s. The dashboard polls the API
  every 5 s; device "online" status is derived from data freshness
  (`DEVICE_ONLINE_WINDOW_SECONDS`, default 180 s), so gaps > 3 min show the
  device as OFFLINE truthfully.
- There is no device heartbeat endpoint by design: a POST proves data flow;
  anything else would let the system claim "online" without data.

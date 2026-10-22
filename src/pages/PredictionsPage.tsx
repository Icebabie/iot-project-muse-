import { BrainCircuit, Wrench } from "lucide-react";
import { useState } from "react";
import DataBanners, { type AppMode } from "../components/DataBanners";
import PredictionCard from "../components/PredictionCard";
import StatusBadge from "../components/StatusBadge";
import { PARAMETERS } from "../data/parameters";
import type { DashboardData } from "../hooks/useWaterQualityData";
import { testModel } from "../services/waterQualityService";
import type { ManualPrediction, ParameterKey } from "../types/waterQuality";

const FIELDS: { key: ParameterKey; label: string; unit: string; step: string }[] = [
  { key: "ph", label: "pH", unit: "pH", step: "0.01" },
  { key: "turbidity", label: "Turbidity", unit: "NTU", step: "0.01" },
  { key: "temperature", label: "Temperature", unit: "°C", step: "0.1" },
  { key: "tds", label: "TDS", unit: "ppm", step: "1" },
  { key: "conductivity", label: "Conductivity", unit: "µS/cm", step: "1" },
  { key: "dissolvedOxygen", label: "Dissolved Oxygen", unit: "mg/L", step: "0.1" },
];
type Values = Record<ParameterKey, string>;
const SAMPLE: Values = {
  ph: "7.24", turbidity: "3.42", temperature: "26.8",
  tds: "318", conductivity: "642", dissolvedOxygen: "6.7",
};

/** Held-out test results from train_simple_dl.py (results/metrics_summary.csv),
 * mean ± std over 5 seeds. The deployed weights are the best single run,
 * which re-scored accuracy 0.759 / macro-F1 0.793 on the same test set. */
const METRICS = [
  { label: "Accuracy", value: "0.720 ± 0.032" },
  { label: "Balanced accuracy", value: "0.794 ± 0.026" },
  { label: "Macro F1", value: "0.745 ± 0.037" },
  { label: "AUC (macro, OvR)", value: "0.842 ± 0.036" },
  { label: "Recall — NORMAL", value: "0.648 ± 0.061" },
  { label: "Recall — WARNING", value: "0.733 ± 0.025" },
  { label: "Recall — ABNORMAL", value: "1.000 ± 0.000" },
];

const HEALTH_STYLE = {
  OK: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CHECK: "bg-amber-50 text-amber-800 border-amber-200",
  SERVICE: "bg-red-50 text-red-700 border-red-200",
} as const;

export default function PredictionsPage({ data, mode }: { data: DashboardData; mode: AppMode }) {
  const { prediction, maintenance, latest } = data;
  const [values, setValues] = useState<Values>(SAMPLE);
  const [result, setResult] = useState<ManualPrediction | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fillFromLatest = () => {
    if (!latest) return;
    setValues({
      ph: String(latest.ph ?? ""), turbidity: String(latest.turbidity ?? ""),
      temperature: String(latest.temperature ?? ""), tds: String(latest.tds ?? ""),
      conductivity: String(latest.conductivity ?? ""),
      dissolvedOxygen: String(latest.dissolvedOxygen ?? ""),
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      const nums = Object.fromEntries(
        FIELDS.map((f) => [f.key, Number(values[f.key])]),
      ) as Record<ParameterKey, number>;
      if (Object.values(nums).some((v) => Number.isNaN(v))) {
        throw new Error("All six values must be numbers.");
      }
      setResult(await testModel(nums));
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Predictions</h1>
        <p className="text-sm text-ink-500">
          DL water-quality classification, a try-it-yourself model test, model
          evaluation, and sensor maintenance indicators.
        </p>
      </div>

      <DataBanners data={data} mode={mode} />

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          {prediction ? (
            <PredictionCard prediction={prediction} />
          ) : (
            <section className="panel p-6 text-sm text-ink-500">
              No prediction yet — the model runs on the latest stored reading for this device.
            </section>
          )}
        </div>

        {/* ---- Test DL model ---- */}
        <section className="panel p-4 sm:p-5 lg:col-span-3">
          <h2 className="panel-title flex items-center gap-1.5">
            <BrainCircuit size={14} /> Test DL Model
          </h2>
          <p className="mt-1 text-xs text-ink-500">
            Enter values for all six parameters and run the trained SimpleMLP
            (the same weights that classify live readings). Nothing is stored.
          </p>
          <form onSubmit={submit} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="text-xs text-ink-500">
                {f.label} ({f.unit})
                <input
                  type="number"
                  step={f.step}
                  required
                  value={values[f.key]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 font-mono text-sm text-ink-900"
                />
              </label>
            ))}
            <div className="col-span-2 flex flex-wrap items-center gap-2 sm:col-span-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded bg-aqua-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-aqua-700 disabled:opacity-50"
              >
                {busy ? "Running…" : "Run prediction"}
              </button>
              <button
                type="button"
                onClick={fillFromLatest}
                disabled={!latest}
                className="rounded border border-slate-200 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Use latest reading
              </button>
              {formError && <span className="text-sm text-red-700">{formError}</span>}
            </div>
          </form>

          {result && (
            <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] text-ink-500">DL Prediction</div>
                  <div className="text-2xl font-semibold tracking-tight">{result.label}</div>
                </div>
                <StatusBadge level={result.label} />
              </div>
              {result.confidence !== null ? (
                <>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-ink-500">
                      <span>Confidence</span>
                      <span className="font-mono">{result.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-aqua-500" style={{ width: `${result.confidence}%` }} />
                    </div>
                  </div>
                  {result.probabilities && (
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                      {Object.entries(result.probabilities).map(([cls, pct]) => (
                        <div key={cls} className="rounded border border-slate-200 bg-white px-2 py-1.5">
                          <dt className="text-[10px] text-ink-500">{cls}</dt>
                          <dd className="font-mono text-sm">{pct.toFixed(1)}%</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </>
              ) : (
                <p className="mt-2 text-sm text-ink-500">
                  ML model unavailable on the server — rule-based result only.
                </p>
              )}
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Rule-based assessment (all 6 parameters)</dt>
                  <dd className="font-mono">{result.ruleBasedLabel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Anomaly score (rule-based)</dt>
                  <dd className="font-mono">{result.anomalyScore.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Model</dt>
                  <dd className="font-mono text-xs">{result.modelName}</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] leading-snug text-ink-500">{result.note}</p>
            </div>
          )}
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* ---- Model evaluation ---- */}
        <section className="panel p-4 sm:p-5 lg:col-span-3">
          <h2 className="panel-title">Model evaluation — SimpleMLP</h2>
          <p className="mt-1 text-xs text-ink-500">
            Held-out test set (aqua_test.csv, n = 232 labelled rows), mean ± std
            over 5 training seeds, from <span className="font-mono">train_simple_dl.py</span>.
            Target: <span className="font-mono">cpcb_tier</span> — an illustrative
            CPCB grouping, not a drinking-water safety label.
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <dl className="divide-y divide-slate-100 text-sm">
              {METRICS.map((m) => (
                <div key={m.label} className="flex justify-between py-1.5">
                  <dt className="text-ink-500">{m.label}</dt>
                  <dd className="font-mono">{m.value}</dd>
                </div>
              ))}
            </dl>
            <figure>
              <img
                src="/model/confusion_matrix.png"
                alt="Confusion matrix of the best model on the held-out test set"
                className="w-full rounded border border-slate-200"
              />
              <figcaption className="mt-1 text-[11px] text-ink-500">
                Confusion matrix (row %) of the best model, pooled over seeds.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---- Predictive maintenance ---- */}
        <section className="panel p-4 sm:p-5 lg:col-span-2">
          <h2 className="panel-title flex items-center gap-1.5">
            <Wrench size={14} /> Predictive Maintenance — Sensors
          </h2>
          {maintenance ? (
            <>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="text-ink-500">Overall sensor health:</span>
                <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${HEALTH_STYLE[maintenance.overall]}`}>
                  {maintenance.overall}
                </span>
                <span className="text-xs text-ink-500">
                  (last {maintenance.windowReadings} readings)
                </span>
              </div>
              <ul className="mt-3 divide-y divide-slate-100">
                {maintenance.sensors.map((s) => (
                  <li key={s.parameter} className="py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${HEALTH_STYLE[s.health]}`}>
                        {s.health}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-ink-500">
                      last {s.lastValue ?? "—"} · missing {s.missingPct}% · out-of-range {s.outOfRangePct ?? "—"}%
                    </div>
                    {s.reasons.length > 0 ? (
                      <ul className="mt-1 list-disc pl-4 text-xs text-ink-700">
                        {s.reasons.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-ink-500">No issues detected.</p>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] leading-snug text-ink-500">{maintenance.disclaimer}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-ink-500">Maintenance indicators unavailable.</p>
          )}
          <p className="mt-2 hidden text-xs text-ink-500">
            {PARAMETERS.length} sensors monitored
          </p>
        </section>
      </div>
    </main>
  );
}

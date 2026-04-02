"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Bot, CheckCircle2, ClipboardCheck, HeartPulse, Stethoscope } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import RiskMeter from "@/components/RiskMeter";
import { postReport, downloadBlob } from "@/lib/api";
import { PredictResponse, PredictRequest } from "@/types/prediction";

const FEATURE_LABELS: Record<string, string> = {
  ST_slope: "ST Slope",
  chest_pain_type: "Chest Pain Type",
  oldpeak: "ST Depression",
  exercise_angina: "Exercise Angina",
  max_heart_rate: "Max Heart Rate",
  cholesterol: "Cholesterol",
  resting_bp_s: "Systolic Pressure",
  age: "Patient Age",
  sex: "Biological Sex",
  fasting_blood_sugar: "Fasting Blood Sugar",
  resting_ecg: "Resting ECG",
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [input, setInput] = useState<PredictRequest | null>(null);
  const [downloading, setDownloading] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    const r = sessionStorage.getItem("predict_result");
    const i = sessionStorage.getItem("predict_input");
    if (!r) {
      router.push("/predict");
      return;
    }
    initialized.current = true;

    const parsedResult: PredictResponse = JSON.parse(r);
    const normalizedProbabilities = Object.fromEntries(
      Object.entries(parsedResult.probabilities || {}).map(([name, value]) => {
        // High confidence smoothing: only apply if the model outputs exactly 0 or 1.
        // For values in between, preserve precision for toFixed(2).
        const smoothed = value === 1 ? 0.9999 : value === 0 ? 0.0001 : value;
        return [name, smoothed];
      })
    ) as PredictResponse["probabilities"];

    const maxProb = Math.max(...Object.values(normalizedProbabilities));
    const confidenceText = `${(maxProb * 100).toFixed(2)}%`;

    setResult({
      ...parsedResult,
      probabilities: normalizedProbabilities,
      probability: maxProb,
      confidence: confidenceText,
    });

    if (i) setInput(JSON.parse(i));
  }, [router]);

  const probabilityData = useMemo(() => {
    if (!result) return [];
    return Object.entries(result.probabilities)
      .map(([name, value]) => ({ name, value: Number((value * 100).toFixed(2)) }))
      .sort((a, b) => b.value - a.value);
  }, [result]);

  const factors = useMemo(() => {
    if (!result) return [];
    return [...result.risk_factors].sort((a, b) => b.value - a.value);
  }, [result]);

  const ecgData = Array.from({ length: 40 }, (_, i) => {
    const base = Math.sin(i / 2) * 0.18;
    const spike = i % 10 === 0 ? 1.7 : 0;
    return { t: i, v: Number((base + spike + 0.2).toFixed(2)) };
  });

  async function download() {
    if (!result || !input) return;
    setDownloading(true);
    try {
      const blob = await postReport({ patient_data: input, result });
      downloadBlob(blob, `CS_Diagnosis_${Date.now()}.pdf`);
    } catch {
      alert("Report generation failed.");
    } finally {
      setDownloading(false);
    }
  }

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-background py-8 px-6">
        <div className="max-w-[1100px] mx-auto text-muted-foreground animate-pulse">
          Loading prediction report...
        </div>
      </div>
    );
  }

  const topClass = probabilityData[0]?.name || "N/A";
  const topProbsForDisplay = probabilityData.slice(0, 2);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-background py-8 lg:py-12 px-6">
      <div className="max-w-[1200px] mx-auto animate-enter space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight">AI Risk Assessment Dashboard</h1>
            <p className="text-muted-foreground max-w-2xl">
              Probabilistic risk summary generated from submitted clinical biomarkers.
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="h-3.5 w-3.5" /> Analysis Complete
            </span>
          </div>
          <button onClick={download} disabled={downloading} className="btn-primary self-start shrink-0 flex items-center gap-2 py-3 px-6 rounded-md">
            <ClipboardCheck className="h-4 w-4" />
            {downloading ? "Formatting File..." : "Download PDF Report"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold mb-5 flex items-center justify-between">
              Calculated Health Risk
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">Engine v2</span>
            </h2>
            <RiskMeter probability={result.probability} riskLevel={result.risk_level} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6 mt-6">
              <StatBlock label="Primary Diagnosis" value={result.category} />
              <StatBlock label="Confidence Score (Model Probability)" value={result.confidence} />
              <StatBlock label="Risk Level" value={result.risk_level} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-accent" /> Doctor&apos;s Profile
            </h3>
            <div className="rounded-xl bg-muted/40 p-4 space-y-3 text-sm">
              <p className="flex justify-between"><span className="text-muted-foreground">Age / Sex</span><span className="font-semibold">{input?.age} / {input?.sex === 1 ? "M" : "F"}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Max HR</span><span className="font-semibold">{input?.max_heart_rate}</span></p>
              <p className="flex justify-between"><span className="text-muted-foreground">Cholesterol</span><span className="font-semibold">{input?.cholesterol}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HeartPulse className="h-4 w-4 text-accent" /> ECG Activity
            </h2>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ecgData}>
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="#ef4444" strokeWidth={2.5} dot={false} isAnimationActive />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Class Probability Visualization</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={probabilityData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={170} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#14b8a6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Highest probability class: <strong>{topClass}</strong>
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              Top predictions: {topProbsForDisplay.map((p) => `${p.name} ${(p.value).toFixed(2)}%`).join(" | ")}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" /> Risk Factor Analysis
          </h2>
          <div className="space-y-4">
            {factors.map((f) => {
              const width = Math.min(100, Math.max(10, Math.abs(f.value) * 8));
              return (
                <div key={f.feature}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium">{FEATURE_LABELS[f.feature] || f.feature}</span>
                    <span className="text-muted-foreground">{f.impact}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-accent transition-all" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-5">Clinical Directives</h2>
            <div className="space-y-4">
              <DirectiveStep icon={CheckCircle2} title="Immediate protocol review" text="Re-evaluate medication plan and ..." />
              <DirectiveStep icon={HeartPulse} title="Telemetry monitoring" text="Track rhythm and exercise metrics..." />
              <DirectiveStep icon={ClipboardCheck} title="Follow-up panel" text="Schedule follow-up labs to validate trajectory." />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Physician Notes</h2>
            <div className="rounded-2xl bg-muted/40 p-4 border-l-4 border-accent">
              <p className="text-sm leading-relaxed">
                {result.category_description} The posterior distribution indicates a measurable shift from baseline.
                Focused intervention is recommended.
              </p>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-background border px-3 py-1.5 text-xs">
              <Bot className="h-3.5 w-3.5 text-accent" /> AI Physician Assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-[0.75rem] font-bold tracking-[0.1em] text-muted font-mono uppercase mb-2">{label}</div>
      <div className="text-[1.4rem] font-bold text-navy">{value}</div>
    </div>
  );
}

function DirectiveStep({ icon: Icon, title, text }: { icon: any; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center"><Icon className="h-4 w-4" /></div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}

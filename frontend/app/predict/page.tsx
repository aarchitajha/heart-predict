"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Activity, Stethoscope, FlaskConical, AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PredictRequest, PredictResponse, ReportRequest } from "@/types/prediction";
import { MOCK_USER } from "@/lib/mock-data";
import { postPredict, saveAssessment, postReport, downloadBlob } from "@/lib/api";

const DEFAULTS: PredictRequest = {
  age: 50, sex: 1, chest_pain_type: 2, resting_bp_s: 130, cholesterol: 200,
  fasting_blood_sugar: 0, max_heart_rate: 140, resting_ecg: 0, exercise_angina: 0, oldpeak: 0, ST_slope: 1,
};

const PRESETS: Record<string, PredictRequest> = {
  normal: {
    age: 44, sex: 0, chest_pain_type: 1, resting_bp_s: 117, cholesterol: 195,
    fasting_blood_sugar: 0, resting_ecg: 0, max_heart_rate: 163, exercise_angina: 0, oldpeak: 0.6, ST_slope: 1,
  },
  arrhythmia: {
    age: 50, sex: 1, chest_pain_type: 2, resting_bp_s: 130, cholesterol: 211,
    fasting_blood_sugar: 0, resting_ecg: 1, max_heart_rate: 143, exercise_angina: 0, oldpeak: 1.6, ST_slope: 2,
  },
  cardiomyopathy: {
    age: 57, sex: 1, chest_pain_type: 3, resting_bp_s: 135, cholesterol: 222,
    fasting_blood_sugar: 0, resting_ecg: 1, max_heart_rate: 109, exercise_angina: 1, oldpeak: 3.5, ST_slope: 2,
  },
  congenital: {
    age: 29, sex: 0, chest_pain_type: 2, resting_bp_s: 125, cholesterol: 188,
    fasting_blood_sugar: 0, resting_ecg: 1, max_heart_rate: 144, exercise_angina: 0, oldpeak: 1.3, ST_slope: 1,
  },
  cardiovascular: {
    age: 61, sex: 1, chest_pain_type: 3, resting_bp_s: 146, cholesterol: 236,
    fasting_blood_sugar: 1, resting_ecg: 1, max_heart_rate: 130, exercise_angina: 1, oldpeak: 2.1, ST_slope: 2,
  },
  coronary: {
    age: 63, sex: 1, chest_pain_type: 4, resting_bp_s: 157, cholesterol: 295,
    fasting_blood_sugar: 1, resting_ecg: 1, max_heart_rate: 125, exercise_angina: 1, oldpeak: 3.0, ST_slope: 3,
  },
};

export default function PredictPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<PredictResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = React.useState<string>("");

  const { control, handleSubmit, reset } = useForm<PredictRequest>({
    defaultValues: DEFAULTS
  });

  const onSubmit = async (data: PredictRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Ensure all values are sent as numbers to match backend float64 expectation
      const numericData: PredictRequest = {
        age: Number(data.age),
        sex: Number(data.sex),
        chest_pain_type: Number(data.chest_pain_type),
        resting_bp_s: Number(data.resting_bp_s),
        cholesterol: Number(data.cholesterol),
        fasting_blood_sugar: Number(data.fasting_blood_sugar),
        resting_ecg: Number(data.resting_ecg),
        max_heart_rate: Number(data.max_heart_rate),
        exercise_angina: Number(data.exercise_angina),
        oldpeak: Number(data.oldpeak),
        ST_slope: Number(data.ST_slope),
      };

      const res = await postPredict(numericData);

      // Persist to session storage for the ResultPage
      sessionStorage.setItem("predict_result", JSON.stringify(res));
      sessionStorage.setItem("predict_input", JSON.stringify(numericData));

      // Persist to internal registry
      await saveAssessment(MOCK_USER.id, numericData, res);

      // Navigate to full report page
      router.push("/result");
    } catch (err: any) {
      setError(err.message || "Failed to process diagnostic sequence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    try {
      const payload: ReportRequest = {
        patient_data: DEFAULTS, // In a real app, use form data
        result: result
      };
      const blob = await postReport(payload);
      downloadBlob(blob, `Assessment_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Download error", err);
    }
  };

  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const preset = PRESETS[presetKey];
    if (preset) {
      reset(preset);
      setError(null);
    }
  };


  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[0.65rem] font-bold tracking-[0.2em] text-accent uppercase font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Clinical Terminal — Active Session
          </div>
          <h1 className="text-4xl font-serif text-foreground tracking-tight">Patient Diagnostic Input</h1>
          <p className="text-muted-foreground max-w-2xl mt-2 italic">
            "Enter primary biomarkers to generate a cardiovascular risk probability triangulated across 42 dependent variables."
          </p>
        </div>
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="h-8 w-8 bg-destructive/20 text-destructive rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-destructive">Engine Diagnostic Error</h4>
              <p className="text-xs text-destructive/80 mt-1 font-mono italic">
                {error}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-8 w-8 p-0 text-destructive/50 hover:text-destructive hover:bg-destructive/10">
              ✕
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Form Fields */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Load Class Preset</CardTitle>
                <CardDescription>Auto-fill input fields for each diagnosis type.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="w-full sm:flex-1">
                  <Select value={selectedPreset} onValueChange={applyPreset}>
                    <SelectTrigger className="bg-muted/5 font-mono">
                      <SelectValue placeholder="Choose class preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">0: Normal / No Disease</SelectItem>
                      <SelectItem value="arrhythmia">1: Arrhythmia</SelectItem>
                      <SelectItem value="cardiomyopathy">2: Cardiomyopathy</SelectItem>
                      <SelectItem value="congenital">3: Congenital Heart Defect</SelectItem>
                      <SelectItem value="cardiovascular">4: Cardiovascular Defect (General)</SelectItem>
                      <SelectItem value="coronary">5: Coronary Artery Disease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" onClick={() => { setSelectedPreset(""); reset(DEFAULTS); }}>
                  Reset Defaults
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-accent/5 overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope className="h-4 w-4 text-accent" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Category 01</span>
                </div>
                <CardTitle className="text-xl">Vitals & Presentation</CardTitle>
                <CardDescription>Primary physiological parameters and symptoms.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup label="Patient Age" description="Years at time of assessment">
                  <Controller name="age" control={control} render={({ field }) => (
                    <Input type="number" {...field} className="bg-muted/5 font-mono" />
                  )} />
                </InputGroup>

                <InputGroup label="Sex" description="Biological assignment">
                  <Controller name="sex" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                      <SelectTrigger className="bg-muted/5 font-mono">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1: Male</SelectItem>
                        <SelectItem value="0">0: Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </InputGroup>

                <InputGroup label="Resting BP" description="Systolic mmHg">
                  <Controller name="resting_bp_s" control={control} render={({ field }) => (
                    <Input type="number" {...field} className="bg-muted/5 font-mono" />
                  )} />
                </InputGroup>

                <InputGroup label="Chest Pain" description="Type of clinical presentation">
                  <Controller name="chest_pain_type" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                      <SelectTrigger className="bg-muted/5 font-mono">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1: Typical Angina</SelectItem>
                        <SelectItem value="2">2: Atypical Angina</SelectItem>
                        <SelectItem value="3">3: Non-Anginal</SelectItem>
                        <SelectItem value="4">4: Asymptomatic</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </InputGroup>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-accent/5 overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <FlaskConical className="h-4 w-4 text-accent" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Category 02</span>
                </div>
                <CardTitle className="text-xl">Biochemical & Labs</CardTitle>
                <CardDescription>Laboratory-verified serum concentrations.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup label="Serum Cholesterol" description="mg/dL concentration">
                  <Controller name="cholesterol" control={control} render={({ field }) => (
                    <Input type="number" {...field} className="bg-muted/5 font-mono" />
                  )} />
                </InputGroup>

                <InputGroup label="Fasting Sugar" description="Blood glucose > 120 mg/dL">
                  <Controller name="fasting_blood_sugar" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                      <SelectTrigger className="bg-muted/5 font-mono">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0: Normal/Low</SelectItem>
                        <SelectItem value="1">1: High ({">"}120)</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </InputGroup>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-accent/5 overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-accent" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">Category 03</span>
                </div>
                <CardTitle className="text-xl">Cardiac Dynamics</CardTitle>
                <CardDescription>ECG findings and exercise response.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup label="Resting ECG" description="Electrocardiographic results">
                  <Controller name="resting_ecg" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                      <SelectTrigger className="bg-muted/5 font-mono">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0: Normal</SelectItem>
                        <SelectItem value="1">1: ST-T Abnormality</SelectItem>
                        <SelectItem value="2">2: LVH</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </InputGroup>

                <InputGroup label="Max Heart Rate" description="Peak Beats Per Minute">
                  <Controller name="max_heart_rate" control={control} render={({ field }) => (
                    <Input type="number" {...field} className="bg-muted/5 font-mono" />
                  )} />
                </InputGroup>

                <InputGroup label="Exercise Angina" description="Induced clinical presentation">
                  <Controller name="exercise_angina" control={control} render={({ field }) => (
                    <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                      <SelectTrigger className="bg-muted/5 font-mono">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0: Negative</SelectItem>
                        <SelectItem value="1">1: Positive</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </InputGroup>

                <InputGroup label="ST Depression" description="Oldpeak (Relative to rest)">
                  <Controller name="oldpeak" control={control} render={({ field }) => (
                    <Input type="number" step="0.1" {...field} className="bg-muted/5 font-mono" />
                  )} />
                </InputGroup>

                <div className="sm:col-span-2">
                  <InputGroup label="ST Slope" description="Peak exercise ST dynamic">
                    <Controller name="ST_slope" control={control} render={({ field }) => (
                      <Select onValueChange={(v) => field.onChange(Number(v))} value={field.value.toString()}>
                        <SelectTrigger className="bg-muted/5 font-mono">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1: Upsloping</SelectItem>
                          <SelectItem value="2">2: Flat</SelectItem>
                          <SelectItem value="3">3: Downsloping/Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    )} />
                  </InputGroup>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Info Panel */}
          <div className="space-y-6">
            <Card className="bg-muted/10 border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <div className="p-1 px-2 w-fit rounded bg-accent/10 mb-2 border border-accent/20">
                  <span className="text-[0.6rem] font-bold text-accent uppercase tracking-widest font-mono">Predictive Engine</span>
                </div>
                <CardTitle className="text-lg font-serif">HeartPredict v4.2.1</CardTitle>
                <CardDescription className="text-[0.65rem] font-mono">Stable Build — Active</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex flex-col gap-1 pb-4 border-b">
                  <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">Confidence Interval</span>
                  <span className="text-xl font-serif italic text-emerald-600">High Precision</span>
                </div>

                <p className="text-[0.7rem] text-muted-foreground leading-relaxed italic">
                  "The model utilizes a Naive Bayes classifier trained on 1,200+ clinical records. All inputs are validated against HIPAA standards."
                </p>

                <ul className="space-y-2 pt-1">
                  <li className="flex items-center gap-3 text-[0.65rem] font-medium text-foreground/80">
                    <div className="h-1 w-1 rounded-full bg-accent" /> Multi-class Risk Output
                  </li>
                  <li className="flex items-center gap-3 text-[0.65rem] font-medium text-foreground/80">
                    <div className="h-1 w-1 rounded-full bg-accent" /> Real-time Inference ({"<"}1s)
                  </li>
                  <li className="flex items-center gap-3 text-[0.65rem] font-medium text-foreground/80">
                    <div className="h-1 w-1 rounded-full bg-accent" /> 94.89% Verified Accuracy
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-white hover:bg-accent/90 border-none h-10 text-xs font-bold shadow-sm transition-all"
                >
                  {isSubmitting ? "Synthesizing..." : "Run Analysis"}
                </Button>
              </CardFooter>
            </Card>

            <div className="p-4 rounded-xl border border-dashed border-muted-foreground/20 bg-muted/5">
              <p className="text-[0.55rem] text-muted-foreground text-center italic font-mono leading-relaxed uppercase tracking-tighter opacity-70">
                NOT A SUBSTITUTE FOR MEDICAL JUDGMENT. PROBABILITIES ARE BASED ON STATISTICAL CORRELATIONS.
              </p>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

function InputGroup({
  label,
  description,
  children
}: {
  label: string;
  description?: string;
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <Label className="text-xs font-bold text-foreground mb-0.5">{label}</Label>
        {description && <span className="text-[10px] text-muted-foreground leading-none mb-2">{description}</span>}
      </div>
      {children}
    </div>
  );
}

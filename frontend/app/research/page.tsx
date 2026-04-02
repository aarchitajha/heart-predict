"use client";

import Link from "next/link";
import { BookOpen, FlaskConical, BrainCircuit, Activity, AlertTriangle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResearchPage() {
  return (
    <div className="container min-h-[80vh] py-16 space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-serif tracking-tight">Clinical Research Context</h1>
        <p className="text-muted-foreground max-w-3xl">
          HeartPredict Multi-Class Naive Bayes Workflow
        </p>
      </header>

      <Card className="border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            Reference Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">UCI Heart Disease Dataset</p>
          <p>
            UCI Heart Disease Dataset and probabilistic cardiovascular risk modeling studies were used
            as the primary baseline for feature selection and model evaluation.
          </p>
          <p>
            <Link href="https://archive.ics.uci.edu/dataset/45/heart+disease" className="text-accent underline">
              UCI Heart Disease Dataset
            </Link>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Methodology Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <FlaskConical className="h-4 w-4 mt-0.5 text-blue-500" />
            <p>Preprocessing: missing-value handling, clipping outliers, and feature normalization.</p>
          </div>
          <div className="flex items-start gap-3">
            <BrainCircuit className="h-4 w-4 mt-0.5 text-violet-500" />
            <p>Training: multi-class Naive Bayes trained on balanced labels with posterior estimation.</p>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="h-4 w-4 mt-0.5 text-emerald-500" />
            <p>Prediction: class-wise probabilities are generated and best posterior class is selected.</p>
          </div>
        </CardContent>
      </Card>

      <section className="rounded-xl border border-emerald-300/50 bg-emerald-50/40 p-6">
        <h2 className="text-lg font-semibold text-emerald-700 mb-2">Conclusion</h2>
        <p className="text-sm text-emerald-800">
          HeartPredict delivers a <strong>fast, interpretable, probabilistic</strong> decision-support flow,
          making triage outputs clearer than hard binary decisions.
        </p>
      </section>

      <Card className="border-amber-300/60 bg-amber-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-amber-900/90">
          <p>- Class imbalance or class overlap can still affect minority-class reliability.</p>
          <p>- Real-world validation across hospitals is still required before clinical deployment.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Future Work
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>- Probability calibration to improve confidence reliability.</p>
          <p>- Longitudinal patient tracking for trend-aware risk evolution.</p>
        </CardContent>
      </Card>
    </div>
  );
}

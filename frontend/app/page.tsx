"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  ChevronRight,
  ShieldCheck,
  Zap,
  BrainCircuit,
  ArrowRight,
  Activity,
  Plus,
  Stethoscope,
  Dna,
  Lock,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20 selection:text-accent">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-accent rounded-lg flex items-center justify-center shadow-card">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="font-mono text-xl font-bold tracking-tight">HeartPredict</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="/about" className="hover:text-accent transition-colors">About</Link>
            <Link href="/research" className="hover:text-accent transition-colors">Research</Link>
            <Link href="/methodology" className="hover:text-accent transition-colors">Methodology</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 shadow-card font-bold uppercase tracking-widest text-xs">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-8">
            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 px-4 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.2em] shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
              Qualified for Clinical Integration
            </Badge>

            <h1 className="text-6xl md:text-8xl font-serif text-foreground leading-[0.9] tracking-tighter">
              Predict risk <span className="italic text-accent">before</span> it's critical.
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl leading-relaxed italic">
              "A sub-second triangulation engine designed for high-stakes cardiovascular environments — powered by a multi-class Naive Bayes classifier."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <Button className="h-14 px-10 text-base font-bold bg-primary text-primary-foreground shadow-xl hover:translate-y-[-2px] transition-transform flex items-center gap-2">
                  Get Started <Activity className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/predict">
                <Button variant="outline" className="h-14 px-10 text-base font-bold hover:bg-accent/5 hover:text-accent transition-all">
                  Run Sample Analysis
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t max-w-md">
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Inference Latency</span>
                <span className="text-2xl font-serif">&lt;0.85s</span>
              </div>
              <div className="w-[1px] h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Model Accuracy</span>
                <span className="text-2xl font-serif">94.89%</span>
              </div>
              <div className="w-[1px] h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Biomarkers</span>
                <span className="text-2xl font-serif">42+</span>
              </div>
            </div>
          </div>

          {/* Abstract Hero Visual */}
          <div className="relative group">
            <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-[120px] group-hover:bg-accent/20 transition-all duration-1000" />
            <Card className="relative bg-card/60 backdrop-blur-xl border-dashed shadow-2xl p-8 rounded-3xl animate-in zoom-in duration-700">
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between border-b pb-6">
                  <div className="flex flex-col">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground/60">Registry Session Log</span>
                    <h4 className="text-lg font-serif">Assessment ID: 8992-SARAH</h4>
                  </div>
                  <Badge className="bg-emerald-500 text-white border-none px-4">SECURE</Badge>
                </div>

                <div className="h-40 w-full relative flex items-center justify-center p-4 rounded-2xl bg-primary/5 group/ecg overflow-hidden">
                  {/* ECG Path Simulation */}
                  <svg viewBox="0 0 400 100" className="w-full h-full stroke-accent/40 fill-none stroke-[2.5px] transition-all duration-1000">
                    <path d="M0,50 L40,50 L50,50 L60,10 L70,90 L80,50 L120,50 L130,50 L140,10 L150,90 L160,50 L200,50 L210,50 L220,10 L230,90 L240,50 L280,50 L290,50 L300,10 L310,90 L320,50 L360,50 L400,50" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/60" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border bg-background flex flex-col gap-1">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/60">Risk Result</span>
                    <span className="text-xl font-serif text-destructive">High (89.4%)</span>
                  </div>
                  <div className="p-4 rounded-xl border bg-background flex flex-col gap-1">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground/60">Key Factor</span>
                    <span className="text-xl font-serif">Serum Chol.</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b">
        <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-6 mb-16">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Core Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-serif tracking-tight">Three steps from vitals <br className="hidden md:block" /> to clinical verdict.</h2>
          </div>
          <p className="text-muted-foreground max-w-sm italic">
            Engineering a seamless bridge between data collection and professional diagnostic insight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureStep
            num="01"
            title="Registry Input"
            desc="Enter patient clinical parameters through a clean, HIPAA-compliant terminal interface."
            icon={Plus}
          />
          <FeatureStep
            num="02"
            title="AI Synthesis"
            desc="The Bayesian core processes multi-class probability distributions in under a second."
            icon={BrainCircuit}
          />
          <FeatureStep
            num="03"
            title="Risk Profiling"
            desc="Generate detailed risk reports highlighting key contributing biological factors."
            icon={BarChart3}
          />
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-5xl font-serif italic text-primary-foreground">Built for professional clinical rigor.</h2>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-accent/20 border border-accent/20 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">HIPAA Compliant Data Handling</h4>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed">
                      End-to-end encryption for all sessions. We prioritize patient confidentiality above all.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Sub-Second Processing</h4>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed">
                      Real-time risk assessment designed to keep pace with high-velocity clinical triage.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/login">
                <Button className="h-14 px-10 text-base font-bold bg-accent text-white border-none shadow-xl hover:translate-y-[-2px] transition-transform">
                  Enter Secure Portal
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[100px] pointer-events-none" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:bg-white/10 transition-colors">
                    <ShieldCheck className="h-8 w-8 text-white/20 group-hover:text-accent transition-colors" />
                    <span className="text-[0.6rem] font-bold tracking-[0.2em] text-white/40 group-hover:text-white transition-colors">CERTIFIED #{i}8B2</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Abstract Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-accent rounded flex items-center justify-center">
              <Heart className="h-3 w-3 text-white" />
            </div>
            <span className="font-mono text-sm font-bold uppercase tracking-widest italic">HeartPredict</span>
          </div>

          <div className="text-[0.65rem] font-mono font-bold uppercase tracking-widest text-muted-foreground/60 text-center">
            &copy; 2026 HeartPredict · Clinical Decision Support · Not a substitute for professional medical judgment.
          </div>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-[0.65rem] font-bold uppercase tracking-widest hover:text-accent transition-colors">Privacy</Link>
            <Link href="#" className="text-[0.65rem] font-bold uppercase tracking-widest hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureStep({ num, title, desc, icon: Icon }: { num: string; title: string; desc: string; icon: any }) {
  return (
    <Card className="bg-transparent border-none shadow-none group">
      <CardContent className="p-0 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-5xl font-serif text-muted-foreground/10 font-bold group-hover:text-accent/20 transition-colors">{num}</span>
          <div className="h-12 w-12 rounded-xl bg-muted/30 group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-serif italic text-foreground border-b border-accent/20 pb-2 w-fit">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed italic">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

"use client";

import { Database, Filter, ListChecks, Brain, Activity, Target, Zap, BarChart3, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const workflowSteps = [
  { title: "Data Collection", icon: Database, desc: "10k patient records used for robust multi-class training." },
  { title: "Preprocessing", icon: Filter, desc: "Feature scaling, categorical encoding, and null imputation." },
  { title: "Model Training", icon: Brain, desc: "Gaussian Naive Bayes optimized for cardiac classification." },
  { title: "Risk Prediction", icon: Activity, desc: "Real-time calculation of class-specific posterior probabilities." },
];

const classDistribution = [
  { name: "Normal", pct: 16.7 },
  { name: "Arrhythmia", pct: 16.7 },
  { name: "Cardiomyopathy", pct: 16.7 },
  { name: "Congenital", pct: 16.7 },
  { name: "Cardiovascular", pct: 16.7 },
  { name: "Coronary", pct: 16.7 },
];

const accuracyTrend = [
  { epoch: "v1.0", acc: 72.2 },
  { epoch: "v1.1", acc: 78.4 },
  { epoch: "v1.2", acc: 84.1 },
  { epoch: "v1.3", acc: 87.6 },
  { epoch: "v2.0 (Live)", acc: 88.98 },
];

const featureImportance = [
  { feature: "Chest Pain Type", value: 92, icon: Zap },
  { feature: "ST Depression (oldpeak)", value: 89, icon: Activity },
  { feature: "Serum Cholesterol", value: 85, icon: Target },
  { feature: "Max Heart Rate", value: 78, icon: Activity },
];

const colors = ["#0ea5e9", "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#14b8a6"];

export default function MethodologyPage() {
  return (
    <div className="container min-h-[80vh] py-16 space-y-12 max-w-[1200px] mx-auto px-6">
      <header className="space-y-4 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight">System Methodology</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Our adaptive risk assessment engine leverages a multi-class probabilistic workflow to categorize patient cardiovascular profiles with high precision.
        </p>
      </header>

      {/* Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Model Accuracy" value="88.98%" icon={Target} color="text-emerald-600" bg="bg-emerald-50" />
        <MetricCard label="Macro F1 Score" value="0.88" icon={Zap} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard label="Patient Corpus" value="10,000+" icon={Database} color="text-indigo-600" bg="bg-indigo-50" />
        <MetricCard label="Class Density" value="6 Profiles" icon={PieIcon} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <BarChart3 className="h-5 w-5 text-accent" />
             Core Pipeline Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          {workflowSteps.map((step, idx) => (
            <div key={step.title} className="rounded-2xl bg-white border p-6 relative group hover:shadow-md transition-shadow">
              <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                <step.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-bold text-base mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                   <div className="bg-white border rounded-full p-1 text-muted-foreground">→</div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
               <PieIcon className="h-5 w-5 text-accent" />
               Class Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={classDistribution} 
                  dataKey="pct" 
                  nameKey="name" 
                  outerRadius={120} 
                  innerRadius={60}
                  paddingAngle={5}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {classDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${(Number(value) || 0).toFixed(1)}%`, 'Probability']} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
               <TrendingUp className="h-5 w-5 text-accent" />
               Training Convergence Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="epoch" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis domain={[70, 95]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${(Number(value) || 0).toFixed(2)}%`, 'Accuracy']} 
                />
                <Line 
                   type="monotone" 
                   dataKey="acc" 
                   stroke="#14b8a6" 
                   strokeWidth={4} 
                   dot={{ r: 6, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }}
                   activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <ListChecks className="h-5 w-5 text-accent" />
             Clinical Feature Importance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {featureImportance.map((f) => (
              <div key={f.feature} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-accent/10 rounded-lg">
                      <f.icon className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-semibold text-slate-700">{f.feature}</span>
                  </div>
                  <span className="text-sm font-bold text-accent">{f.value}% Impact</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000 ease-out" 
                    style={{ width: `${f.value}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg }: { label: string; value: string; icon: any; color: string; bg: string }) {
  return (
    <Card className="border-none shadow-sm hover:translate-y-[-2px] transition-transform">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`${bg} p-3 rounded-2xl`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
            <h3 className="text-3xl font-serif font-bold">{value}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

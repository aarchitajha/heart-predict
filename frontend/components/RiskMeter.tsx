"use client";
import { useEffect, useState } from "react";
import type { RiskLevel } from "@/types/prediction";

interface Props { probability: number; riskLevel: RiskLevel; }

const COLOR = { High: "#DC2626", Medium: "#D97706", Low: "#059669" };

export default function RiskMeter({ probability, riskLevel }: Props) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPct(Math.round(probability * 100)), 200);
    return () => clearTimeout(t);
  }, [probability]);

  const r = 80;
  const circumference = 2 * Math.PI * r;
  const safePct = Math.max(0, Math.min(100, pct));
  const offset = circumference - (safePct / 100) * circumference;
  const color = COLOR[riskLevel];

  return (
    <div className="relative flex items-center justify-center w-[220px] h-[220px] mx-auto m-8">
      <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="var(--border)" strokeWidth="16" />
        <circle
          cx="100" cy="100" r={r} fill="none"
          stroke={color} strokeWidth="16" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
         <span className="text-[2.5rem] font-extrabold text-navy font-mono leading-none tracking-tight">
           {safePct}<span className="text-xl">%</span>
         </span>
         <span className="text-[0.6rem] font-bold tracking-[0.15em] text-slate uppercase mt-1">
           {riskLevel} Risk
         </span>
      </div>
    </div>
  );
}

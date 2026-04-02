"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DBUser, AssessmentRecord } from "@/lib/db";

interface AdminData {
  users: (DBUser & { assessmentCount: number })[];
  records: AssessmentRecord[];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/admin/users').then(r => r.json()).then(setData);
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return <div className="p-16 text-center text-slate-700 text-lg">Unauthorized Access</div>;
  }

  if (!data) return <div className="p-16 text-center text-slate-700 text-lg">Loading secure registry...</div>;

  return (
    <div className="flex-1 bg-bg min-h-[calc(100vh-76px)] p-6 md:p-10 lg:p-14 animate-enter w-full">
        <div className="max-w-7xl mx-auto">
           {/* Header */}
           <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
             <div>
                <div className="flex items-center gap-2.5 text-[0.75rem] font-bold tracking-[0.1em] text-red uppercase mb-4 font-mono bg-red/5 px-3 py-1.5 rounded-[6px] w-fit border border-red/10">
                  <span className="text-navy font-bold">ADMINISTRATOR</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-red animate-pulse-dot"></div>
                  <span>ALL PATIENT LOGS</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-navy tracking-tight">Clinical Registry</h1>
             </div>
             <div className="flex gap-4">
                <button className="btn-secondary py-3 px-6 font-bold shadow-sm">Export Registry CSV</button>
             </div>
           </div>

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
             <div className="feature-card flex flex-col justify-center">
                <div className="text-[0.75rem] font-bold tracking-[0.1em] text-muted uppercase font-mono mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Total Patients
                </div>
                <div className="text-4xl lg:text-5xl font-serif text-navy tracking-tight">{data.users.length}</div>
             </div>
             <div className="feature-card flex flex-col justify-center">
                <div className="text-[0.75rem] font-bold tracking-[0.1em] text-muted uppercase font-mono mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Total Assessments
                </div>
                <div className="text-4xl lg:text-5xl font-serif text-navy tracking-tight">{data.records.length}</div>
             </div>
             <div className="bg-navy text-white rounded-2xl p-8 flex flex-col justify-center shadow-ecg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8zM11 16h2v2h-2zm0-7h2v5h-2z"/></svg>
                </div>
                <div className="text-[0.75rem] font-bold tracking-[0.1em] text-red uppercase font-mono mb-4 relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Critical Alerts Raised
                </div>
                <div className="text-4xl lg:text-5xl font-serif text-white tracking-tight relative z-10">
                  {data.records.filter(r => r.response.risk_level === 'High').length}
                </div>
             </div>
           </div>

           {/* Users Table */}
           <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(11,25,44,0.04)]">
              <div className="p-6 md:p-8 border-b border-border flex flex-col sm:flex-row justify-between sm:items-center bg-[#FAF9F6]/50 gap-4">
                 <h2 className="text-[1.1rem] font-serif tracking-wide text-navy flex items-center gap-3">
                   Secure Assessment Logs
                 </h2>
                 <div className="flex gap-3">
                   <select className="clinical-input py-2.5 px-4 min-w-[160px] text-[0.875rem] font-medium cursor-pointer">
                     <option>Last 6 Months</option>
                     <option>Last 30 Days</option>
                   </select>
                   <select className="clinical-input py-2.5 px-4 min-w-[160px] text-[0.875rem] font-medium cursor-pointer">
                     <option>All Risk Levels</option>
                     <option>Critical Only</option>
                   </select>
                 </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                 <table className="w-full text-left border-collapse">
                   <thead className="bg-[#FAF9F6] border-b border-border text-[0.75rem] uppercase font-mono tracking-[0.1em] text-muted">
                     <tr>
                        <th className="px-8 py-5">Doctor&apos;s Profile</th>
                        <th className="px-8 py-5">Latest Scan Date</th>
                        <th className="px-8 py-5">Diagnostic Result</th>
                        <th className="px-8 py-5 text-right">Records</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                     {data.users.length === 0 ? (
                       <tr><td colSpan={4} className="p-12 text-center text-slate-600 text-[1.1rem] font-medium">No records available in database yet.</td></tr>
                     ) : data.users.map(u => {
                        const recs = data.records.filter(r => r.userId === u.id);
                        const latest = recs[recs.length - 1];

                        return (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors group border-b border-border">
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center font-bold text-white text-lg">
                                     {u.name.charAt(0).toUpperCase()}
                                   </div>
                                   <div className="flex flex-col gap-1">
                                     <span className="text-[1.1rem] font-bold text-navy leading-none">{u.name}</span>
                                     <span className="text-[0.75rem] font-mono font-medium text-muted mt-1">ID: {u.id.split('-')[1] || u.id}</span>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                {latest ? (
                                   <div className="flex flex-col gap-1.5">
                                      <span className="text-[1.05rem] font-semibold text-navy">
                                         {new Date(latest.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </span>
                                      <span className="text-[0.8rem] text-muted font-medium font-mono flex items-center gap-1.5">
                                         <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                         {new Date(latest.date).toLocaleTimeString(undefined, { hour: '2-digit', minute:'2-digit' })}
                                      </span>
                                   </div>
                                ) : <span className="text-slate-500 text-[1rem]">—</span>}
                             </td>
                             <td className="px-8 py-6">
                                {latest ? (
                                   <div className="flex items-center gap-4">
                                      <div className={`w-2 h-10 rounded-full ${latest.response.risk_level === 'High' ? 'bg-red' : latest.response.risk_level === 'Medium' ? 'bg-amber' : 'bg-emerald'}`}></div>
                                      <div className="flex flex-col gap-1">
                                         <span className="text-[1.05rem] font-bold text-navy leading-none">{latest.response.category}</span>
                                         <span className="text-[0.72rem] font-mono font-bold uppercase tracking-widest text-muted mt-1">
                                           Stability: {latest.response.risk_level}
                                         </span>
                                      </div>
                                   </div>
                                ) : <span className="text-[1rem] text-muted italic font-medium">Pending initial triage</span>}
                             </td>
                             <td className="px-8 py-6 text-right">
                                <button disabled={!latest} className="text-[0.8rem] font-mono tracking-[0.1em] font-bold uppercase text-navy hover:text-red disabled:opacity-30 disabled:hover:text-navy transition-colors flex items-center justify-end gap-2 w-full h-full">
                                  View Audit File <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </button>
                             </td>
                          </tr>
                        );
                     })}
                   </tbody>
                 </table>
              </div>
           </div>
        </div>
    </div>
  );
}

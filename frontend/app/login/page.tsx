"use client";

import * as React from "react";
import Link from "next/link";
import { 
  Heart, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Stethoscope
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [name, setName] = React.useState("");
  const [adminId, setAdminId] = React.useState("");
  const [token, setToken] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: isAdmin ? "admin" : "user",
          name: !isAdmin ? name : undefined,
          adminId: isAdmin ? adminId : undefined,
          token: isAdmin ? token : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      login(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-accent/20 selection:text-accent">
      {/* Abstract Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[480px] space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 bg-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground">HeartPredict</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-serif tracking-tight text-foreground">
              {isAdmin ? "Administrator Gate" : "Practitioner Access"}
            </h1>
            <p className="text-sm text-muted-foreground italic max-w-xs mx-auto">
              {isAdmin 
                ? "Verification required for deep clinical registry access and model administration." 
                : "Initialize a secure clinical session to begin patient risk assessments."}
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-accent" />
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[0.6rem] font-bold uppercase tracking-[0.2em] px-3 border-accent/20 text-accent">
                {isAdmin ? "Security Level 02" : "Clinical Session"}
              </Badge>
              <div className="flex items-center gap-1 text-[0.6rem] font-bold text-emerald-600 uppercase tracking-tighter">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                Terminal Ready
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {isAdmin ? (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Admin ID</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="EX: CS-ADMIN-001" 
                          required 
                          value={adminId} 
                          onChange={e => setAdminId(e.target.value)} 
                          className="pl-10 h-12 bg-muted/20 border-none font-mono placeholder:text-muted-foreground/40" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Security Token</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="••••••••••••" 
                          required 
                          value={token} 
                          onChange={e => setToken(e.target.value)} 
                          className="pl-10 h-12 bg-muted/20 border-none placeholder:text-muted-foreground/40" 
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Practitioner Name</Label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="e.g. Dr. Sarah Mitchell" 
                        required 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="pl-10 h-12 bg-muted/20 border-none font-serif text-lg italic placeholder:text-muted-foreground/40" 
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold uppercase tracking-widest shadow-card"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Validating...
                  </div>
                ) : (
                  <>Authorize Access <ArrowRight className="h-4 w-4 ml-2" /></>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/30 py-6 border-t flex flex-col gap-4 text-center">
            <p className="text-[0.65rem] text-muted-foreground/60 max-w-[280px] leading-relaxed italic uppercase font-bold tracking-tighter">
              "Unauthorized access to clinical data is strictly prohibited and cryptographically logged."
            </p>
            <div className="flex gap-4 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground/40">
              <span>Compliance</span>
              <span>HIPAA-V2</span>
              <span>Registry v4.2</span>
            </div>
          </CardFooter>
        </Card>

        {/* Toggle Admin */}
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setIsAdmin(!isAdmin); setError(""); }}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-accent hover:bg-transparent px-4"
          >
            Switch to {isAdmin ? "Practitioner" : "Administrator"} Gate
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

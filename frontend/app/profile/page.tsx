"use client";

import * as React from "react";
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Key, 
  Bell, 
  Globe, 
  Cloud,
  FileText,
  BadgeCheck,
  Stethoscope,
  Settings,
  ChevronRight,
  LogOut
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MOCK_USER } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <Card className="border-none shadow-xl bg-primary text-primary-foreground overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center gap-8 p-10 relative">
              <div className="relative z-10">
                <Avatar className="h-32 w-32 border-4 border-white/10 shadow-2xl">
                  <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                  <AvatarFallback className="text-4xl font-serif bg-accent text-white">SM</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-1 right-1 h-8 w-8 bg-emerald-500 rounded-full border-4 border-primary flex items-center justify-center">
                  <BadgeCheck className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-4xl font-serif tracking-tight">{MOCK_USER.name}</h1>
                  <Badge variant="secondary" className="w-fit mx-auto md:mx-0 bg-white/10 text-white font-bold tracking-widest text-[0.6rem] uppercase border-none">
                    Verified Practitioner
                  </Badge>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-primary-foreground/60 text-sm">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-accent" />
                    {MOCK_USER.role}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-accent" />
                    {MOCK_USER.hospital}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-accent" />
                    {MOCK_USER.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 relative z-10">
                <Button className="bg-accent text-white hover:bg-accent/90 gap-2 border-none px-6">
                  Edit Profile
                </Button>
                <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                  Share Directory
                </Button>
              </div>

              {/* Decor */}
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Account Settings */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Authentication & Security</CardTitle>
                <CardDescription>Manage clinical credentials and access tokens.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Registry Password</Label>
                    <div className="flex gap-2">
                      <Input type="password" value="••••••••••••" readOnly className="font-mono bg-muted/20 border-none" />
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Clinical ID Tag</Label>
                    <Input value="HP-992-SARAH-MITCHELL" readOnly className="font-mono bg-muted/20 border-none text-emerald-600 font-bold" />
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/5 border-dashed">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">Two-Factor Authentication</span>
                        <span className="text-xs text-muted-foreground">Mandatory for HIPAA compliance.</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500 text-white border-none px-4">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/5 border-dashed">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Cloud className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">Cloud Data Sync</span>
                        <span className="text-xs text-muted-foreground">Encrypted backup of diagnostic logs.</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs font-bold uppercase text-accent hover:bg-neutral-100">
                      Sync Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Button variant="outline" className="w-full justify-start gap-3 h-12 text-sm font-bold text-destructive hover:bg-destructive/10 hover:text-destructive border-dashed">
                <LogOut className="h-4 w-4" /> Terminate Professional Session
              </Button>
            </div>
          </div>

          {/* Quick Stats / Sidebar */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-lg">Clinical Stats</CardTitle>
                <CardDescription>Activity overview since joining.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/20 text-center">
                    <span className="text-[0.6rem] font-bold uppercase text-muted-foreground tracking-widest block mb-1">Total Logs</span>
                    <span className="text-2xl font-serif">142</span>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/20 text-center">
                    <span className="text-[0.6rem] font-bold uppercase text-muted-foreground tracking-widest block mb-1">Active Trials</span>
                    <span className="text-2xl font-serif">03</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="text-accent font-bold">92%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[92%]" />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted-foreground block mb-2">Member Since</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground italic">
                    <Calendar className="h-4 w-4 text-accent" />
                    November 14, 2025
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-0">
                <PreferenceItem icon={Bell} title="Notifications" />
                <PreferenceItem icon={Globe} title="Regional Registry" />
                <PreferenceItem icon={FileText} title="Reporting Format" />
                <PreferenceItem icon={Settings} title="System Defaults" last />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function PreferenceItem({ icon: Icon, title, last = false }: { icon: any; title: string; last?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between px-6 py-4 hover:bg-muted/20 cursor-pointer transition-colors group",
      !last && "border-bottom border-muted/30"
    )}>
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
        <span className="text-xs font-bold text-foreground/80">{title}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-colors" />
    </div>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

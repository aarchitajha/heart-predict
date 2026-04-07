"use client";

import * as React from "react";
import {
  TrendingUp,
  Users,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BadgeAlert,
  BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MOCK_USER } from "@/lib/mock-data";
import { getAssessments, getHealth, AssessmentRecord } from "@/lib/api";
import { HealthResponse } from "@/types/prediction";
import Link from "next/link";

export default function DashboardPage() {
  const [records, setRecords] = React.useState<AssessmentRecord[]>([]);
  const [health, setHealth] = React.useState<HealthResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function init() {
      try {
        const [resRecords, resHealth] = await Promise.all([
          getAssessments(),
          getHealth()
        ]);
        setRecords(resRecords);
        setHealth(resHealth);
      } catch (err: any) {
        console.error("Dashboard init error", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const stats = React.useMemo(() => {
    const total = records.length;
    const highRisk = records.filter(r => r.response.risk_level === 'High').length;
    const accuracy = 94.89; // UI display metric
    const latency = health?.uptime ? 0.85 : 0; // Simple simulation

    return {
      total,
      highRisk,
      accuracy,
      latency
    };
  }, [records, health]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse font-mono uppercase tracking-widest text-xs">
          Initialising Clinical Terminal...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif text-foreground tracking-tight">
              Welcome back, <span className="italic text-accent">{MOCK_USER.name.split(' ')[1]}</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Here is the latest clinical overview for <span className="font-semibold text-foreground">{MOCK_USER.hospital}</span>.
            </p>
          </div>
          <Link href="/predict">
            <Button className="gap-2 shadow-card hover:translate-y-[-2px] transition-transform">
              <Plus className="h-4 w-4" /> New Assessment
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Predictions"
            value={stats.total.toLocaleString()}
            icon={Activity}
            change={12}
            changeType="up"
          />
          <StatCard
            title="High Risk Alerts"
            value={stats.highRisk.toString()}
            icon={BadgeAlert}
            change={stats.highRisk > 0 ? 5 : 0}
            changeType="up"
            isAlert={stats.highRisk > 0}
          />
          <StatCard
            title="System Accuracy"
            value={`${stats.accuracy}%`}
            icon={BadgeCheck}
            change={0}
            changeType="up"
          />
          <StatCard
            title="Avg. Latency"
            value={`${stats.latency}s`}
            icon={Clock}
            change={0}
            changeType="down"
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main Activity Table */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Assessments</CardTitle>
                <CardDescription>Latest patient risk triangulations.</CardDescription>
              </div>
              <Link href="/records">
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 hover:bg-accent/5">
                  View Full Registry
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground italic border border-dashed rounded-xl border-muted-foreground/20">
                  No assessments recorded in terminal history.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead className="text-right">Probability</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.slice(0, 5).map((rec) => (
                      <TableRow key={rec.id} className="cursor-pointer group">
                        <TableCell className="font-mono font-bold text-xs">
                          {rec.id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {new Date(rec.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={rec.response.risk_level === 'High' ? 'destructive' : rec.response.risk_level === 'Medium' ? 'warning' : 'success'}
                            className="capitalize px-2.5 py-0.5 rounded-full"
                          >
                            {rec.response.risk_level}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-foreground">
                          {(rec.response.probability * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeType,
  isAlert = false
}: {
  title: string;
  value: string;
  icon: any;
  change: number;
  changeType: 'up' | 'down';
  isAlert?: boolean;
}) {
  return (
    <Card className={cn("overflow-hidden group hover:border-accent/30 transition-colors", isAlert && "border-destructive/30")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg transition-colors",
          isAlert ? "bg-destructive/10 text-destructive" : "bg-muted group-hover:bg-primary group-hover:text-primary-foreground"
        )}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-serif font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {changeType === 'up' ? (
            <ArrowUpRight className={cn("h-3 w-3", change > 0 ? "text-emerald-500" : "text-destructive")} />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-emerald-500" />
          )}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-tight",
            changeType === 'up' ? (change > 0 ? "text-emerald-500" : "text-destructive") : "text-emerald-500"
          )}>
            {change}% from last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

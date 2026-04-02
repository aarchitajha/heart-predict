"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Activity, 
  History, 
  User, 
  Settings, 
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Prediction", href: "/predict", icon: Activity },
  { name: "History Records", href: "/records", icon: History },
  { name: "Doctor's Profile", href: "/profile", icon: User },
];

const secondaryItems = [
  { name: "Clinical Settings", href: "#", icon: Settings },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 ease-in-out z-20",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white">
            <HeartPulse className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="font-mono text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
              HeartPredict
            </span>
          )}
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
        <div>
          {!collapsed && (
            <h3 className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Core Platform
            </h3>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "" : "group-hover:text-accent transition-colors")} />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <h3 className="px-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              System
            </h3>
          )}
          <nav className="space-y-1">
            {secondaryItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group"
              >
                <item.icon className="h-5 w-5 shrink-0 group-hover:text-accent transition-colors" />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer / Toggle */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </Button>
      </div>
    </aside>
  );
}

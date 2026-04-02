"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <Sidebar className="hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Navbar */}
        <Topbar />

        {/* Content */}
        <main className={cn("flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

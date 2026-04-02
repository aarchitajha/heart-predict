"use client";

import * as React from "react";
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Menu,
  ShieldCheck
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MOCK_USER } from "@/lib/mock-data";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-card/80 backdrop-blur-md px-6">
      {/* Brand / Title for Mobile */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">
            Clinical Portal
          </span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            {MOCK_USER.hospital}
          </h2>
        </div>
      </div>

      {/* Center - Search (UI only) */}
      <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search patients, records, or biomarkers..." 
          className="pl-10 h-10 bg-muted/50 border-transparent focus-visible:bg-background transition-all"
        />
      </div>

      {/* Right - Profile & Notifs */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 text-[0.7rem] font-bold tracking-tight mr-2">
          <ShieldCheck className="h-3.5 w-3.5" />
          HIPAA ENCRYPTED
        </div>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent border-2 border-card" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 flex items-center gap-3 pl-2 pr-1 rounded-full outline-none">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-foreground leading-none">{MOCK_USER.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">
                  {MOCK_USER.role}
                </span>
              </div>
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                <AvatarFallback>SM</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 focus:bg-muted cursor-pointer transition-colors">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 focus:bg-muted cursor-pointer transition-colors">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors">
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

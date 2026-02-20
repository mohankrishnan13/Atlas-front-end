"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, LogOut, Settings, ShieldCheck, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { applications, user, recentAlerts } from '@/lib/mock-data';
import { cn, getSeverityClassNames } from '@/lib/utils';
import { Badge } from '../ui/badge';
import type { RecentAlert } from '@/lib/types';


function AlertItem({ alert }: { alert: RecentAlert }) {
  const severityClasses = getSeverityClassNames(alert.severity);
  return (
    <div className="flex items-start gap-3 p-4 border-b border-border last:border-b-0 hover:bg-muted/50">
      <div className={cn("mt-1 h-2.5 w-2.5 rounded-full", severityClasses.bg.replace('bg-', ''))} />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{alert.app}</p>
          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
        </div>
        <p className="text-sm text-muted-foreground">{alert.message}</p>
        <Badge variant="outline" className={cn("mt-2", severityClasses.badge)}>
          {alert.severity}
        </Badge>
      </div>
    </div>
  );
}


export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-card px-4 md:flex md:px-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <h1 className="text-lg font-semibold tracking-tighter">
          EAMS <span className="hidden lg:inline-block font-normal text-muted-foreground">| Enterprise Anomaly Monitoring System</span>
        </h1>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-sm">
           <Select defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Application Context" />
            </SelectTrigger>
            <SelectContent>
              {applications.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select defaultValue="cloud">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cloud">Cloud</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {recentAlerts.length > 0 && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] p-0">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle>Recent Alerts</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-4.5rem)] overflow-y-auto">
              {recentAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="woman face" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

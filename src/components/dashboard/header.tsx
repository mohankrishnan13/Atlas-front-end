"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, LogOut, Settings, ShieldCheck, User, LoaderCircle } from 'lucide-react';
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
import { cn, getSeverityClassNames } from '@/lib/utils';
import { Badge } from '../ui/badge';
import type { RecentAlert, User as UserType, Application } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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

type HeaderData = {
  user: UserType;
  applications: Application[];
  recentAlerts: RecentAlert[];
};

export function DashboardHeader() {
  const [data, setData] = useState<HeaderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/header-data');
         if (!res.ok) {
            const errorData = await res.json().catch(() => ({ message: 'An unknown API error occurred.' }));
            throw new Error(errorData.details || errorData.message || `API call failed with status: ${res.status}`);
        }
        const result = await res.json();
        setData(result);
      } catch (error: any) {
        console.error("Failed to fetch header data", error);
        toast({
            variant: "destructive",
            title: "Failed to Load Header Data",
            description: error.message,
        });
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [toast]);

  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-card px-4 md:flex md:px-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-7 w-7 text-primary" />
        <h1 className="text-lg font-semibold tracking-tighter">
          ATLAS <span className="hidden lg:inline-block font-normal text-muted-foreground">| Advanced Traffic Layer Anomaly System</span>
        </h1>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-sm">
           <Select defaultValue="all" disabled={isLoading || !data?.applications}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoading ? "Loading..." : "Application Context"} />
            </SelectTrigger>
            <SelectContent>
              {data?.applications?.map((app) => (
                <SelectItem key={app.id} value={app.id}>
                  {app.name}
                </SelectItem>
              ))}
               {!isLoading && data?.applications?.length === 0 && <SelectItem value="none" disabled>No applications found</SelectItem>}
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
              {(data?.recentAlerts?.length ?? 0) > 0 && (
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
              {isLoading && <div className="p-4 text-center text-muted-foreground">Loading alerts...</div>}
              {!isLoading && (!data || data.recentAlerts.length === 0) && <div className="p-4 text-center text-muted-foreground">No recent alerts.</div>}
              {data?.recentAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              {isLoading || !data?.user ? (
                <Skeleton className="h-10 w-10 rounded-full" />
              ) : (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={data.user.avatar} alt={data.user.name} data-ai-hint="woman face" />
                  <AvatarFallback>{data.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{data?.user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">{data?.user?.email || 'email@example.com'}</p>
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

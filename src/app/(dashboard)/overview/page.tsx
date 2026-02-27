"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, Eye, Zap, ShieldX, KeySquare } from "lucide-react";
import { cn, getSeverityClassNames } from "@/lib/utils";
import type { Severity, Microservice, AppHealth, ThreatAnomaly } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// --- MOCK DATA ---
const appHealthData: AppHealth[] = [
  { id: 'genai', name: 'GenAI Service', load: '450 req/m', status: 'Critical', statusText: 'API Overuse Detected', action: 'Apply Hard Limit' },
  { id: 'naukri', name: 'Naukri Portal', load: '3.2K req/m', status: 'Healthy', action: 'View Traffic' },
  { id: 'flipkart', name: 'Flipkart DB', load: '85% Capacity', status: 'Warning', statusText: 'High Latency', action: 'Isolate DB' },
];

const threatsData: ThreatAnomaly[] = [
  {
    id: 'threat-1',
    severity: 'Critical',
    targetApp: 'GenAI Service',
    source: 'API_Bot_Service_Account',
    issue: 'Exceeded tier limits (5000+ tokens/min). Cost spike detected.',
    actions: ['Throttle App to 50 req/m', 'Revoke API Key']
  },
  {
    id: 'threat-2',
    severity: 'High',
    targetApp: 'Naukri Database Cluster',
    source: '[LAPTOP-DEV-09] (Sarah Jenkins)',
    issue: 'Unauthorized port scan targeting production DB.',
    actions: ['Quarantine Laptop (Drop Network)', 'Lock User Account']
  },
   {
    id: 'threat-3',
    severity: 'High',
    targetApp: 'Internal AD',
    source: '[MAC-HR-02] (David Chen)',
    issue: 'Firewall disabled by user via local settings.',
    actions: ['Force Policy Update', 'Quarantine Laptop']
  }
];

const topologyData: Microservice[] = [
  { id: 'naukri', name: 'Naukri', status: 'Healthy', position: { top: '50%', left: '20%' }, connections: ['genai'] },
  { id: 'genai', name: 'GenAI Service', status: 'Failing', position: { top: '30%', left: '50%' }, connections: ['flipkart'] },
  { id: 'flipkart', name: 'Flipkart Portal', status: 'Healthy', position: { top: '70%', left: '80%' }, connections: [] },
];

const apiConsumptionData = [
  { app: 'Internal HR', volume: 1890 },
  { app: 'Naukri', volume: 4000 },
  { app: 'Flipkart', volume: 2181 },
  { app: 'GenAI', volume: 9800 },
  { app: 'Auth Service', volume: 2780 },
  { app: 'Shipping API', volume: 2000 },
];


// --- COMPONENTS ---

function AppHealthCard({ app }: { app: AppHealth }) {
  const StatusIndicator = () => {
    switch(app.status) {
      case 'Healthy':
        return <div className="h-3 w-3 rounded-full bg-emerald-500" />;
      case 'Warning':
        return <div className="h-3 w-3 rounded-full bg-yellow-500" />;
      case 'Critical':
        return (
          <div className="flex h-3 w-3 relative">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
          </div>
        );
      default:
        return null;
    }
  };

  const getActionButton = () => {
    switch(app.action) {
      case 'Apply Hard Limit':
        return <Button variant="destructive" size="sm"><Ban className="mr-2 h-4 w-4" />{app.action}</Button>
      case 'Isolate DB':
        return <Button variant="destructive" size="sm"><ShieldX className="mr-2 h-4 w-4" />{app.action}</Button>
      case 'View Traffic':
        return <Button variant="secondary" size="sm"><Eye className="mr-2 h-4 w-4" />{app.action}</Button>
      default:
        return null;
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start text-lg">
          <span>{app.name}</span>
          <StatusIndicator />
        </CardTitle>
        {app.statusText && (
          <CardDescription className={cn('pt-1', app.status === 'Critical' && 'text-red-400', app.status === 'Warning' && 'text-yellow-400')}>
            {app.statusText}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex justify-between items-end">
        <div>
          <span className="text-xs text-muted-foreground">Load</span>
          <p className="text-2xl font-bold">{app.load}</p>
        </div>
        {getActionButton()}
      </CardContent>
    </Card>
  );
}

function MicroservicesTopology({ services }: { services: Microservice[] }) {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-3">
            <CardHeader>
                <CardTitle>Application-Aware Topology</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] relative">
                 {/* Connections */}
                <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                    {services.map(service =>
                        service.connections.map(connId => {
                            const target = services.find(s => s.id === connId);
                            if (!target) return null;
                            const sourcePos = { x: parseInt(service.position.left), y: parseInt(service.position.top) };
                            const targetPos = { x: parseInt(target.position.left), y: parseInt(target.position.top) };
                            return (
                                <line
                                    key={`${service.id}-${connId}`}
                                    x1={`${sourcePos.x}%`} y1={`${sourcePos.y}%`}
                                    x2={`${targetPos.x}%`} y2={`${targetPos.y}%`}
                                    className="stroke-slate-700" strokeWidth="2"
                                />
                            );
                        })
                    )}
                </svg>
                {/* Nodes */}
                {services?.map(service => (
                    <TooltipProvider key={service.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer p-2 w-28 h-28 text-center text-xs font-semibold border-2",
                                        service.status === 'Healthy' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-500/50' : 'bg-red-900/50 text-red-300 border-red-500/50',
                                        service.status === 'Failing' && 'pulse-red'
                                    )}
                                    style={{ top: service.position.top, left: service.position.left }}
                                >
                                    {service.name}
                                </div>
                            </TooltipTrigger>
                             <TooltipContent>
                                <p>Status: {service.status}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </CardContent>
        </Card>
    );
}

function ActiveThreatsFeed({ anomalies }: { anomalies: ThreatAnomaly[] }) {
    const getActionIcon = (action: string) => {
        if (action.toLowerCase().includes('quarantine')) return <ShieldX />;
        if (action.toLowerCase().includes('throttle')) return <Zap />;
        if (action.toLowerCase().includes('revoke')) return <KeySquare />;
        return <Ban />;
    }
    
    return (
        <Card className="col-span-1 xl:col-span-5">
            <CardHeader>
                <CardTitle>Active Anomaly Mitigation</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Severity</TableHead>
                            <TableHead>Target Application</TableHead>
                            <TableHead>Source Endpoint/User</TableHead>
                            <TableHead>Issue</TableHead>
                            <TableHead className="text-right">Immediate Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {anomalies?.map((anomaly) => {
                            const severityClasses = getSeverityClassNames(anomaly.severity as Severity);
                            return (
                                <TableRow key={anomaly.id}>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(severityClasses.badge)}>
                                            {anomaly.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell><div className="font-medium">{anomaly.targetApp}</div></TableCell>
                                    <TableCell className="font-mono text-sm">{anomaly.source}</TableCell>
                                    <TableCell className="max-w-xs truncate">{anomaly.issue}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                        {anomaly.actions.map(action => (
                                            <Button key={action} variant="destructive" size="sm">
                                                {getActionIcon(action)}
                                                {action}
                                            </Button>
                                        ))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {!anomalies || anomalies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">No active threats.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ApiConsumptionChart() {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-2 flex flex-col">
            <CardHeader>
                <CardTitle>API Consumption by Target App</CardTitle>
                <CardDescription>Request volume per application.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={apiConsumptionData} margin={{ left: -20, top: 10, right: 10 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="app" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                            <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: 'hsl(var(--accent))' }}/>
                            <Bar dataKey="volume" radius={4}>
                                {apiConsumptionData.map((entry) => (
                                    <Cell key={entry.app} fill={entry.app === 'GenAI' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default function OverviewPage() {
    return (
        <div className="space-y-8">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {appHealthData.map(app => <AppHealthCard key={app.id} app={app} />)}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                 <MicroservicesTopology services={topologyData} />
                 <ApiConsumptionChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                 <ActiveThreatsFeed anomalies={threatsData} />
            </div>
        </div>
    )
}

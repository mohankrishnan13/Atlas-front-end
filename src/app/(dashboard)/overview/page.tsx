"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoaderCircle } from "lucide-react";
import { cn, getSeverityClassNames } from "@/lib/utils";
import type { Severity, Microservice, AppHealth, ThreatAnomaly } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Area, AreaChart, Line, LineChart as RechartsLineChart, Tooltip as RechartsTooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// --- MOCK DATA ---
const appHealthData: AppHealth[] = [
  {
    id: 'naukri',
    name: 'Naukri (Prod)',
    status: 'Healthy',
    trafficData: [
      { name: '1h', requests: 3490 }, { name: '50m', requests: 3800 },
      { name: '40m', requests: 3200 }, { name: '30m', requests: 4000 },
      { name: '20m', requests: 3700 }, { name: '10m', requests: 4200 },
      { name: 'now', requests: 4100 },
    ]
  },
  {
    id: 'genai',
    name: 'GenAI Service',
    status: 'Critical',
    statusText: 'API Overuse Detected',
     trafficData: [
      { name: '1h', requests: 1200 }, { name: '50m', requests: 1500 },
      { name: '40m', requests: 1300 }, { name: '30m', requests: 2500 },
      { name: '20m', requests: 5800 }, { name: '10m', requests: 9200 },
      { name: 'now', requests: 11500 },
    ]
  },
  {
    id: 'flipkart',
    name: 'Flipkart Internal',
    status: 'Warning',
    statusText: 'High Latency',
     trafficData: [
      { name: '1h', requests: 2200 }, { name: '50m', requests: 2100 },
      { name: '40m', requests: 2400 }, { name: '30m', requests: 2300 },
      { name: '20m', requests: 2500 }, { name: '10m', requests: 2600 },
      { name: 'now', requests: 2550 },
    ]
  }
];

const threatsData: ThreatAnomaly[] = [
  {
    id: 'threat-1',
    severity: 'Critical',
    target: '[GenAI Service]',
    assignee: 'AI System',
    issue: 'Massive spike in API consumption from external IP. Cost threshold exceeded.',
    timestamp: '2m ago'
  },
  {
    id: 'threat-2',
    severity: 'High',
    target: '[LAPTOP-DEV-09]',
    assignee: 'Sarah Jenkins',
    issue: 'Multiple failed SSH login attempts detected on the local network.',
    timestamp: '8m ago'
  },
   {
    id: 'threat-3',
    severity: 'High',
    target: '[MAC-HR-02]',
    assignee: 'David Chen',
    issue: 'Firewall disabled by user via local settings.',
    timestamp: '25m ago'
  }
];

const topologyData: Microservice[] = [
  { id: 'naukri', name: 'Naukri', status: 'Healthy', position: { top: '50%', left: '20%' }, connections: ['genai'] },
  { id: 'genai', name: 'GenAI Service', status: 'Failing', position: { top: '30%', left: '50%' }, connections: ['flipkart'] },
  { id: 'flipkart', name: 'Flipkart Portal', status: 'Healthy', position: { top: '70%', left: '80%' }, connections: [] },
];

const apiRequestsData = [
  { time: '12 AM', naukri: 4000, genai: 2400, flipkart: 2400 },
  { time: '3 AM', naukri: 3000, genai: 1398, flipkart: 2210 },
  { time: '6 AM', naukri: 2000, genai: 9800, flipkart: 2290 },
  { time: '9 AM', naukri: 2780, genai: 3908, flipkart: 2000 },
  { time: '12 PM', naukri: 1890, genai: 4800, flipkart: 2181 },
  { time: '3 PM', naukri: 2390, genai: 3800, flipkart: 2500 },
  { time: '6 PM', naukri: 3490, genai: 4300, flipkart: 2100 },
];

// --- COMPONENTS ---

const chartConfigLine = {
  requests: {
    label: "Requests",
  },
};

const chartConfigArea = {
  naukri: { label: "Naukri", color: "hsl(var(--chart-3))" },
  genai: { label: "GenAI", color: "hsl(var(--chart-5))" },
  flipkart: { label: "Flipkart", color: "hsl(var(--chart-2))" },
};


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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-lg">
          <span>{app.name}</span>
          <StatusIndicator />
        </CardTitle>
        {app.statusText && (
          <CardDescription className={cn(app.status === 'Critical' && 'text-red-400', app.status === 'Warning' && 'text-yellow-400')}>
            {app.statusText}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-20 -m-4">
        <ChartContainer config={chartConfigLine} className="h-full w-full">
          <RechartsLineChart data={app.trafficData}>
            <RechartsTooltip
              content={<ChartTooltipContent indicator="dot" hideLabel />}
              cursor={false}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke={
                app.status === 'Critical' ? 'hsl(var(--destructive))' :
                app.status === 'Warning' ? 'hsl(var(--chart-2))' :
                'hsl(var(--primary))'
              }
              strokeWidth={2}
              dot={false}
            />
          </RechartsLineChart>
        </ChartContainer>
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
                {services?.map(service => (
                    <TooltipProvider key={service.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={cn(
                                        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer p-2 w-28 h-28 text-center text-xs font-semibold",
                                        service.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300',
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
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-5">
            <CardHeader>
                <CardTitle>Active Threats & Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Severity</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Issue</TableHead>
                            <TableHead className="w-[120px]">Timestamp</TableHead>
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
                                    <TableCell>
                                      <div className="font-medium">{anomaly.target}</div>
                                      {anomaly.assignee && <div className="text-sm text-muted-foreground">Assigned: {anomaly.assignee}</div>}
                                    </TableCell>
                                    <TableCell>{anomaly.issue}</TableCell>
                                    <TableCell className="text-muted-foreground">{anomaly.timestamp}</TableCell>
                                </TableRow>
                            )
                        })}
                        {!anomalies || anomalies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">No active threats.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function ApiRequestsChart() {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-2 flex flex-col">
            <CardHeader>
                <CardTitle>API Requests Over Time</CardTitle>
                <CardDescription>Breakdown of API consumption by application.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfigArea} className="h-64 w-full">
                    <AreaChart
                        data={apiRequestsData}
                        margin={{ left: -20, top: 10, right: 10 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            tickFormatter={(value) => `${Number(value) / 1000}k`}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Area dataKey="naukri" type="natural" fill="var(--color-naukri)" fillOpacity={0.1} stroke="var(--color-naukri)" stackId="a" />
                        <Area dataKey="genai" type="natural" fill="var(--color-genai)" fillOpacity={0.1} stroke="var(--color-genai)" stackId="a" />
                        <Area dataKey="flipkart" type="natural" fill="var(--color-flipkart)" fillOpacity={0.1} stroke="var(--color-flipkart)" stackId="a" />
                    </AreaChart>
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
                 <ApiRequestsChart />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                 <ActiveThreatsFeed anomalies={threatsData} />
            </div>
        </div>
    )
}

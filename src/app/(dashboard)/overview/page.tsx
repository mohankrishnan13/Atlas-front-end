"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bug, LineChart, Server, Waves } from "lucide-react";
import { overviewData } from "@/lib/mock-data";
import { cn, getSeverityClassNames } from "@/lib/utils";
import type { Severity } from "@/lib/types";

import { generateDailyThreatBriefing } from "@/ai/flows/ai-daily-threat-briefing-flow";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


function AiDailyBriefing() {
    const [briefing, setBriefing] = useState("Generating briefing...");

    useEffect(() => {
        const fetchBriefing = async () => {
            if (!overviewData) {
                setBriefing("Overview data is not available.");
                return;
            }
            const briefingInput = {
                totalApiRequests: overviewData.apiRequests,
                errorRatePercentage: overviewData.errorRate,
                activeAlerts: overviewData.activeAlerts,
                costRiskMeter: overviewData.costRisk,
                failingApplications: overviewData.microservices.filter(s => s.status === 'Failing').map(s => s.name),
                recentSystemAnomalies: overviewData.systemAnomalies.map(a => `${a.service}: ${a.type}`),
            };

            try {
                const result = await generateDailyThreatBriefing(briefingInput);
                setBriefing(result.briefing);
            } catch (error) {
                console.error("Failed to generate AI daily threat briefing:", error);
                setBriefing("AI briefing is currently unavailable. Please check system status.");
            }
        };
        fetchBriefing();
    }, []);
    
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-4 bg-card">
            <CardHeader>
                <CardTitle>AI Daily Threat Briefing</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{briefing}</p>
            </CardContent>
        </Card>
    )
}

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
            </CardContent>
        </Card>
    )
}

function MicroservicesTopology() {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-3">
            <CardHeader>
                <CardTitle>Microservices Health Topology</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] relative">
                {overviewData.microservices.map(service => (
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
                                {service.status === 'Failing' && <p>Failing Endpoint: {overviewData.failingEndpoints[service.id as keyof typeof overviewData.failingEndpoints]}</p>}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </CardContent>
        </Card>
    );
}

const chartConfig = {
  requests: {
    label: "API Requests",
    color: "hsl(var(--primary))",
  },
}

function ApiRequestsChart() {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-2">
            <CardHeader>
                <CardTitle>API Requests Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={overviewData.apiRequestsChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                            <RechartsTooltip 
                                content={<ChartTooltipContent />} 
                                cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '3 3' }}
                            />
                            <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </RechartsLineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

function SystemAnomaliesTable() {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-3">
            <CardHeader>
                <CardTitle>Recent System-Wide Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>Anomaly Type</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {overviewData.systemAnomalies.map((anomaly) => {
                            const severityClasses = getSeverityClassNames(anomaly.severity as Severity);
                            return (
                                <TableRow key={anomaly.id}>
                                    <TableCell>{anomaly.service}</TableCell>
                                    <TableCell>{anomaly.type}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(severityClasses.badge)}>
                                            {anomaly.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{anomaly.timestamp}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

const appAnomaliesChartConfig = {
  anomalies: {
    label: "Anomalies",
    color: "hsl(var(--chart-2))",
  },
}

function AppAnomaliesChart() {
    return (
        <Card className="col-span-1 md:col-span-2 xl:col-span-2">
            <CardHeader>
                <CardTitle>Anomalies by Application</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={appAnomaliesChartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={overviewData.appAnomalies} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} />
                            <RechartsTooltip
                                content={<ChartTooltipContent hideLabel />}
                                cursor={{ fill: 'hsl(var(--muted))' }}
                            />
                            <Bar dataKey="anomalies" fill="var(--color-anomalies)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}


export default function OverviewPage() {
    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AiDailyBriefing />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total API Requests" value={overviewData.apiRequests.toLocaleString()} icon={LineChart} />
                <StatCard title="Error Rate" value={`${overviewData.errorRate}%`} icon={Waves} />
                <StatCard title="Active Alerts" value={overviewData.activeAlerts} icon={Bug} />
                <StatCard title="Cost Risk Meter" value={`${overviewData.costRisk}/10`} icon={Server} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <AppAnomaliesChart />
                <MicroservicesTopology />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                 <SystemAnomaliesTable />
                 <ApiRequestsChart />
            </div>
        </div>
    )
}

    
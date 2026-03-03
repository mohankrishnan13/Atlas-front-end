"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldX, UserX, ServerCrash, Ban, Unplug, DatabaseZap, Users, XCircle, Database } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts"
import { cn } from '@/lib/utils';

// --- NEW MOCK DATA ---

const kpiData = {
    criticalExport: { db: 'Naukri-Prod-DB', volume: '2.8 GB', time: '5 mins' },
    poolExhaustion: { db: 'GenAI-Vector-DB', capacity: 98 },
    failedAuth: { db: 'Flipkart-Internal-DB', attempts: 142 },
};

const dataExfiltrationData = [
  { name: 'HR-Records', value: 0.1 },
  { name: 'Flipkart-DB', value: 0.5 },
  { name: 'GenAI-DB', value: 1.2 },
  { name: 'Naukri-DB', value: 2.8 },
];

const suspiciousSourcesData = [
  { source: 'LAPTOP-DEV-09', queries: 25 },
  { source: 'External IP (Public): 185.220.101.45', queries: 48 },
  { source: 'unknown_service', queries: 112 },
];

const suspiciousActivityData = [
    { id: 1, timestamp: '2024-05-23 11:05:00', actor: 'api_external_bot', targetDb: 'Flipkart-DB', targetTable: 'user_payments', risk: 'Mass DELETE operation (8,500 rows)', mitigation: 'delete' },
    { id: 2, timestamp: '2024-05-23 11:02:10', actor: 'unknown_service', targetDb: 'Naukri-DB', targetTable: 'customer_data', risk: 'Large data export (2.3GB)', mitigation: 'export' },
    { id: 3, timestamp: '2024-05-23 10:58:45', actor: 'External IP (Public): 185.220.101.45', targetDb: 'GenAI-DB', targetTable: 'users', risk: 'SQL injection attempt detected', mitigation: 'injection' },
    { id: 4, timestamp: '2024-05-23 10:55:00', actor: 'LAPTOP-HR-02 (David)', targetDb: 'Finance-DB', targetTable: 'employee_salaries', risk: 'Unauthorized table access (SELECT *)', mitigation: 'insider' },
];


// --- NEW WIDGETS / COMPONENTS ---

const DbKpiCard = ({ title, data, metric, actionText, actionIcon: ActionIcon, dataClassName, actionVariant = 'destructive' }: { title: string, data: React.ReactNode, metric?: string, actionText?: string, actionIcon?: React.ElementType, dataClassName?: string, actionVariant?: 'destructive' | 'outline' }) => {
    return (
        <Card className={cn('flex flex-col justify-between', dataClassName?.includes('red') && 'bg-red-900/50 border-red-500/30', dataClassName?.includes('orange') && 'bg-orange-900/50 border-orange-500/30')}>
            <CardHeader>
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", dataClassName)}>{data}</div>
                <p className="text-xs text-muted-foreground">{metric}</p>
                {actionText && (
                    <Button variant={actionVariant} size="sm" className={cn('mt-4 w-full', actionVariant === 'destructive' && 'bg-red-600 hover:bg-red-700', actionVariant === 'outline' && 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300')}>
                        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                        {actionText}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

const DataExfiltrationChart = () => (
    <Card>
        <CardHeader>
            <CardTitle>Data Exfiltration Risk by Database</CardTitle>
            <CardDescription>Volume of data exported in last 24 hours.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataExfiltrationData} margin={{ left: -20, top: 10, right: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value} GB`} />
                        <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: 'hsl(var(--accent))' }} />
                        <Bar dataKey="value" radius={4}>
                            {dataExfiltrationData.map((entry) => (
                                <Cell key={entry.name} fill={entry.name === 'Naukri-DB' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);

const SuspiciousQuerySourcesChart = () => (
    <Card>
        <CardHeader>
            <CardTitle>Top Suspicious Query Sources</CardTitle>
            <CardDescription>Actors with the most flagged/malicious queries.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={suspiciousSourcesData} layout="vertical" margin={{ left: 200, top: 10, right: 10 }}>
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="source" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} width={200} />
                        <RechartsTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent))' }} />
                        <Bar dataKey="queries" layout="vertical" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);


export default function DatabaseMonitoringPage() {
    
    const getMitigationControls = (mitigationType: string) => {
        switch (mitigationType) {
            case 'delete':
                return (
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                            <XCircle /> Kill Query
                        </Button>
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                            <UserX /> Lock DB User
                        </Button>
                    </div>
                );
            case 'export':
                return (
                    <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                        <Unplug /> Terminate Connection
                    </Button>
                );
            case 'injection':
                 return (
                    <Button variant="outline" size="sm" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                        <Ban /> Block IP at WAF
                    </Button>
                );
            case 'insider':
                return (
                     <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                        <UserX /> Revoke User Privileges
                    </Button>
                );
            default:
                return <span className="text-muted-foreground text-xs">No actions available</span>;
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Database Monitoring</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <DbKpiCard
                    title="Critical Data Export"
                    data={kpiData.criticalExport.db}
                    metric={`${kpiData.criticalExport.volume} in ${kpiData.criticalExport.time}`}
                    actionText="Block Export Route"
                    actionIcon={Ban}
                    dataClassName="text-red-400"
                />
                 <DbKpiCard
                    title="Connection Pool Exhaustion"
                    data={`${kpiData.poolExhaustion.capacity}% Capacity`}
                    metric={kpiData.poolExhaustion.db}
                    actionText="Drop Idle Connections"
                    actionIcon={Unplug}
                    actionVariant="outline"
                    dataClassName="text-orange-400"
                />
                <DbKpiCard
                    title="Failed DB Auth Attempts"
                    data={`${kpiData.failedAuth.attempts} attempts`}
                    metric={kpiData.failedAuth.db}
                    dataClassName="text-yellow-400"
                />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
                <DataExfiltrationChart />
                <SuspiciousQuerySourcesChart />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Suspicious DB Activity & Mitigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                <TableHead>Threat Actor</TableHead>
                                <TableHead>Target DB & Table</TableHead>
                                <TableHead>Query Risk</TableHead>
                                <TableHead className="text-right">Mitigation Controls</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suspiciousActivityData.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell className="text-xs text-muted-foreground">{activity.timestamp}</TableCell>
                                    <TableCell className="font-mono text-sm">{activity.actor}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <Badge variant="outline" className="w-fit">{activity.targetDb}</Badge>
                                            <span className="font-mono text-xs text-muted-foreground mt-1">{activity.targetTable}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-yellow-400 font-medium">{activity.risk}</TableCell>
                                    <TableCell className="text-right">
                                        {getMitigationControls(activity.mitigation)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {suspiciousActivityData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">No suspicious activity detected.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

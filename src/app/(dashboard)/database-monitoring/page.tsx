"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Hourglass, Users, PackageOpen } from "lucide-react";
import { dbMonitoringData } from "@/lib/mock-data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"

const chartConfig = {
  SELECT: { label: "SELECT", color: "hsl(var(--chart-1))" },
  INSERT: { label: "INSERT", color: "hsl(var(--chart-2))" },
  UPDATE: { label: "UPDATE", color: "hsl(var(--chart-3))" },
  DELETE: { label: "DELETE", color: "hsl(var(--chart-5))" },
};

function StatCard({ title, value, unit, icon: Icon }: { title: string, value: string | number, unit?: string, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                    {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
                </div>
            </CardContent>
        </Card>
    )
}

export default function DatabaseMonitoringPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Database Monitoring</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Active Connections" value={dbMonitoringData.activeConnections} icon={Users} />
                <StatCard title="Avg Query Latency" value={dbMonitoringData.avgQueryLatency} unit="ms" icon={Hourglass} />
                <StatCard title="Data Export Volume (24h)" value={dbMonitoringData.dataExportVolume} unit="TB" icon={PackageOpen} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Database Operations</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                     <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dbMonitoringData.operationsChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                                <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Legend />
                                <Area type="monotone" dataKey="SELECT" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1) / 0.1)" />
                                <Area type="monotone" dataKey="INSERT" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.1)" />
                                <Area type="monotone" dataKey="UPDATE" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3) / 0.1)" />
                                <Area type="monotone" dataKey="DELETE" stackId="1" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5) / 0.1)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Suspicious DB Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Originating Application</TableHead>
                                <TableHead>User/Service</TableHead>
                                <TableHead>Query Type</TableHead>
                                <TableHead>Target Table</TableHead>
                                <TableHead>Reason for Flag</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dbMonitoringData.suspiciousActivity.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell><Badge variant="outline">{activity.app}</Badge></TableCell>
                                    <TableCell className="font-mono">{activity.user}</TableCell>
                                    <TableCell><Badge variant="secondary">{activity.type}</Badge></TableCell>
                                    <TableCell className="font-mono">{activity.table}</TableCell>
                                    <TableCell className="text-yellow-400">{activity.reason}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

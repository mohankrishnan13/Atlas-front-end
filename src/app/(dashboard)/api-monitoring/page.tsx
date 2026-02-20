"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, DollarSign, Gauge, Ban, LineChart } from "lucide-react";
import { apiMonitoringData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"

const chartConfig = {
  actual: {
    label: "Actual Usage",
    color: "hsl(var(--primary))",
  },
  predicted: {
    label: "AI Baseline",
    color: "hsl(var(--muted-foreground))",
  },
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

export default function ApiMonitoringPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">API Monitoring</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="API Calls Today" value={apiMonitoringData.apiCallsToday} icon={LineChart} />
                <StatCard title="Blocked Requests" value={apiMonitoringData.blockedRequests} icon={Ban} />
                <StatCard title="Average Latency" value={`${apiMonitoringData.avgLatency}ms`} icon={Gauge} />
                <StatCard title="Estimated 3rd-Party API Cost" value={`$${apiMonitoringData.estimatedCost.toFixed(2)}`} icon={DollarSign} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>API Usage vs Expected AI Baseline</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart data={apiMonitoringData.apiUsageChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} />
                                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `${value / 1000}k`} />
                                <RechartsTooltip
                                    content={<ChartTooltipContent hideLabel />}
                                    cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 2, strokeDasharray: '3 3' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="actual" name="Actual Usage" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="predicted" name="AI Baseline" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </RechartsLineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>API Routing & Abuse</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Cost/Call</TableHead>
                                <TableHead>Trend (7d)</TableHead>
                                <TableHead>Action Taken</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apiMonitoringData.apiRouting.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-xs bg-secondary">{route.app}</Badge>
                                            <span className="font-mono">{route.path}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{route.method}</Badge>
                                    </TableCell>
                                    <TableCell>${route.cost.toFixed(4)}</TableCell>
                                    <TableCell>
                                        <div className={cn("flex items-center", route.trend > 0 ? "text-red-500" : "text-emerald-500")}>
                                            {route.trend > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                            {Math.abs(route.trend)}%
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={cn(
                                                route.action === 'Blocked' && 'bg-red-500/20 text-red-400 border-red-500/30',
                                                route.action === 'Rate-Limited' && 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                                            )}
                                            variant="outline"
                                        >
                                            {route.action}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

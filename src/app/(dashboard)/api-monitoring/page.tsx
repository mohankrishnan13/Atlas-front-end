"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Ban, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts"
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiMonitoringData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useEnvironment } from "@/context/EnvironmentContext";
import { apiClient, ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

const TopRiskEndpointsChart = () => {
    const data = [
        { endpoint: 'LAPTOP-DEV-09', score: 92 },
        { endpoint: 'MAC-HR-02', score: 81 },
        { endpoint: 'WKST-ENG-15', score: 65 },
        { endpoint: 'CI-Runner-7', score: 45 },
        { endpoint: 'USER-PC-338', score: 21 },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Risk Endpoints</CardTitle>
                <CardDescription>Endpoints with the highest anomaly scores or failed logins.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-64 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 20, top: 10, right: 10 }}>
                            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                            <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis type="category" dataKey="endpoint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} width={120} />
                            <RechartsTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent))' }} />
                            <Bar dataKey="score" layout="vertical" radius={4}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? 'hsl(var(--destructive))' : entry.score > 60 ? 'hsl(var(--chart-2))' : 'hsl(var(--primary))'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

const ApiConsumptionChart = () => {
    const apiConsumptionData = [
      { app: 'Internal HR', volume: 1890 },
      { app: 'Naukri', volume: 4000 },
      { app: 'Flipkart', volume: 2181 },
      { app: 'GenAI', volume: 9800 },
      { app: 'Auth Service', volume: 2780 },
      { app: 'Shipping API', volume: 2000 },
    ];
    return (
        <Card>
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
    )
}


export default function ApiMonitoringPage() {
    const [data, setData] = useState<ApiMonitoringData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { environment } = useEnvironment();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await apiClient.getApiMonitoring(environment);
                setData(result);
            } catch (error: any) {
                console.error("Failed to fetch API monitoring data:", error);
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({
                    variant: "destructive",
                    title: "Failed to Load API Monitoring Data",
                    description: errorMessage,
                });
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [toast, environment]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">API Monitoring</h1>
            
            <div className="grid gap-4 md:grid-cols-2">
                <ApiConsumptionChart />
                <TopRiskEndpointsChart />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>API Routing & Abuse</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Endpoint</TableHead>
                                <TableHead>Cost/Call</TableHead>
                                <TableHead>Trend (7d)</TableHead>
                                <TableHead>Action Taken</TableHead>
                                <TableHead className="text-right">Mitigate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 5}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && data?.apiRouting.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="font-mono text-xs bg-secondary">{route.app}</Badge>
                                            <span className="font-mono">{route.path}</span>
                                        </div>
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
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm">
                                            <Ban className="mr-2 h-4 w-4" /> Block Endpoint
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && (!data || data.apiRouting.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">No API routing data available.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

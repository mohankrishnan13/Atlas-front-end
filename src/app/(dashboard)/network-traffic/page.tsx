"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { NetworkTrafficData, NetworkAnomaly } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useEnvironment } from "@/context/EnvironmentContext";
import { apiClient, ApiError } from "@/lib/api-client";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

function TrafficFlowMap({ isLoading, environment }: { isLoading: boolean, environment: string }) {
    const isLocal = environment === 'local';
    return (
        <Card>
            <CardHeader>
                <CardTitle>App-Aware Traffic Flow</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-around bg-card p-8 rounded-lg">
                {isLoading ? <Skeleton className="h-full w-full" /> : 
                <>
                    <div className="text-center space-y-2">
                        <div className="font-bold text-muted-foreground">{isLocal ? "Employee Workstations" : "External IPs"}</div>
                        <div className="p-4 bg-muted rounded-lg font-mono">{isLocal ? "LAPTOP-HR-02" : "203.0.113.54"}</div>
                        <div className="p-4 bg-muted rounded-lg font-mono">{isLocal ? "WKST-ENG-15" : "198.51.100.2"}</div>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground mx-4" />
                    <div className="text-center space-y-2">
                        <div className="font-bold text-muted-foreground">{isLocal ? "Office Firewall" : "Cloud Firewall"}</div>
                        <div className="p-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center font-semibold">{isLocal ? "FW-CORP-01" : "FW-CLOUD-01"}</div>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground mx-4" />
                    <div className="space-y-4">
                        <div className="font-bold text-muted-foreground text-center">{isLocal ? "Internal Resources" : "Internal App Nodes"}</div>
                        <div className="p-4 bg-secondary rounded-lg font-semibold">Naukri-Cluster</div>
                        <div className="p-4 bg-red-500/20 text-red-300 rounded-lg font-semibold">GenAI-Inference-Node</div>
                        <div className="p-4 bg-secondary rounded-lg font-semibold">Flipkart-Web</div>
                    </div>
                </>}
            </CardContent>
        </Card>
    );
}

function TopRiskEndpointsChart() {
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
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[350px] w-full">
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

export default function NetworkTrafficPage() {
    const [data, setData] = useState<NetworkTrafficData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { environment } = useEnvironment();

     useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await apiClient.getNetworkTraffic(environment);
                setData(result);
            } catch (error: any) {
                console.error("Failed to fetch network traffic data:", error);
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({
                    variant: "destructive",
                    title: "Failed to Load Network Traffic Data",
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
            <h1 className="text-3xl font-bold">Network Traffic Analysis</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TrafficFlowMap isLoading={isLoading} environment={environment} />
                <TopRiskEndpointsChart />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Network Anomalies</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Source Endpoint</TableHead>
                                <TableHead>Target Application</TableHead>
                                <TableHead>Port</TableHead>
                                <TableHead>Anomaly Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && data?.networkAnomalies.map((anomaly) => (
                                <TableRow key={anomaly.id}>
                                    <TableCell className="font-mono">{anomaly.sourceEndpoint}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{anomaly.targetApp}</Badge>
                                    </TableCell>
                                    <TableCell>{anomaly.port}</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{anomaly.type}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && (!data || data.networkAnomalies.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No network anomalies detected.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

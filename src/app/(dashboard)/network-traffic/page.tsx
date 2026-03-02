"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldX, Ban, Gauge, Signal, WifiOff, ShieldAlert, Unplug, CheckCircle, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { NetworkTrafficData, NetworkAnomaly } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useEnvironment } from "@/context/EnvironmentContext";
import { apiClient, ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const newAnomaliesData = [
  { id: 1, timestamp: "2024-05-22 10:45:01 UTC", sourceEndpoint: 'LAPTOP-HR-02 (David)', targetApp: 'Naukri DB', port: '3389', type: 'Port Scan Detected', status: 'pending' },
  { id: 2, timestamp: "2024-05-22 10:42:15 UTC", sourceEndpoint: 'MAC-HR-02 (David Chen)', targetApp: 'Flipkart-Web', port: '443', type: 'Anomalous Traffic Spike', status: 'pending' },
  { id: 3, timestamp: "2024-05-22 10:30:55 UTC", sourceEndpoint: '185.220.101.45 (External)', targetApp: 'GenAI-Inference-Node', port: '22', type: 'Brute Force SSH Attempt', status: 'blocked' },
];


// --- WIDGETS / COMPONENTS ---

function NetworkStatCard({ icon: Icon, title, value, subValue, isCritical, isWarning, actionText, actionIcon: ActionIcon, actionVariant = 'outline' }: {
    icon: React.ElementType,
    title: string,
    value: string,
    subValue?: string,
    isCritical?: boolean,
    isWarning?: boolean,
    actionText?: string,
    actionIcon?: React.ElementType,
    actionVariant?: "destructive" | "outline"
}) {
    const cardClasses = cn(
        isCritical && "bg-red-900/50 border-red-500/30",
        isWarning && "bg-orange-900/50 border-orange-500/30"
    );
    const valueClasses = cn(
        "text-2xl font-bold",
        isCritical && "text-red-300",
        isWarning && "text-orange-300"
    );
    
    return (
        <Card className={cardClasses}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn("h-4 w-4 text-muted-foreground", isCritical && "text-red-400", isWarning && "text-orange-400")} />
            </CardHeader>
            <CardContent>
                <div className={valueClasses}>{value}</div>
                {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
                {actionText && (
                    <Button variant={actionVariant} size="sm" className="mt-4">
                        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                        {actionText}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function TrafficFlowMap({ isLoading, environment }: { isLoading: boolean, environment: string }) {
    const isLocal = environment === 'local';
    return (
        <Card>
            <CardHeader>
                <CardTitle>Interactive Traffic Flow</CardTitle>
            </CardHeader>
            <CardContent className="h-auto md:h-[400px] flex flex-col md:flex-row items-center justify-around bg-card p-8 rounded-lg gap-4">
                {isLoading ? <Skeleton className="h-full w-full" /> : 
                <>
                    <div className="text-center space-y-2">
                        <div className="font-bold text-muted-foreground">{isLocal ? "Employee Workstations" : "External IPs"}</div>
                        <div className="p-4 bg-muted rounded-lg font-mono">{isLocal ? "LAPTOP-HR-02" : "203.0.113.54"}</div>
                         <div className="flex items-center gap-2">
                            <div className="p-4 bg-red-900/40 border border-red-500/30 rounded-lg font-mono text-red-300">185.220.101.45 (External)</div>
                            <Button variant="destructive" size="icon" className="h-8 w-8 shrink-0 bg-red-600/50 hover:bg-red-600/80 border border-red-500/50">
                                <ShieldAlert className="h-4 w-4" />
                                <span className="sr-only">Block at firewall</span>
                            </Button>
                        </div>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground mx-4 hidden md:block" />
                    <div className="text-center space-y-2">
                        <div className="font-bold text-muted-foreground">{isLocal ? "Office Firewall" : "Cloud Firewall"}</div>
                        <div className="p-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center font-semibold">{isLocal ? "FW-CORP-01" : "FW-CLOUD-01"}</div>
                    </div>
                    <ArrowRight className="h-8 w-8 text-muted-foreground mx-4 hidden md:block" />
                    <div className="space-y-4">
                        <div className="font-bold text-muted-foreground text-center">{isLocal ? "Internal Resources" : "Internal App Nodes"}</div>
                        <div className="p-4 bg-secondary rounded-lg font-semibold text-center">Naukri-Cluster</div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="p-4 bg-red-500/20 text-red-300 rounded-lg font-semibold">GenAI-Inference-Node</div>
                             <Button variant="link" className="text-red-400 hover:text-red-300 h-auto p-0 text-xs">[Isolate Node]</Button>
                        </div>
                        <div className="p-4 bg-secondary rounded-lg font-semibold text-center">Flipkart-Web</div>
                    </div>
                </>}
            </CardContent>
        </Card>
    );
}


export default function NetworkTrafficPage() {
    const [anomalies, setAnomalies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const { environment } = useEnvironment();

     useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setAnomalies(newAnomaliesData);
            } catch (error: any) {
                console.error("Failed to fetch network traffic data:", error);
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({
                    variant: "destructive",
                    title: "Failed to Load Network Traffic Data",
                    description: errorMessage,
                });
                setAnomalies([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [toast, environment]);

    const getMitigationControls = (anomaly: any) => {
        switch (anomaly.type) {
            case 'Port Scan Detected':
                return (
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300">
                            <Unplug className="mr-2" /> Drop Connection
                        </Button>
                        <Button variant="destructive" size="sm">
                            <ShieldX className="mr-2" /> Quarantine Laptop
                        </Button>
                    </div>
                );
            case 'Anomalous Traffic Spike':
                return (
                     <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                        <Signal className="mr-2" /> Throttle Endpoint
                    </Button>
                );
            case 'Brute Force SSH Attempt':
                return (
                    <div className="flex items-center justify-end gap-4">
                        <span className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                            <CheckCircle className="h-4 w-4" /> Firewall Block Active
                        </span>
                        <Button variant="secondary" size="sm">
                            <MapPin className="mr-2" /> Trace IP Origin
                        </Button>
                    </div>
                );
            default:
                return <span className="text-muted-foreground text-xs">No actions available</span>;
        }
    }


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Network Traffic Analysis</h1>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <NetworkStatCard 
                    icon={Gauge}
                    title="Highest Bandwidth Consumer"
                    value="GenAI-Inference-Node"
                    subValue="4.2 GB/s (92% of pipe)"
                    isCritical
                    actionText="Throttle Bandwidth"
                    actionIcon={Signal}
                    actionVariant="destructive"
                />
                 <NetworkStatCard 
                    icon={WifiOff}
                    title="Critical Packet Loss"
                    value="Flipkart-Web"
                    subValue="342 Dropped Packets/min"
                    isWarning
                />
                 <NetworkStatCard 
                    icon={ShieldAlert}
                    title="Unauthorized Network Access"
                    value="7 Unknown MAC Addresses"
                    subValue="Detected on HR-Subnet"
                    isCritical
                    actionText="Block MAC Addresses"
                    actionIcon={Ban}
                    actionVariant="destructive"
                />
            </div>

            <TrafficFlowMap isLoading={isLoading} environment={environment} />

            <Card>
                <CardHeader>
                    <CardTitle>Active Network Anomaly Mitigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Source Endpoint</TableHead>
                                <TableHead>Target Application</TableHead>
                                <TableHead>Port</TableHead>
                                <TableHead>Anomaly Type</TableHead>
                                <TableHead className="text-right">Mitigation Controls</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && anomalies.map((anomaly: any) => (
                                <TableRow key={anomaly.id}>
                                    <TableCell className="text-xs text-muted-foreground">{anomaly.timestamp}</TableCell>
                                    <TableCell className="font-mono">{anomaly.sourceEndpoint}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{anomaly.targetApp}</Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{anomaly.port}</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{anomaly.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {getMitigationControls(anomaly)}
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && (anomalies.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">No network anomalies detected.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Laptop, ShieldAlert, ShieldX, Bug } from "lucide-react";
import { cn, getSeverityClassNames } from "@/lib/utils";
import type { Severity, EndpointSecurityData, OsDistribution, AlertTypeDistribution, WazuhEvent } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useEnvironment } from '@/context/EnvironmentContext';
import { apiClient, ApiError } from '@/lib/api-client';

function StatCard({ title, value, subtext, icon: Icon, isLoading, isCritical }: { title: string, value?: string | number, subtext?: string, icon: React.ElementType, isLoading: boolean, isCritical?: boolean }) {
    return (
        <Card className={cn(isCritical && "bg-red-900/50 border-red-500/30")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={cn("h-4 w-4 text-muted-foreground", isCritical && "text-red-400")} />
            </CardHeader>
            <CardContent>
                 {isLoading ? <Skeleton className="h-8 w-24" /> : 
                 <>
                    <div className={cn("text-2xl font-bold", isCritical && "text-red-300")}>{value}</div>
                    {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
                 </>
                 }
            </CardContent>
        </Card>
    )
}

export default function EndpointSecurityPage() {
    const { toast } = useToast();
    const [data, setData] = useState<EndpointSecurityData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { environment } = useEnvironment();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await apiClient.getEndpointSecurity(environment);
                setData(result);
            } catch (error: any) {
                console.error("Failed to fetch endpoint security data:", error);
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({
                    variant: "destructive",
                    title: "Failed to Load Endpoint Security Data",
                    description: errorMessage,
                });
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [toast, environment]);

    const handleQuarantine = async (workstationId: string) => {
        try {
            await apiClient.quarantineDevice(workstationId);
            toast({
                title: "Quarantine Action",
                description: `Device ${workstationId} has been sent to quarantine.`,
            });
            // Refetch data to show updated status
            const result = await apiClient.getEndpointSecurity(environment);
            setData(result);
        } catch (error: any) {
            console.error('Quarantine failed:', error);
             toast({
                title: "Error",
                description: error.message || `Failed to quarantine device ${workstationId}.`,
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Endpoint Security</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Endpoint with Most Alerts" 
                    value="LAPTOP-DEV-09"
                    subtext="15 unresolved alerts"
                    icon={Laptop} 
                    isLoading={isLoading}
                    isCritical
                />
                <StatCard 
                    title="Most Frequent Alert Type" 
                    value="Malware Detected" 
                    subtext="42 instances today"
                    icon={ShieldAlert} 
                    isLoading={isLoading} 
                    isCritical
                />
                <StatCard 
                    title="Unpatched OS Detected" 
                    value="Windows 10 (1809)" 
                    subtext="Affecting 12 devices"
                    icon={Bug} 
                    isLoading={isLoading} 
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Wazuh Agent Event Log & Mitigation</CardTitle>
                    <CardDescription>Live feed of endpoint alerts from the Wazuh agent, with immediate response actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Workstation ID</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>Alert Type</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && data?.wazuhEvents.map((event: WazuhEvent) => {
                                const severityClasses = getSeverityClassNames(event.severity as Severity);
                                return (
                                <TableRow key={event.id}>
                                    <TableCell className="font-mono">{event.workstationId}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={event.avatar} alt={event.employee} data-ai-hint="person face" />
                                                <AvatarFallback>{event.employee.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{event.employee}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{event.alert}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(severityClasses.badge)}>
                                            {event.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleQuarantine(event.workstationId)}
                                        >
                                            <ShieldX className="mr-2 h-4 w-4" />
                                            Quarantine Device
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                             {!isLoading && (!data || data.wazuhEvents.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">No Wazuh events to display.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

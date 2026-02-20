"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Laptop, WifiOff, ShieldAlert, ShieldX } from "lucide-react";
import { endpointSecurityData } from "@/lib/mock-data";
import { cn, getSeverityClassNames } from "@/lib/utils";
import type { Severity } from "@/lib/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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

function OsDistributionChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>OS Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={endpointSecurityData.osDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                {endpointSecurityData.osDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

function AlertTypesChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alert Types</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ChartContainer config={{}} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={endpointSecurityData.alertTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
                                 {endpointSecurityData.alertTypes.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default function EndpointSecurityPage() {
    const { toast } = useToast();

    const handleQuarantine = (workstationId: string) => {
        toast({
            title: "Quarantine Action",
            description: `Device ${workstationId} has been sent to quarantine.`,
        });
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Endpoint Security</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Monitored Laptops" value={endpointSecurityData.monitoredLaptops} icon={Laptop} />
                <StatCard title="Offline Devices" value={endpointSecurityData.offlineDevices} icon={WifiOff} />
                <StatCard title="Malware Alerts" value={endpointSecurityData.malwareAlerts} icon={ShieldAlert} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <OsDistributionChart />
                <AlertTypesChart />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Wazuh Agent Event Log</CardTitle>
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
                            {endpointSecurityData.wazuhEvents.map((event) => {
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
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

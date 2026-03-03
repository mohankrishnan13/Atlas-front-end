'use client';

import { useState } => (
  <Card className="flex flex-col justify-between">
            <CardHeader>
                <CardTitle className="text-base font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", dataClassName)}>{data}</div>
                {actionText && (
                    <Button variant={actionVariant} size="sm" className="mt-4 w-full">
                        {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                        {actionText}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

const MostVulnerableEndpointsChart = () => (
    <Card>
        <CardHeader>
            <CardTitle>Most Vulnerable Endpoints</CardTitle>
            <CardDescription>Endpoints with the highest count of critical vulnerabilities (CVEs).</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mostVulnerableData} layout="vertical" margin={{ left: 100, top: 10, right: 10 }}>
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="endpoint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} width={100} />
                        <RechartsTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent))' }} />
                        <Bar dataKey="cves" layout="vertical" radius={[0, 4, 4, 0]}>
                            {mostVulnerableData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={
                                    index === 0 ? 'hsl(var(--destructive))' :
                                    index < 3 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-4))'
                                } />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);

const TopViolatorsChart = () => (
    <Card>
        <CardHeader>
            <CardTitle>Top Endpoint Policy Violators</CardTitle>
            <CardDescription>Users with the most security policy violations.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topViolatorsData} margin={{ left: -20, top: 10, right: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="user" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: 'hsl(var(--accent))' }}/>
                        <Bar dataKey="violations" fill="hsl(var(--primary))" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);

export default function EndpointSecurityPage() {
    
    const getMitigationControls = (threatType: string) => {
        switch (threatType) {
            case 'malware':
                return (
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                            <Bug className="mr-2" /> Kill Process
                        </Button>
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                            <Server className="mr-2" /> Quarantine Device
                        </Button>
                    </div>
                );
            case 'usb':
                return (
                    <Button variant="outline" size="sm" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300">
                        <Unplug className="mr-2" /> Lock USB Ports
                    </Button>
                );
            case 'tampering':
                return (
                    <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                        <Power className="mr-2" /> Force Enable Defender
                    </Button>
                );
            case 'network':
                 return (
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                            <Ban className="mr-2" /> Drop Connection
                        </Button>
                        <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                            <UserX className="mr-2" /> Lock User Account
                        </Button>
                    </div>
                );
            default:
                return <Button variant="secondary" size="sm" disabled>No action available</Button>;
        }
    }


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Endpoint Security</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    title="Active Malware Infections"
                    data={`${kpiData.malwareInfections} Devices Compromised`}
                    actionText="Isolate Devices"
                    actionIcon={Server}
                    dataClassName='text-red-400'
                />
                <KpiCard
                    title="Critical Policy Violations (AV Disabled)"
                    data={<div className="font-mono text-base">{kpiData.policyViolations.join(', ')}</div>}
                    actionText="Force Enable AV"
                    actionIcon={Power}
                    actionVariant="outline"
                     dataClassName='text-orange-400'
                />
                 <KpiCard
                    title="Users with High Anomaly Scores"
                    data={<div className="font-mono text-base">{kpiData.highRiskUsers.join(', ')}</div>}
                    dataClassName='text-yellow-400'
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <MostVulnerableEndpointsChart />
                <TopViolatorsChart />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Endpoint Event Log & Mitigation</CardTitle>
                    <CardDescription>Live feed of endpoint threats with context-aware response actions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[180px]">Timestamp</TableHead>
                                <TableHead>Endpoint & User</TableHead>
                                <TableHead>Threat Description</TableHead>
                                <TableHead className="text-right">Context-Aware Mitigation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {endpointEventsData.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="text-xs text-muted-foreground">{event.timestamp}</TableCell>
                                    <TableCell>
                                        <div className="font-mono text-white">{event.endpoint}</div>
                                        <div className="text-xs text-muted-foreground">{event.user}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{event.threat}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {getMitigationControls(event.type)}
                                    </TableCell>
                                </TableRow>
                            ))}
                             {endpointEventsData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">No endpoint events to display.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

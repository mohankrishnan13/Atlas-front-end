'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Search, Sparkles, ShieldAlert, AlertTriangle, AlertCircle, Zap, UserPlus, Laptop, PlayCircle } from "lucide-react";
import { cn, getSeverityClassNames } from "@/lib/utils";

const kpiData = {
  criticalOpen: 3,
  meanTimeToResolve: '14 minutes',
};

const incidentCases = [
  {
    id: 'INC-8042',
    severity: 'Critical',
    target: 'GenAI Service',
    aiSummary: 'Coordinated API rate limit bypass. 15,000 unauthorized token requests from 4 external IPs.',
    status: 'Open',
    actions: ['View AI Root Cause', 'Trigger Lockdown Playbook'],
  },
  {
    id: 'INC-8041',
    severity: 'High',
    target: 'LAPTOP-HR-02',
    aiSummary: 'Wazuh agent reports disabled Windows Defender and unauthorized PowerShell execution.',
    status: 'Investigating',
    actions: ['Quarantine Laptop', 'Assign to Me'],
  },
  {
    id: 'INC-8039',
    severity: 'Medium',
    target: 'Flipkart Web',
    aiSummary: 'Anomalous traffic spike from internal service account `api_reporting_svc`.',
    status: 'Investigating',
    actions: ['View Traffic', 'Assign to Me'],
  },
  {
    id: 'INC-8038',
    severity: 'Critical',
    target: 'Naukri DB',
    aiSummary: 'Massive data export (2.8 GB) initiated from an unknown service account to an external endpoint.',
    status: 'Open',
    actions: ['View AI Root Cause', 'Trigger Lockdown Playbook'],
  },
    {
    id: 'INC-8037',
    severity: 'High',
    target: 'Auth Service',
    aiSummary: '842 failed login attempts detected against admin accounts from a single IP.',
    status: 'Open',
    actions: ['Block IP at WAF', 'Assign to Me'],
  },
];

const filterOptions = {
  targetApplication: ['GenAI Service', 'Naukri DB', 'Flipkart Web'],
  severity: ['Critical', 'High', 'Medium'],
  status: ['Open', 'Investigating', 'Resolved'],
};

const severityIcons = {
  Critical: <ShieldAlert className="h-5 w-5 text-red-500" />,
  High: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  Medium: <AlertCircle className="h-5 w-5 text-yellow-500" />,
};


const FiltersSidebar = () => (
    <Card className="h-fit sticky top-24">
        <CardHeader>
            <CardTitle>Filter Incidents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold mb-3">Target Application</h3>
                <div className="space-y-2">
                    {filterOptions.targetApplication.map(app => (
                        <div key={app} className="flex items-center gap-2">
                            <Checkbox id={`filter-app-${app}`} />
                            <Label htmlFor={`filter-app-${app}`}>{app}</Label>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-3">Severity</h3>
                <div className="space-y-2">
                    {filterOptions.severity.map(sev => (
                        <div key={sev} className="flex items-center gap-2">
                            <Checkbox id={`filter-sev-${sev}`} />
                            <div className="flex items-center gap-1.5">
                                {severityIcons[sev as keyof typeof severityIcons]}
                                <Label htmlFor={`filter-sev-${sev}`}>{sev}</Label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-semibold mb-3">Status</h3>
                <div className="space-y-2">
                    {filterOptions.status.map(stat => (
                        <div key={stat} className="flex items-center gap-2">
                            <Checkbox id={`filter-stat-${stat}`} />
                            <Label htmlFor={`filter-stat-${stat}`}>{stat}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
    </Card>
)

const MitigationActions = ({ actions }: { actions: string[] }) => {
    const getButton = (action: string) => {
        switch (action) {
            case 'View AI Root Cause':
                return <Button variant="secondary" size="sm"><Sparkles />{action}</Button>;
            case 'Trigger Lockdown Playbook':
                return <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700"><PlayCircle />{action}</Button>;
            case 'Quarantine Laptop':
                return <Button variant="outline" size="sm" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"><Laptop />{action}</Button>;
            case 'Assign to Me':
                return <Button variant="outline" size="sm"><UserPlus />{action}</Button>;
            case 'Block IP at WAF':
                 return <Button variant="destructive" size="sm"><ShieldAlert />{action}</Button>;
            case 'View Traffic':
                 return <Button variant="secondary" size="sm">{action}</Button>;
            default:
                return <Button variant="secondary" size="sm">{action}</Button>;
        }
    }

    return (
        <div className="flex gap-2 justify-end">
            {actions.map(action => (
                <React.Fragment key={action}>{getButton(action)}</React.Fragment>
            ))}
        </div>
    )
}

const SeverityIndicator = ({ severity }: { severity: string }) => {
    if (severity === 'Critical') {
        return (
            <div className="flex h-3 w-3 relative">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
            </div>
        )
    }
    const severityClasses = getSeverityClassNames(severity as any);
    return <div className={cn('h-3 w-3 rounded-full', severityClasses.badge.split(' ')[0])}></div>
}


export default function IncidentsPage() {
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Incident Case Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
                <FiltersSidebar />

                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium">Critical Open Incidents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-red-500">{kpiData.criticalOpen}</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium">Mean Time to Resolve</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{kpiData.meanTimeToResolve}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder='Search Incident Cases, IPs, or Hostnames...'
                            className="pl-10"
                        />
                    </div>

                    <Card>
                        <CardContent className="p-0">
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">Severity</TableHead>
                                        <TableHead>Incident ID & Target</TableHead>
                                        <TableHead>AI Threat Summary</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Mitigation Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {incidentCases.map((incident) => {
                                        const statusColor =
                                            incident.status === 'Open' ? 'red' :
                                            incident.status === 'Investigating' ? 'yellow' : 'emerald';

                                        return (
                                            <TableRow key={incident.id}>
                                                <TableCell className="flex justify-center pt-6">
                                                    <SeverityIndicator severity={incident.severity} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-bold text-primary">{incident.id}</div>
                                                    <div className="text-xs text-muted-foreground">Target: {incident.target}</div>
                                                </TableCell>
                                                <TableCell>
                                                     <div className="flex items-center gap-2 max-w-md">
                                                        <Sparkles className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                                        <span className="text-blue-200/80 text-sm">{incident.aiSummary}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`bg-${statusColor}-500/10 text-${statusColor}-400 border-${statusColor}-500/20`}
                                                    >
                                                        {incident.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <MitigationActions actions={incident.actions} />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
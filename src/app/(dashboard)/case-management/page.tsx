'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Sparkles, ShieldAlert, AlertTriangle, Clock, User, UserPlus, Bot, PlayCircle, FileText, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import placeholderData from '@/lib/placeholder-images.json';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";


type Assignee = { name: string; avatar: string; } | 'Unassigned' | 'System (Auto)';
type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
type CaseSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

type InvestigationCase = {
    id: string;
    severity: CaseSeverity;
    scope: string[];
    aiNarrative: string;
    assignee: Assignee;
    status: CaseStatus;
    playbookActions: string[];
}

const investigationCases: InvestigationCase[] = [
  {
    id: 'CAS-8042',
    severity: 'Critical',
    scope: ['GenAI Service', 'GenAI-Vector-DB'],
    aiNarrative: "Correlated Attack: External IP brute-forced the GenAI Service API, subsequently executing a massive data exfiltration query against the Vector DB. 1.2GB exposed.",
    assignee: { name: 'Jane Doe', avatar: placeholderData.placeholderImages[0].imageUrl },
    status: 'OPEN',
    playbookActions: ['View AI Timeline', 'Execute Total Lockdown Playbook'],
  },
  {
    id: 'CAS-8041',
    severity: 'High',
    scope: ['LAPTOP-HR-02', 'Finance Subnet'],
    aiNarrative: "Insider Threat: Wazuh agent detected disabled antivirus. 5 minutes later, the laptop began an unauthorized lateral port scan against the internal Finance Subnet.",
    assignee: 'Unassigned',
    status: 'INVESTIGATING',
    playbookActions: ['Assign to Me', 'Quarantine Endpoint & Drop MAC'],
  },
  {
    id: 'CAS-8039',
    severity: 'Medium',
    scope: ['Naukri Portal'],
    aiNarrative: "Automated Mitigation: Progressive containment rules triggered a hard block on 5 external IPs attempting a coordinated DDoS. Zero downtime.",
    assignee: 'System (Auto)',
    status: 'RESOLVED',
    playbookActions: ['Generate Post-Mortem Report'],
  },
];


const kpiData = {
  criticalOpen: 3,
  meanTimeToResolve: '14m 22s',
  unassignedEscalations: 1,
};

const renderAssignee = (assignee: Assignee) => {
    if (assignee === 'Unassigned') {
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border-2 border-dashed border-slate-600"><AvatarFallback>?</AvatarFallback></Avatar>
                <span className="font-semibold text-muted-foreground">Unassigned</span>
            </div>
        );
    }
    if (assignee === 'System (Auto)') {
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9"><AvatarFallback><Bot /></AvatarFallback></Avatar>
                <span className="font-semibold text-muted-foreground">System (Auto)</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback>{assignee.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{assignee.name}</span>
        </div>
    );
};

const getStatusBadge = (status: CaseStatus) => {
    const styles = {
        OPEN: 'bg-red-500/20 text-red-400 border-red-500/30',
        INVESTIGATING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        RESOLVED: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return <Badge variant="outline" className={cn("w-fit font-semibold", styles[status])}>{status}</Badge>;
}

const getPlaybookButton = (action: string) => {
    switch(action) {
        case 'View AI Timeline':
            return <Button variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30 hover:bg-blue-600/30"><Sparkles />{action}</Button>
        case 'Execute Total Lockdown Playbook':
            return <Button variant="destructive" className="bg-red-600 hover:bg-red-700"><PlayCircle />{action}</Button>
        case 'Assign to Me':
            return <Button variant="secondary" className="bg-blue-600 hover:bg-blue-700 text-white"><UserPlus />{action}</Button>
        case 'Quarantine Endpoint & Drop MAC':
            return <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"><ShieldAlert />{action}</Button>
        case 'Generate Post-Mortem Report':
            return <Button variant="outline"><FileText />{action}</Button>
        default:
            return <Button variant="secondary">{action}</Button>
    }
}

const getSeverityStyles = (severity: CaseSeverity) => {
    switch (severity) {
        case 'Critical': return 'border-red-500/50 hover:border-red-500/80';
        case 'High': return 'border-orange-500/50 hover:border-orange-500/80';
        case 'Medium': return 'border-yellow-500/50 hover:border-yellow-500/80';
        default: return 'border-slate-800';
    }
};

export default function CaseManagementPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Active Investigations</h1>
                    <p className="text-muted-foreground">Correlated threat cases requiring analyst attention.</p>
                </div>
                 <div className="flex w-full sm:w-auto items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search Case ID, App, or Analyst..." className="pl-9 w-full sm:w-64" />
                    </div>
                    <Button variant="outline"><Target className="mr-2 h-4 w-4" />Filter by Target App</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Critical Open Cases</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500 flex items-center gap-2">
                             <div className="flex h-3 w-3 relative">
                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></div>
                                <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
                            </div>
                            {kpiData.criticalOpen}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unassigned Escalations</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-400">{kpiData.unassignedEscalations}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Mean Time to Resolve (MTTR)</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">{kpiData.meanTimeToResolve}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                {investigationCases.map(caseItem => (
                    <Card key={caseItem.id} className={cn("transition-all", getSeverityStyles(caseItem.severity))}>
                        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_250px] lg:grid-cols-[2fr_1fr_2fr] items-start gap-4">
                            
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-semibold">{caseItem.id}</span>
                                    <div className="flex items-center gap-1">
                                        {caseItem.scope.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                                    </div>
                                </div>
                                 <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                                    <Sparkles className="h-4 w-4 text-blue-400 flex-shrink-0 mt-1" />
                                    <span>{caseItem.aiNarrative}</span>
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 justify-self-start md:justify-self-end lg:justify-self-start">
                                <span className="text-xs font-semibold text-muted-foreground">ASSIGNEE</span>
                                {renderAssignee(caseItem.assignee)}
                                {getStatusBadge(caseItem.status)}
                            </div>

                            <div className="flex flex-col gap-2 items-start md:items-end w-full md:col-span-2 lg:col-span-1">
                                 <span className="text-xs font-semibold text-muted-foreground">PLAYBOOK RESPONSES</span>
                                <TooltipProvider>
                                    <div className="flex flex-wrap justify-start md:justify-end gap-2">
                                        {caseItem.playbookActions.map(action => (
                                             <Tooltip key={action} delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    {getPlaybookButton(action)}
                                                </TooltipTrigger>
                                                 <TooltipContent>
                                                    <p>{action}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </div>
                                </TooltipProvider>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

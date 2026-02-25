'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Cog, SlidersHorizontal, Shield, BrainCircuit, Users, AlertTriangle, Search, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'general' | 'alert-tuning' | 'containment' | 'ml-baselines' | 'user-access';

const navItems = [
  { id: 'general', label: 'General', icon: Cog },
  { id: 'alert-tuning', label: 'Alert Tuning', icon: SlidersHorizontal },
  { id: 'containment', label: 'Progressive Containment', icon: Shield },
  { id: 'ml-baselines', label: 'ML Baselines', icon: BrainCircuit },
  { id: 'user-access', label: 'User Access', icon: Users },
];

const mockUsers = [
    {
        name: 'Jane Doe',
        email: 'jane@atlas.com',
        role: 'Admin',
        roleColor: 'bg-purple-600/20 text-purple-300 border-purple-500/30',
        status: 'Active',
        statusColor: 'bg-emerald-500',
        avatar: 'JD'
    },
    {
        name: 'John Smith',
        email: 'john@atlas.com',
        role: 'Analyst',
        roleColor: 'bg-blue-600/20 text-blue-300 border-blue-500/30',
        status: 'Active',
        statusColor: 'bg-emerald-500',
        avatar: 'JS'
    },
    {
        name: 'Auditor External',
        email: 'audit@firm.com',
        role: 'Read-Only',
        roleColor: 'bg-slate-600/50 text-slate-300 border-slate-500/30',
        status: 'Invite Pending',
        statusColor: 'bg-yellow-500',
        avatar: 'AE'
    }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  // State for interactive elements
  const [systemName, setSystemName] = useState('ATLAS | Enterprise Anomaly Monitoring System');
  const [timezone, setTimezone] = useState('utc');
  const [retention, setRetention] = useState(90);
  const [criticalThreshold, setCriticalThreshold] = useState([85]);
  const [warningThreshold, setWarningThreshold] = useState([60]);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [softLimit, setSoftLimit] = useState([300]);
  const [hardBlock, setHardBlock] = useState([1000]);
  const [accumulationWindow, setAccumulationWindow] = useState([7]);
  const [autoDismiss, setAutoDismiss] = useState(true);
  const [enableML, setEnableML] = useState(true);
  const [autoQuarantine, setAutoQuarantine] = useState(false);
  const [trainingWindow, setTrainingWindow] = useState(30);
  const [modelSensitivity, setModelSensitivity] = useState('balanced');


  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <Card>
            <CardHeader>
              <CardTitle>General System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" value={systemName} onChange={e => setSystemName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-period">Data Retention Period (Days)</Label>
                <Input id="retention-period" type="number" value={retention} onChange={e => setRetention(Number(e.target.value))} />
                <p className="text-sm text-muted-foreground">Logs older than this will be automatically archived to cold storage.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'alert-tuning':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Alert Threshold Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label>Critical Alert Threshold (Score {criticalThreshold[0]}-100)</Label>
                <Slider value={criticalThreshold} onValueChange={setCriticalThreshold} max={100} min={80} step={1} className="[&>span]:bg-red-500" />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Sensitivity</span>
                    <span>High Sensitivity</span>
                </div>
              </div>
               <div className="space-y-4">
                <Label>Warning Alert Threshold (Score {warningThreshold[0]}-79)</Label>
                <Slider value={warningThreshold} onValueChange={setWarningThreshold} max={79} min={50} step={1} className="[&>span]:bg-orange-500" />
                 <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low Sensitivity</span>
                    <span>High Sensitivity</span>
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-lg font-semibold">Notifications</h4>
                 <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <Label htmlFor="email-alerts" className="font-medium">Enable Email Alerts for Critical Incidents</Label>
                    <Switch id="email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'containment':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Progressive Containment Rules</CardTitle>
                    <CardDescription>Configure automated response thresholds based on anomaly frequency.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="space-y-4">
                        <Label>Soft Rate Limit Threshold ({softLimit[0]} Calls/min)</Label>
                        <Slider value={softLimit} onValueChange={setSoftLimit} max={1000} min={100} step={10} className="[&>span]:bg-blue-500" />
                    </div>
                     <div className="space-y-4">
                        <Label>Hard Block Threshold ({hardBlock[0]} Calls/min)</Label>
                        <Slider value={hardBlock} onValueChange={setHardBlock} max={5000} min={500} step={50} className="[&>span]:bg-red-500" />
                    </div>
                    <div className="space-y-4">
                        <Label>Anomaly Accumulation Window ({accumulationWindow[0]} Days)</Label>
                        <Slider value={accumulationWindow} onValueChange={setAccumulationWindow} max={30} min={1} step={1} className="[&>span]:bg-orange-500" />
                    </div>
                    <div className="space-y-4 pt-4 border-t border-slate-800">
                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <Label htmlFor="auto-dismiss" className="font-medium">Auto-dismiss known benign activity</Label>
                            <Switch id="auto-dismiss" checked={autoDismiss} onCheckedChange={setAutoDismiss} />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                            <Label htmlFor="enable-ml" className="font-medium">Enable ML-based baseline learning</Label>
                            <Switch id="enable-ml" checked={enableML} onCheckedChange={setEnableML} />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-red-900/50">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                <Label htmlFor="auto-quarantine" className="font-medium text-red-400">Auto-quarantine infected endpoints</Label>
                            </div>
                            <Switch id="auto-quarantine" checked={autoQuarantine} onCheckedChange={setAutoQuarantine} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
      case 'ml-baselines':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Machine Learning Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm rounded-lg p-4 flex items-center gap-3">
                        <BrainCircuit className="h-5 w-5"/>
                        <span>ML Engine Status: Active. Learning from past 30 days of traffic.</span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="training-window">Training Period Window (Days)</Label>
                        <Input id="training-window" type="number" value={trainingWindow} onChange={e => setTrainingWindow(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="model-sensitivity">Model Sensitivity Strategy</Label>
                        <Select value={modelSensitivity} onValueChange={setModelSensitivity}>
                            <SelectTrigger id="model-sensitivity"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="conservative">Conservative (Fewer False Positives)</SelectItem>
                                <SelectItem value="balanced">Balanced</SelectItem>
                                <SelectItem value="aggressive">Aggressive (Catch All Anomalies)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        );
      case 'user-access':
        return (
            <Card>
                <CardHeader>
                    <CardTitle>User Access & Roles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search users by name or email..." className="pl-9" />
                        </div>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New User
                        </Button>
                    </div>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockUsers.map((user) => (
                                <TableRow key={user.email}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-9 h-9">
                                                <AvatarFallback className="bg-slate-700 text-slate-300">{user.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={user.roleColor}>{user.role}</Badge>
                                    </TableCell>
                                     <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("h-2 w-2 rounded-full", user.statusColor)}></span>
                                            <span>{user.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {user.role === 'Admin' && <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-950 hover:text-blue-300">Edit Permissions</Button>}
                                        {user.role === 'Analyst' && <Button variant="outline" className="text-red-400 border-red-500/50 hover:bg-red-950 hover:text-red-300">Revoke Access</Button>}
                                        {user.role === 'Read-Only' && <Button variant="outline" className="border-slate-500/50 hover:bg-slate-800">Resend Invite</Button>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
        {/* Left Column (Sub-navigation Sidebar) */}
        <aside className="sticky top-24">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                    <Button
                        key={item.id}
                        variant="ghost"
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={cn(
                            "w-full justify-start items-center gap-3 px-3 py-2 text-md",
                            isActive ? 'bg-blue-900/50 text-blue-300 border-l-2 border-blue-400' : 'text-muted-foreground hover:bg-slate-800 hover:text-white',
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Button>
                )
            })}
          </nav>
        </aside>

        {/* Right Column (Main Content Area) */}
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

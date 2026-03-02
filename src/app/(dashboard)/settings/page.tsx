"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Cog, SlidersHorizontal, Shield, BrainCircuit, Users, AlertTriangle, Search, PlusCircle, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { TeamUser, QuarantinedEndpoint } from '@/lib/types';

type Tab = 'general' | 'alert-tuning' | 'containment' | 'ml-baselines' | 'user-access';

const navItems = [
  { id: 'general', label: 'General', icon: Cog },
  { id: 'alert-tuning', label: 'Alert Tuning', icon: SlidersHorizontal },
  { id: 'containment', label: 'Containment', icon: Shield },
  { id: 'ml-baselines', label: 'ML Baselines', icon: BrainCircuit },
  { id: 'user-access', label: 'User Access', icon: Users },
];

const mockAppSettings = {
    global: { criticalThreshold: 85, warningThreshold: 60, softLimit: 300, hardBlock: 1000, accumulationWindow: 7 },
    naukri: { criticalThreshold: 90, warningThreshold: 70, softLimit: 500, hardBlock: 2000, accumulationWindow: 5 },
    genai: { criticalThreshold: 80, warningThreshold: 55, softLimit: 150, hardBlock: 100, accumulationWindow: 3 },
    flipkart: { criticalThreshold: 95, warningThreshold: 75, softLimit: 1000, hardBlock: 5000, accumulationWindow: 14 }
}

const mockQuarantinedEndpoints: QuarantinedEndpoint[] = [
    { id: '1', hostname: 'LAPTOP-DEV-09', quarantinedAt: '2024-05-21 14:30:10 UTC', reason: 'Unauthorized port scan' },
    { id: '2', hostname: 'MAC-HR-02', quarantinedAt: '2024-05-21 10:15:22 UTC', reason: 'Firewall disabled by user' },
]

const mockTeamUsers: TeamUser[] = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@atlas.com', role: 'Global Admin', scope: ['All Applications'], avatar: '', status: 'Active' },
    { id: 2, name: 'John Smith', email: 'john.smith@atlas.com', role: 'Tier 1 Analyst', scope: ['Naukri', 'Flipkart'], avatar: '', status: 'Active' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@atlas.com', role: 'Tier 1 Analyst', scope: ['GenAI'], avatar: '', status: 'Invite Pending' },
];


function UserAccessTab() {
    const { toast } = useToast();
    const [users, setUsers] = useState<TeamUser[]>(mockTeamUsers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: { name: '', email: '', role: 'Tier 1 Analyst' as "Global Admin" | "Tier 1 Analyst" }
    });

    const handleAddUser = (data: {name: string, email: string, role: "Global Admin" | "Tier 1 Analyst"}) => {
        const newUser: TeamUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            name: data.name,
            email: data.email,
            role: data.role,
            scope: data.role === 'Global Admin' ? ['All Applications'] : [],
            avatar: '',
            status: 'Invite Pending'
        };
        setUsers(prev => [...prev, newUser]);
        toast({ title: 'User Invited', description: `${data.name} has been invited to join ATLAS.` });
        setIsDialogOpen(false);
        reset();
    };
    
    const handleDeleteUser = (userId: number, userName: string) => {
        if (!confirm(`Are you sure you want to revoke access for ${userName}?`)) return;
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast({ title: 'User Access Revoked', description: `Access for ${userName} has been revoked.` });
    };

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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Invite Team Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite New User</DialogTitle>
                                <DialogDescription>Enter the details of the user you want to invite.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleAddUser)} className="space-y-4">
                                <Controller name="name" control={control} render={({ field }) => (<div className="space-y-2"><Label>Full Name</Label><Input {...field} /></div>)} />
                                <Controller name="email" control={control} render={({ field }) => (<div className="space-y-2"><Label>Email</Label><Input type="email" {...field} /></div>)} />
                                <Controller name="role" control={control} render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Tier 1 Analyst">Tier 1 Analyst</SelectItem>
                                                <SelectItem value="Global Admin">Global Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )} />
                                <DialogFooter>
                                    <Button type="submit">Send Invite</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>App Access Scope</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-9 h-9">
                                            <AvatarFallback className="bg-slate-700 text-slate-300">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium text-white">{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={user.role === 'Global Admin' ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' : 'bg-blue-600/20 text-blue-300 border-blue-500/30'}>{user.role}</Badge>
                                </TableCell>
                                <TableCell className="flex items-center gap-1">
                                    {user.scope?.map(app => (
                                        <Badge key={app} variant="secondary">{app}</Badge>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("h-2 w-2 rounded-full", user.status === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500')}></span>
                                        <span>{user.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm"><Edit /> Edit</Button>
                                        {user.role !== 'Global Admin' && (
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id, user.name)}>
                                                <Trash2 /> Revoke Access
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [selectedApp, setSelectedApp] = useState('global');
  
  const [systemName, setSystemName] = useState('ATLAS | Enterprise Anomaly Monitoring System');
  const [timezone, setTimezone] = useState('utc');
  const [retention, setRetention] = useState(90);

  const [criticalThreshold, setCriticalThreshold] = useState([mockAppSettings.global.criticalThreshold]);
  const [warningThreshold, setWarningThreshold] = useState([mockAppSettings.global.warningThreshold]);
  const [softLimit, setSoftLimit] = useState([mockAppSettings.global.softLimit]);
  const [hardBlock, setHardBlock] = useState([mockAppSettings.global.hardBlock]);
  const [accumulationWindow, setAccumulationWindow] = useState([mockAppSettings.global.accumulationWindow]);

  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [trainingWindow, setTrainingWindow] = useState(30);
  const [modelSensitivity, setModelSensitivity] = useState('balanced');
  
  const [quarantinedEndpoints, setQuarantinedEndpoints] = useState<QuarantinedEndpoint[]>(mockQuarantinedEndpoints);

  useEffect(() => {
    const newSettings = mockAppSettings[selectedApp as keyof typeof mockAppSettings] || mockAppSettings.global;
    setCriticalThreshold([newSettings.criticalThreshold]);
    setWarningThreshold([newSettings.warningThreshold]);
    setSoftLimit([newSettings.softLimit]);
    setHardBlock([newSettings.hardBlock]);
    setAccumulationWindow([newSettings.accumulationWindow]);
  }, [selectedApp]);

  const selectedAppName = selectedApp === 'global' ? 'Global Defaults' : navItems.find(item => item.id === selectedApp)?.label || 'Global';


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
               <CardDescription>Tuning for: <span className="font-semibold text-primary">{selectedAppName}</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label>Critical Anomaly Score for {selectedAppName} (Score {criticalThreshold[0]}-100)</Label>
                <Slider value={criticalThreshold} onValueChange={setCriticalThreshold} max={100} min={80} step={1} className="[&>span]:bg-red-500" />
              </div>
               <div className="space-y-4">
                <Label>Warning Anomaly Score for {selectedAppName} (Score {warningThreshold[0]}-79)</Label>
                <Slider value={warningThreshold} onValueChange={setWarningThreshold} max={79} min={50} step={1} className="[&>span]:bg-orange-500" />
              </div>
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-lg font-semibold">Notification Routing</h4>
                 <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                        <h5 className="font-semibold">Critical Alerts Route</h5>
                        <Select defaultValue="slack">
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="slack">Slack Channel (#secops-critical)</SelectItem>
                                <SelectItem value="email">Email (soc-team@atlas.com)</SelectItem>
                                <SelectItem value="pagerduty">PagerDuty (Primary Escalation)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Switch defaultChecked />
                </div>
                 <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                        <h5 className="font-semibold">Warning Alerts Route</h5>
                        <Select defaultValue="email">
                            <SelectTrigger className="w-[280px] mt-2">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="slack">Slack Channel (#secops-warnings)</SelectItem>
                                <SelectItem value="email">Email (soc-team@atlas.com)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                     <h5 className="font-semibold">PagerDuty Integration</h5>
                     <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">Configure PagerDuty API</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'containment':
        return (
            <>
            <Card>
                <CardHeader>
                    <CardTitle>Progressive Containment Rules</CardTitle>
                    <CardDescription>Configure automated response thresholds for <span className="font-semibold text-primary">{selectedAppName}</span>.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="space-y-4">
                        <Label>Soft Rate Limit Threshold for {selectedAppName} ({softLimit[0]} Calls/min)</Label>
                        <Slider value={softLimit} onValueChange={setSoftLimit} max={selectedApp === 'flipkart' ? 5000 : 1000} min={100} step={10} className="[&>span]:bg-blue-500" />
                    </div>
                     <div className="space-y-4">
                        <Label>Hard Block Threshold for {selectedAppName} ({hardBlock[0]} Calls/min)</Label>
                        <Slider value={hardBlock} onValueChange={setHardBlock} max={selectedApp === 'flipkart' ? 10000 : 5000} min={selectedApp === 'genai' ? 50: 500} step={50} className="[&>span]:bg-red-500" />
                    </div>
                    <div className="space-y-4">
                        <Label>Anomaly Accumulation Window ({accumulationWindow[0]} Days)</Label>
                        <Slider value={accumulationWindow} onValueChange={setAccumulationWindow} max={30} min={1} step={1} className="[&>span]:bg-orange-500" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Endpoint Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-red-900/50">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <Label htmlFor="auto-quarantine" className="font-medium text-red-400">Auto-Quarantine Laptops attempting lateral database movement</Label>
                        </div>
                        <Switch id="auto-quarantine" checked={autoQuarantine} onCheckedChange={setAutoQuarantine} />
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Currently Quarantined Laptops</h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hostname</TableHead>
                                    <TableHead>Quarantined At</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quarantinedEndpoints.map(endpoint => (
                                    <TableRow key={endpoint.id}>
                                        <TableCell className="font-mono">{endpoint.hostname}</TableCell>
                                        <TableCell>{endpoint.quarantinedAt}</TableCell>
                                        <TableCell>{endpoint.reason}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="secondary" size="sm">Lift Quarantine</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {quarantinedEndpoints.length === 0 && (
                                     <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No endpoints are currently quarantined.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            </>
        );
      case 'ml-baselines':
        return (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle>Active Baseline Model: {selectedAppName}</CardTitle>
                        <CardDescription>Model trained on last {trainingWindow} days of traffic. Last updated: Today, 08:00 AM.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Force Retrain Model
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Machine Learning Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="training-window">Training Data Window (Days)</Label>
                            <Input id="training-window" type="number" value={trainingWindow} onChange={e => setTrainingWindow(Number(e.target.value))} />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <Label>Model Sensitivity</Label>
                                <span>{modelSensitivity.charAt(0).toUpperCase() + modelSensitivity.slice(1)}</span>
                            </div>
                             <Slider 
                                defaultValue={[50]} 
                                onValueChange={(value) => {
                                    if (value[0] < 33) setModelSensitivity('conservative');
                                    else if (value[0] < 66) setModelSensitivity('balanced');
                                    else setModelSensitivity('aggressive');
                                }}
                                max={100} 
                                step={1} 
                                className="[&>span]:bg-purple-500" 
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Conservative</span>
                                <span>Balanced</span>
                                <span>Aggressive</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-slate-800 rounded-lg">
                            <Label htmlFor="auto-update-baselines" className="font-medium">Auto-Update Baselines Weekly</Label>
                            <Switch id="auto-update-baselines" defaultChecked={true} />
                        </div>
                    </CardContent>
                </Card>
            </>
        );
      case 'user-access':
        return <UserAccessTab />;
      default:
        return null;
    }
  };

  const showAppContext = activeTab === 'alert-tuning' || activeTab === 'containment' || activeTab === 'ml-baselines';

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
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

        <main className="space-y-6">
            {showAppContext && (
                <div className="w-full max-w-sm">
                    <Label htmlFor="app-context" className="text-xs text-muted-foreground">Application Context</Label>
                    <Select value={selectedApp} onValueChange={setSelectedApp}>
                        <SelectTrigger id="app-context" className="mt-1">
                            <SelectValue placeholder="Select App to Configure..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="global">Global Defaults</SelectItem>
                            <SelectItem value="naukri">Naukri (Prod)</SelectItem>
                            <SelectItem value="genai">GenAI Service</SelectItem>
                            <SelectItem value="flipkart">Flipkart Internal</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

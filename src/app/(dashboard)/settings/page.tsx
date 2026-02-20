"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamUser } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

function GeneralSettings() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Update your system's general information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="system-name">System Name</Label>
                    <Input id="system-name" defaultValue="ATLAS Production" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                        <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="utc">UTC</SelectItem>
                            <SelectItem value="est">EST</SelectItem>
                            <SelectItem value="pst">PST</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="retention">Data Retention Period</Label>
                     <Select defaultValue="90">
                        <SelectTrigger id="retention"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                            <SelectItem value="180">180 Days</SelectItem>
                            <SelectItem value="365">365 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}

function AlertTuning() {
    return (
        <Card>
             <CardHeader>
                <CardTitle>Alert Tuning</CardTitle>
                <CardDescription>Adjust thresholds for alert severity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                 <div className="space-y-3">
                    <Label>Critical Threshold</Label>
                    <div className="flex items-center gap-4">
                       <Slider defaultValue={[80]} max={100} step={1} />
                       <span className="font-mono text-lg w-16 text-right">80%</span>
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label>Warning Threshold</Label>
                     <div className="flex items-center gap-4">
                       <Slider defaultValue={[60]} max={100} step={1} />
                       <span className="font-mono text-lg w-16 text-right">60%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ProgressiveContainment() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Progressive Containment Rules</CardTitle>
                <CardDescription>Configure automated responses to anomalies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-3">
                    <Label>Soft Rate Limit Threshold (Calls/min)</Label>
                    <div className="flex items-center gap-4">
                       <Slider defaultValue={[100]} max={1000} step={10} />
                       <span className="font-mono text-lg w-24 text-right">100</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <Label>Hard Block Threshold (Calls/min)</Label>
                    <div className="flex items-center gap-4">
                       <Slider defaultValue={[500]} max={2000} step={10} />
                       <span className="font-mono text-lg w-24 text-right">500</span>
                    </div>
                </div>
                 <div className="space-y-3">
                    <Label>Anomaly Accumulation Window (Days)</Label>
                    <div className="flex items-center gap-4">
                       <Slider defaultValue={[7]} max={30} step={1} />
                       <span className="font-mono text-lg w-24 text-right">7</span>
                    </div>
                </div>
                <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between"><Label>Auto-dismiss low severity alerts</Label><Switch /></div>
                    <div className="flex items-center justify-between"><Label>Enable ML Baseline for new services</Label><Switch defaultChecked /></div>
                    <div className="flex items-center justify-between"><Label>Auto-quarantine on critical malware detection</Label><Switch defaultChecked /></div>
                </div>
            </CardContent>
        </Card>
    );
}

function MlBaselines() {
    return (
        <Card>
             <CardHeader>
                <CardTitle>ML Baselines</CardTitle>
                <CardDescription>Manage machine learning models for anomaly detection.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center text-muted-foreground py-12">
                    <p>ML Baseline management is not yet implemented.</p>
                </div>
            </CardContent>
        </Card>
    )
}

function UserAccess() {
    const [users, setUsers] = useState<TeamUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // TODO: Replace with your actual API endpoint to fetch users
            // try {
            //     const response = await fetch('/api/users');
            //     const result = await response.json();
            //     setUsers(result);
            // } catch (error) {
            //     console.error("Failed to fetch users:", error);
            //     setUsers([]);
            // } finally {
            //     setIsLoading(false);
            // }
            setIsLoading(false); // Remove this when fetch is implemented
        };
        fetchData();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Access</CardTitle>
                <CardDescription>Manage user permissions and access.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({length: 3}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={3}><Skeleton className="h-10 w-full" /></TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && users.map(u => (
                            <TableRow key={u.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={u.avatar} alt={u.name} data-ai-hint="person face" />
                                            <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{u.name}</p>
                                            <p className="text-sm text-muted-foreground">{u.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{u.role}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm">Edit Permissions</Button>
                                    <Button variant="destructive" size="sm">Revoke Access</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!isLoading && users.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">No users found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Tabs defaultValue="general" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex-col h-auto justify-start p-2 gap-1 items-stretch md:w-48">
          <TabsTrigger value="general" className="justify-start">General</TabsTrigger>
          <TabsTrigger value="alerts" className="justify-start">Alert Tuning</TabsTrigger>
          <TabsTrigger value="containment" className="justify-start">Progressive Containment</TabsTrigger>
          <TabsTrigger value="ml" className="justify-start">ML Baselines</TabsTrigger>
          <TabsTrigger value="users" className="justify-start">User Access</TabsTrigger>
        </TabsList>
        <div className="flex-1">
             <TabsContent value="general"><GeneralSettings /></TabsContent>
             <TabsContent value="alerts"><AlertTuning /></TabsContent>
             <TabsContent value="containment"><ProgressiveContainment /></TabsContent>
             <TabsContent value="ml"><MlBaselines /></TabsContent>
             <TabsContent value="users"><UserAccess /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

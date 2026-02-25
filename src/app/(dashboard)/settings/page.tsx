'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Clock, Lock, Mail, Shield } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';

const recentActivity = [
  {
    dateTime: 'May 22, 2024, 9:01 AM',
    ip: '203.0.113.54',
    location: 'New York, USA',
    status: 'Success - Chrome on Windows 11',
  },
  {
    dateTime: 'May 21, 2024, 2:30 PM',
    ip: '198.51.100.2',
    location: 'London, UK',
    status: 'Success - Safari on macOS',
  },
  {
    dateTime: 'May 20, 2024, 11:15 AM',
    ip: '203.0.113.55',
    location: 'New York, USA',
    status: 'Failed - Invalid Password',
  },
];


export default function SettingsPage() {
    const { toast } = useToast();

    const handleSaveChanges = () => {
        toast({
            title: 'Settings Saved',
            description: 'Your personal information has been updated.',
        });
    };

     const handleUpdatePassword = () => {
        toast({
            title: 'Security Updated',
            description: 'Your password has been successfully changed.',
        });
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-slate-800">
                    <AvatarImage src={placeholderData.placeholderImages[0].imageUrl} alt="Jane Doe" data-ai-hint="person face" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">Jane Doe</h1>
                    <p className="text-muted-foreground">Senior SOC Analyst</p>
                    <p className="text-sm text-muted-foreground">jane.doe@atlas-sec.com</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                    {/* Personal Information Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" defaultValue="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" defaultValue="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" defaultValue="jane.doe@atlas-sec.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                            </div>
                            <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                        </CardContent>
                    </Card>

                    {/* Account Preferences Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Preferences</CardTitle>
                            <CardDescription>Set your notification and timezone settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select defaultValue="utc">
                                    <SelectTrigger id="timezone">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4" />Daily Threat Summaries</h4>
                                    <p className="text-xs text-muted-foreground">Receive a summary of system activity every 24 hours.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <h4 className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4" />Critical Alert Notifications</h4>
                                    <p className="text-xs text-muted-foreground">Get notified immediately for critical-severity incidents.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-8">
                    {/* Security & Authentication Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security & Authentication</CardTitle>
                            <CardDescription>Manage your password and two-factor authentication.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4 p-4 border border-slate-800 rounded-md">
                                <h4 className="font-semibold flex items-center gap-2"><Lock className="h-4 w-4" />Change Password</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input id="current-password" type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input id="new-password" type="password" placeholder="••••••••" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                                </div>
                                <Button onClick={handleUpdatePassword} variant="secondary">Update Password</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-slate-800 rounded-md">
                                <div>
                                    <h4 className="font-semibold">Two-Factor Authentication (2FA)</h4>
                                    <p className="text-sm text-muted-foreground">Recommended for all SOC environments.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                     {/* Recent Account Activity Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Recent Account Activity</CardTitle>
                            <CardDescription>A log of recent sign-in attempts to your account.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date/Time</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentActivity.map((activity, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-xs">{activity.dateTime}</TableCell>
                                            <TableCell className="font-mono text-xs">{activity.ip}</TableCell>
                                            <TableCell className="text-xs">{activity.location}</TableCell>
                                            <TableCell className="text-xs">{activity.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

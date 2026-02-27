'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Clock, Lock, Mail, Shield, LoaderCircle } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';
import { apiClient, ApiError } from '@/lib/api-client';
import type { UserProfile, AccountActivity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';


export default function ProfilePage() {
    const { toast } = useToast();
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activity, setActivity] = useState<AccountActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { control, handleSubmit, reset, setValue } = useForm<UserProfile>();
    const { control: pwControl, handleSubmit: handlePwSubmit, reset: resetPw } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [profileData, activityData] = await Promise.all([
                    apiClient.getProfile(),
                    apiClient.getProfileActivity(),
                ]);
                const userProfile = {
                    ...profileData,
                    first_name: profileData.full_name.split(' ')[0],
                    last_name: profileData.full_name.split(' ').slice(1).join(' '),
                }
                setProfile(userProfile);
                setActivity(activityData);
                reset(userProfile);
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({
                    variant: "destructive",
                    title: 'Failed to load profile data',
                    description: errorMessage,
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [reset, toast]);


    const handleSaveChanges = async (data: UserProfile) => {
        try {
            await apiClient.updateProfile({
                full_name: `${data.first_name} ${data.last_name}`,
                email: data.email,
                phone_number: data.phone_number,
                timezone: data.timezone,
                enable_2fa: data.enable_2fa
            });
            toast({
                title: 'Settings Saved',
                description: 'Your personal information has been updated.',
            });
        } catch (error: any) {
            const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: errorMessage,
            });
        }
    };

     const handleUpdatePassword = async (data: any) => {
        if (data.new_password !== data.confirm_password) {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: "New passwords do not match.",
            });
            return;
        }
        try {
            await apiClient.updatePassword({
                current_password: data.current_password,
                new_password: data.new_password
            });
            toast({
                title: 'Security Updated',
                description: 'Your password has been successfully changed.',
            });
            resetPw();
        } catch (error: any) {
             const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: errorMessage,
            });
        }
    };

    if (isLoading) {
        return (
             <div className="space-y-8">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <Card><CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card>
                    <Card><CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
                    <Card><CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
                    <Card><CardHeader><CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-slate-800">
                    <AvatarImage src={placeholderData.placeholderImages[0].imageUrl} alt={profile?.full_name} data-ai-hint="person face" />
                    <AvatarFallback>{profile?.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
                    <p className="text-muted-foreground">{authUser?.role}</p>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(handleSaveChanges)} className="space-y-4">
                               <div className="grid grid-cols-2 gap-4">
                                    <Controller name="first_name" control={control} render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="first-name">First Name</Label>
                                            <Input id="first-name" {...field} />
                                        </div>
                                    )} />
                                    <Controller name="last_name" control={control} render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="last-name">Last Name</Label>
                                            <Input id="last-name" {...field} />
                                        </div>
                                    )} />
                                </div>
                                <Controller name="email" control={control} render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" {...field} />
                                    </div>
                                )} />
                                <Controller name="phone_number" control={control} render={({ field }) => (
                                     <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" {...field} />
                                    </div>
                                )} />
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Preferences</CardTitle>
                            <CardDescription>Set your notification and timezone settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <Controller name="timezone" control={control} render={({ field }) => (
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id="timezone"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                                            <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                                            <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )} />
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Security & Authentication</CardTitle>
                            <CardDescription>Manage your password and two-factor authentication.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handlePwSubmit(handleUpdatePassword)} className="space-y-4 p-4 border border-slate-800 rounded-md">
                                <h4 className="font-semibold flex items-center gap-2"><Lock className="h-4 w-4" />Change Password</h4>
                                <Controller name="current_password" control={pwControl} render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" placeholder="••••••••" {...field} />
                                    </div>
                                )} />
                                <Controller name="new_password" control={pwControl} render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" placeholder="••••••••" {...field} />
                                    </div>
                                )} />
                                 <Controller name="confirm_password" control={pwControl} render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" placeholder="••••••••" {...field} />
                                    </div>
                                )} />
                                <Button type="submit" variant="secondary">Update Password</Button>
                            </form>
                            <Controller
                                name="enable_2fa"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex items-center justify-between p-4 border border-slate-800 rounded-md">
                                        <div>
                                            <h4 className="font-semibold">Two-Factor Authentication (2FA)</h4>
                                            <p className="text-sm text-muted-foreground">Recommended for all SOC environments.</p>
                                        </div>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )}
                            />
                        </CardContent>
                    </Card>

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
                                    {activity.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-xs">{new Date(item.dateTime).toLocaleString()}</TableCell>
                                            <TableCell className="font-mono text-xs">{item.ip}</TableCell>
                                            <TableCell className="text-xs">{item.location}</TableCell>
                                            <TableCell className="text-xs">{item.status}</TableCell>
                                        </TableRow>
                                    ))}
                                    {activity.length === 0 && (
                                        <TableRow><TableCell colSpan={4} className="text-center">No recent activity.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

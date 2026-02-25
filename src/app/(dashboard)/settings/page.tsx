'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { TeamUser } from '@/lib/types';
import { useEnvironment } from '@/context/EnvironmentContext';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function InviteUserDialog() {
    const { toast } = useToast();

    const handleInvite = () => {
        toast({
            title: "Invitation Sent",
            description: "The user has been invited to join the team.",
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Invite New User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogDescription>
                        Enter the email address of the user you want to invite. They will receive an email with instructions to join.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" type="email" placeholder="name@example.com" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleInvite}>Send Invitation</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export default function SettingsPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<TeamUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { environment } = useEnvironment();

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/users?env=${environment}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
                    throw new Error(errorData.details || errorData.message || `API call failed with status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error: any) {
                 console.error("Failed to fetch users:", error);
                 toast({
                    variant: "destructive",
                    title: "Failed to Load Team Data",
                    description: error.message,
                });
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, [environment, toast]);


    const handleRoleChange = (userId: number, newRole: string) => {
        // Mock update
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as "Admin" | "Analyst" } : u));
        toast({
            title: 'User Role Updated',
            description: `The user's role has been changed to ${newRole}.`,
        });
    };

    const handleRemoveUser = (userId: number) => {
        // Mock removal
        setUsers(users.filter(u => u.id !== userId));
        toast({
            title: 'User Removed',
            description: 'The user has been removed from the team.',
            variant: 'destructive'
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Team Management</h1>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage your team members and their roles.</CardDescription>
                    </div>
                    <InviteUserDialog />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="w-[150px]">Role</TableHead>
                                <TableHead className="text-right w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {isLoading && Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="space-y-1">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-3 w-32" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-8 w-full" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                            {!isLoading && users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            defaultValue={user.role}
                                            onValueChange={(value) => handleRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                                <SelectItem value="Analyst">Analyst</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {!isLoading && users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                        No users found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

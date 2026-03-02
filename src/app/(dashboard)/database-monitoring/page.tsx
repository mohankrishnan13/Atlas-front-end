"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldX, UserX, ServerCrash } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"

const chartConfig = {
  SELECT: { label: "SELECT", color: "hsl(var(--chart-1))" },
  INSERT: { label: "INSERT", color: "hsl(var(--chart-2))" },
  UPDATE: { label: "UPDATE", color: "hsl(var(--chart-3))" },
  DELETE: { label: "DELETE", color: "hsl(var(--chart-5))" },
};

const dbOperationsData = [
  { table: 'users', SELECT: 45000, INSERT: 1200, UPDATE: 800, DELETE: 50 },
  { table: 'products', SELECT: 85000, INSERT: 200, UPDATE: 500, DELETE: 10 },
  { table: 'orders', SELECT: 75000, INSERT: 15000, UPDATE: 12000, DELETE: 2500 },
  { table: 'sessions', SELECT: 22000, INSERT: 22000, UPDATE: 22000, DELETE: 22000 },
  { table: 'audit_logs', SELECT: 5000, INSERT: 89000, UPDATE: 0, DELETE: 0 },
];

const suspiciousActivityData = [
    { id: 1, app: 'GenAI Service', user: 'prod_read_only_role', type: 'UPDATE', table: 'user_permissions', reason: 'Read-only role attempted privilege escalation.', action: 'Revoke Role Access' },
    { id: 2, app: 'Naukri Portal', user: '[LAPTOP-DEV-09]', type: 'SELECT *', table: 'candidates', reason: 'Excessive data export (300k rows) from sensitive table.', action: 'Lock User Account' },
    { id: 3, app: 'Flipkart DB', user: 'automated_script_03', type: 'DELETE', table: 'product_reviews', reason: 'Anomalous bulk deletion of 50k+ records.', action: 'Isolate DB Instance' },
];

function DbOperationsChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>DB Operations by Target Table</CardTitle>
                <CardDescription>Operations per minute, grouped by table.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dbOperationsData} layout="vertical" stackOffset="expand">
                             <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                            <XAxis type="number" tickFormatter={(value) => `${value * 100}%`} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis type="category" dataKey="table" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={100} />
                            <RechartsTooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: 'hsl(var(--accent))' }} />
                            <Legend />
                            <Bar dataKey="SELECT" stackId="a" fill="hsl(var(--chart-1))" />
                            <Bar dataKey="INSERT" stackId="a" fill="hsl(var(--chart-2))" />
                            <Bar dataKey="UPDATE" stackId="a" fill="hsl(var(--chart-3))" />
                            <Bar dataKey="DELETE" stackId="a" fill="hsl(var(--chart-5))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}


export default function DatabaseMonitoringPage() {
    
    const getActionIcon = (action: string) => {
        if (action.toLowerCase().includes('lock')) return <UserX />;
        if (action.toLowerCase().includes('isolate')) return <ServerCrash />;
        if (action.toLowerCase().includes('revoke')) return <ShieldX />;
        return <ShieldX />;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Database Monitoring</h1>
            
            <DbOperationsChart />

            <Card>
                <CardHeader>
                    <CardTitle>Suspicious DB Activity & Mitigation</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Originating Application</TableHead>
                                <TableHead>User / Endpoint</TableHead>
                                <TableHead>Query Type</TableHead>
                                <TableHead>Target Table</TableHead>
                                <TableHead>Reason for Flag</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {suspiciousActivityData.map((activity) => (
                                <TableRow key={activity.id}>
                                    <TableCell><Badge variant="outline">{activity.app}</Badge></TableCell>
                                    <TableCell className="font-mono">{activity.user}</TableCell>
                                    <TableCell><Badge variant="secondary">{activity.type}</Badge></TableCell>
                                    <TableCell className="font-mono">{activity.table}</TableCell>
                                    <TableCell className="text-yellow-400 max-w-xs">{activity.reason}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="destructive" size="sm">
                                            {getActionIcon(activity.action)}
                                            {activity.action}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {suspiciousActivityData.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">No suspicious activity detected.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

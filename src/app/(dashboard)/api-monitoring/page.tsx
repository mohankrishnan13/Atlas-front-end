"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, ShieldX, KeySquare, Zap } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, Legend } from "recharts"
import { cn } from "@/lib/utils";

// WIDGET 1: API Overuse Chart
const apiOveruseData = [
  { app: 'GenAI', current: 450, limit: 300 },
  { app: 'Naukri', current: 1800, limit: 5000 },
  { app: 'Flipkart', current: 800, limit: 2000 },
  { app: 'Payments', current: 250, limit: 1000 },
  { app: 'Auth', current: 1200, limit: 10000 },
];

const ApiOveruseChart = () => (
    <Card>
        <CardHeader>
            <CardTitle>API Overuse by Target Application</CardTitle>
            <CardDescription>Current requests per minute vs. hard limits.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={apiOveruseData} margin={{ left: -20, top: 10, right: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="app" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                        <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: 'hsl(var(--accent))' }}/>
                        <Legend />
                        <Bar dataKey="limit" name="RPM Limit" fill="hsl(var(--secondary))" radius={4} />
                        <Bar dataKey="current" name="Current RPM" radius={4}>
                            {apiOveruseData.map((entry) => (
                                <Cell key={entry.app} fill={entry.current > entry.limit ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);

// WIDGET 2: Most Abused Endpoints Chart
const mostAbusedEndpointsData = [
    { endpoint: '[GenAI] /v1/chat/completions', violations: 1205 },
    { endpoint: '[Auth] /oauth/token', violations: 842 },
    { endpoint: '[Naukri] /v2/users/search', violations: 312 },
    { endpoint: '[Payments] /v1/charges', violations: 156 },
    { endpoint: '[Flipkart] /internal/inventory/sync', violations: 98 },
];

const MostAbusedEndpointsChart = () => (
    <Card>
        <CardHeader>
            <CardTitle>Most Abused API Endpoints</CardTitle>
            <CardDescription>Endpoints with the most rate limit violations or blocked calls.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mostAbusedEndpointsData} layout="vertical" margin={{ left: 220, top: 10, right: 10 }}>
                        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="endpoint" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} width={220} />
                        <RechartsTooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent))' }} />
                        <Bar dataKey="violations" layout="vertical" radius={4}>
                            {mostAbusedEndpointsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.violations > 1000 ? 'hsl(var(--destructive))' : entry.violations > 500 ? 'hsl(var(--chart-2))' : 'hsl(var(--primary))'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
);


// WIDGET 3: Top Consumers Table
const topConsumersData = [
    { id: 1, consumer: 'api_bot_prod', targetApp: 'GenAI Service', calls: '27,010', cost: 3250.00, isOver: true },
    { id: 2, consumer: 'External IP (Public): 185.220.101.45', targetApp: 'Naukri Portal', calls: '120,450', cost: 2132.50, isOver: false },
    { id: 3, consumer: 'internal_dashboard_svc', targetApp: 'Flipkart Internal', calls: '88,920', cost: 1890.00, isOver: false },
    { id: 4, consumer: 'partner_api_acme', targetApp: 'Payments Gateway', calls: '30,100', cost: 1105.20, isOver: false },
];

const TopConsumersTable = () => (
    <Card>
        <CardHeader>
            <CardTitle>Top Consumers by Target App</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Consumer (User/IP)</TableHead>
                        <TableHead>Target App</TableHead>
                        <TableHead>Calls (24h)</TableHead>
                        <TableHead>Cost (24h)</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topConsumersData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono">{row.consumer}</TableCell>
                            <TableCell><Badge variant="outline">{row.targetApp}</Badge></TableCell>
                            <TableCell>{row.calls}</TableCell>
                            <TableCell className={cn(row.isOver && "text-red-400 font-bold")}>${row.cost.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                {row.isOver ? 
                                <Button variant="outline" className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"><Zap />Throttle Limits</Button>
                                : <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"><KeySquare />Revoke Key</Button>}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

// WIDGET 4: API Mitigation Table
const apiMitigationData = [
    { id: 1, target: 'GenAI Service', offender: 'External IP (Public): 185.220.101.45', violation: 'Rate Limit Exceeded (1,250 req/m)', action: 'Enforce Hard Block' },
    { id: 2, target: 'Auth Service', offender: 'api_bot_suspicious', violation: 'Brute Force Login (842 failed attempts)', action: 'Lock Account' },
    { id: 3, target: 'Payments Gateway', offender: 'External IP (Public): 203.0.113.8', violation: 'Invalid API Key (300+ attempts)', action: 'Block IP' },
];

const ApiMitigationTable = () => (
    <Card>
        <CardHeader>
            <CardTitle>Active API Mitigation Feed</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Target App</TableHead>
                        <TableHead>Offending IP/User</TableHead>
                        <TableHead>Violation Type</TableHead>
                        <TableHead className="text-right">Mitigation Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {apiMitigationData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell><Badge variant="outline">{row.target}</Badge></TableCell>
                            <TableCell className="font-mono">{row.offender}</TableCell>
                            <TableCell className="text-yellow-400">{row.violation}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                                    {row.action.includes('Block') && <Ban />}
                                    {row.action.includes('Lock') && <ShieldX />}
                                    {row.action}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


export default function ApiMonitoringPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">API Monitoring</h1>
            
            <div className="grid gap-4 md:grid-cols-2">
                <ApiOveruseChart />
                <MostAbusedEndpointsChart />
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
                 <TopConsumersTable />
                 <ApiMitigationTable />
            </div>
        </div>
    );
}

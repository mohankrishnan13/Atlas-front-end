"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Bot, FileText, Download, Mail } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const scheduledReportsData = [
    { id: '1', title: 'GenAI Service API Abuse Report', schedule: 'Weekly breakdown of rate limits and cost spikes.', isActive: true },
    { id: '2', title: 'Naukri DB Access Audit (SOC2)', schedule: 'Daily log of all privileged database queries.', isActive: true },
    { id: '3', title: 'Global Endpoint Health', schedule: 'Weekly malware and policy violation summary for all laptops.', isActive: false },
];

const recentDownloadsData = [
    { id: '1', name: 'GenAI_Cost_Audit_Q1.pdf', target: 'GenAI Service', generated: 'Today', size: '2.1 MB', url: '#' },
    { id: '2', name: 'LAPTOP-HR-02_Forensics.csv', target: 'Endpoint', generated: 'Yesterday', size: '15.6 MB', url: '#' },
    { id: '3', name: 'SOC2_Naukri_Access_Log.pdf', target: 'Naukri DB', generated: '2 days ago', size: '850 KB', url: '#' },
];

export default function ReportsPage() {
    const { toast } = useToast();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });

    const handleGenerate = () => {
        toast({
            title: "Report Generation Started",
            description: "Your report is being generated and will appear in recent downloads shortly.",
        });
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Reports</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Generate New Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="date-range">Date Range</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                      )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                    date.to ? (
                                        <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                    ) : (
                                    <span>Pick a date range</span>
                                    )}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="data-source">Data Source</Label>
                            <Select>
                                <SelectTrigger id="data-source"><SelectValue placeholder="Select source" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    <SelectItem value="naukri">Naukri (Prod)</SelectItem>
                                    <SelectItem value="genai">GenAI Service</SelectItem>
                                    <SelectItem value="flipkart">Flipkart Internal</SelectItem>
                                    <SelectItem value="endpoints">Employee Endpoints</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="report-template">Compliance / Report Template</Label>
                            <Select>
                                <SelectTrigger id="report-template"><SelectValue placeholder="Select template" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Security Summary</SelectItem>
                                    <SelectItem value="soc2">SOC2 Audit Log</SelectItem>
                                    <SelectItem value="iso27001">ISO 27001 Access Report</SelectItem>
                                    <SelectItem value="cost">API Cost & Usage Breakdown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ai-report">Ask AI to generate a report...</Label>
                         <div className="relative">
                            <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="ai-report" placeholder="e.g., 'a summary of all critical incidents this week related to the payment-service'" className="pl-10" />
                        </div>
                    </div>
                     <div className="flex justify-end gap-4 pt-4 border-t border-slate-800 mt-6">
                        <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                </SelectContent>
                            </Select>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGenerate}>Generate Report</Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {scheduledReportsData.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{report.title}</h4>
                                    <p className="text-sm text-muted-foreground">{report.schedule}</p>
                                </div>
                                <Switch defaultChecked={report.isActive} />
                            </div>
                        ))}
                         {scheduledReportsData.length === 0 && (
                            <p className="text-center text-muted-foreground">No scheduled reports.</p>
                         )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Downloads</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Generated</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentDownloadsData.map(download => (
                                    <TableRow key={download.id}>
                                        <TableCell className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground"/>{download.name}</TableCell>
                                        <TableCell>{download.target}</TableCell>
                                        <TableCell>{download.generated}</TableCell>
                                        <TableCell>{download.size}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" asChild><a href={download.url}><Download className="h-5 w-5" /></a></Button>
                                            <Button variant="ghost" size="icon"><Mail className="h-5 w-5" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {recentDownloadsData.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-muted-foreground">No recent downloads.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

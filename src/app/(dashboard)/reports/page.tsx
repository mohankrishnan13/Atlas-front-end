"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Bot, FileText, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient, ApiError } from "@/lib/api-client";
import { ScheduledReport, RecentDownload } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
    const { toast } = useToast();
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    });

    const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
    const [recentDownloads, setRecentDownloads] = useState<RecentDownload[]>([]);
    const [isScheduledLoading, setIsScheduledLoading] = useState(true);
    const [isDownloadsLoading, setIsDownloadsLoading] = useState(true);

    useEffect(() => {
        const fetchScheduled = async () => {
            setIsScheduledLoading(true);
            try {
                const data = await apiClient.getScheduledReports();
                setScheduledReports(data);
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({ variant: 'destructive', title: 'Failed to load scheduled reports', description: errorMessage });
            } finally {
                setIsScheduledLoading(false);
            }
        };

        const fetchDownloads = async () => {
            setIsDownloadsLoading(true);
            try {
                const data = await apiClient.getRecentDownloads();
                setRecentDownloads(data);
            } catch (error: any) {
                const errorMessage = error instanceof ApiError ? error.message : "An unexpected error occurred.";
                toast({ variant: 'destructive', title: 'Failed to load recent downloads', description: errorMessage });
            } finally {
                setIsDownloadsLoading(false);
            }
        };

        fetchScheduled();
        fetchDownloads();
    }, [toast]);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                    <SelectItem value="incidents">Incidents</SelectItem>
                                    <SelectItem value="api">API Monitoring</SelectItem>
                                    <SelectItem value="network">Network Traffic</SelectItem>
                                    <SelectItem value="endpoints">Endpoint Security</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="export-format">Export Format</Label>
                            <Select>
                                <SelectTrigger id="export-format"><SelectValue placeholder="Select format" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="flex items-end">
                            <Button className="w-full" onClick={handleGenerate}>Generate</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ai-report">Ask AI to generate a report...</Label>
                         <div className="relative">
                            <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input id="ai-report" placeholder="e.g., 'a summary of all critical incidents this week related to the payment-service'" className="pl-10" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>Scheduled Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isScheduledLoading && Array.from({length: 3}).map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <Skeleton className="h-6 w-11 rounded-full" />
                            </div>
                        ))}
                        {!isScheduledLoading && scheduledReports.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <h4 className="font-semibold">{report.title}</h4>
                                    <p className="text-sm text-muted-foreground">{report.schedule}</p>
                                </div>
                                <Switch defaultChecked={report.isActive} />
                            </div>
                        ))}
                         {!isScheduledLoading && scheduledReports.length === 0 && (
                            <p className="text-center text-muted-foreground">No scheduled reports.</p>
                         )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Downloads</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {isDownloadsLoading && Array.from({length: 3}).map((_, i) => (
                             <div key={i} className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-3">
                                   <Skeleton className="h-5 w-5" />
                                   <div className="space-y-2">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-4 w-24" />
                                   </div>
                                </div>
                                <Skeleton className="h-8 w-8" />
                            </div>
                        ))}
                         {!isDownloadsLoading && recentDownloads.map(download => (
                            <div key={download.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
                                <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground"/>
                                <div>
                                        <h4 className="font-semibold">{download.name}</h4>
                                        <p className="text-sm text-muted-foreground">Generated {download.generated}</p>
                                </div>
                                </div>
                                <Button variant="ghost" size="icon" asChild><a href={download.url}><Download className="h-5 w-5" /></a></Button>
                            </div>
                         ))}
                         {!isDownloadsLoading && recentDownloads.length === 0 && (
                            <p className="text-center text-muted-foreground">No recent downloads.</p>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

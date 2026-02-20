import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gauge, Users, XCircle, ArrowRight } from "lucide-react";
import { networkTrafficData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function StatCard({ title, value, icon: Icon }: { title: string, value: string | number, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</div>
            </CardContent>
        </Card>
    )
}

function BandwidthGauge() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bandwidth</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-2">{networkTrafficData.bandwidth}%</div>
                <Progress value={networkTrafficData.bandwidth} />
            </CardContent>
        </Card>
    )
}

function TrafficFlowMap() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>App-Aware Traffic Flow</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-around bg-card p-8 rounded-lg">
                <div className="text-center space-y-2">
                    <div className="font-bold text-muted-foreground">External IPs</div>
                    <div className="p-4 bg-muted rounded-lg">203.0.113.54</div>
                    <div className="p-4 bg-muted rounded-lg">198.51.100.2</div>
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground mx-4" />
                <div className="text-center space-y-2">
                    <div className="font-bold text-muted-foreground">Firewall</div>
                    <div className="p-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center">FW-01</div>
                </div>
                <ArrowRight className="h-8 w-8 text-muted-foreground mx-4" />
                <div className="space-y-4">
                    <div className="font-bold text-muted-foreground text-center">Internal App Nodes</div>
                    <div className="p-4 bg-secondary rounded-lg">10.0.1.12 [Payment-Service]</div>
                    <div className="p-4 bg-secondary rounded-lg">10.0.2.34 [User-DB]</div>
                    <div className="p-4 bg-secondary rounded-lg">10.0.5.88 [Data-Pipeline]</div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function NetworkTrafficPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Network Traffic</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <BandwidthGauge />
                <StatCard title="Active Connections" value={networkTrafficData.activeConnections} icon={Users} />
                <StatCard title="Dropped Packets" value={networkTrafficData.droppedPackets} icon={XCircle} />
            </div>

            <TrafficFlowMap />

            <Card>
                <CardHeader>
                    <CardTitle>Active Network Anomalies</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Source IP</TableHead>
                                <TableHead>Destination IP</TableHead>
                                <TableHead>Target Application</TableHead>
                                <TableHead>Port</TableHead>
                                <TableHead>Anomaly Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {networkTrafficData.networkAnomalies.map((anomaly) => (
                                <TableRow key={anomaly.id}>
                                    <TableCell className="font-mono">{anomaly.sourceIp}</TableCell>
                                    <TableCell className="font-mono">{anomaly.destIp}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{anomaly.app}</Badge>
                                    </TableCell>
                                    <TableCell>{anomaly.port}</TableCell>
                                    <TableCell>
                                        <Badge variant="destructive">{anomaly.type}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

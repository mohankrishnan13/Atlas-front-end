import type { LucideIcon } from "lucide-react";

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Healthy';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type Application = {
  id: string;
  name: string;
};

export type User = {
  name:string;
  email: string;
  avatar: string;
};

export type RecentAlert = {
  id: string;
  app: string;
  message: string;
  severity: Severity;
  timestamp: string;
};

export type HeaderData = {
    user: User;
    applications: Application[];
    recentAlerts: RecentAlert[];
};

export type TimeSeriesData = {
    name: string;
    [key: string]: number | string;
};

// --- Overview Page (New Types) ---
export type AppHealth = {
  id: string;
  name: string;
  status: 'Healthy' | 'Warning' | 'Critical';
  statusText?: string;
  trafficData: TimeSeriesData[];
};

export type ThreatAnomaly = {
    id: string;
    severity: Severity;
    target: string;
    assignee?: string;
    issue: string;
    timestamp: string;
};

export type Microservice = {
    id: string;
    name: string;
    status: 'Healthy' | 'Failing';
    position: { top: string; left: string; };
    connections: string[];
};

export type OverviewData = {
    appHealth: AppHealth[];
    threatAnomalies: ThreatAnomaly[];
    microservices: Microservice[];
};


// API Monitoring Page
export type ApiRoute = {
    id: number;
    app: string;
    path: string;
    method: string;
    cost: number;
    trend: number;
    action: string;
};

export type ApiMonitoringData = {
    apiCallsToday: number;
    blockedRequests: number;
    avgLatency: number;
    estimatedCost: number;
    apiUsageChart: TimeSeriesData[];
    apiRouting: ApiRoute[];
};

// Network Traffic Page
export type NetworkAnomaly = {
    id: number;
    sourceEndpoint: string;
    targetApp: string;
    port: number;
    type: string;
};

export type NetworkTrafficData = {
    bandwidth: number;
    activeConnections: number;
    droppedPackets: number;
    networkAnomalies: NetworkAnomaly[];
};

// Endpoint Security Page
export type OsDistribution = {
    name: string;
    value: number;
    fill: string;
};

export type AlertTypeDistribution = {
    name: string;
    value: number;
    fill: string;
};

export type WazuhEvent = {
    id: number;
    workstationId: string;
    employee: string;
    avatar: string;
    alert: string;
    severity: Severity;
};

export type EndpointSecurityData = {
    monitoredLaptops: number;
    offlineDevices: number;
    malwareAlerts: number;
    osDistribution: OsDistribution[];
    alertTypes: AlertTypeDistribution[];
    wazuhEvents: WazuhEvent[];
};

// DB Monitoring Page
export type SuspiciousActivity = {
    id: number;
    app: string;
    user: string;
    type: string;
    table: string;
    reason: string;
};

export type DbMonitoringData = {
    activeConnections: number;
    avgQueryLatency: number;
    dataExportVolume: number;
    operationsChart: TimeSeriesData[];
    suspiciousActivity: SuspiciousActivity[];
};

// Incidents Page
export type Incident = {
    id: string;
    eventName: string;
    timestamp: string;
    severity: Severity;
    sourceIp: string;
    destIp: string;
    targetApp: string;
    status: 'Active' | 'Contained' | 'Closed';
    eventDetails: string;
};

// Settings Page / User Management
export type TeamUser = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Analyst";
  avatar: string;
  status: "Active" | "Invite Pending";
};

// Profile Page
export type UserProfile = {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  timezone: string;
  enable_2fa: boolean;
};

export type AccountActivity = {
  id: string;
  dateTime: string;
  ip: string;
  location: string;
  status: string;
};

// Reports Page
export type ScheduledReport = {
  id: string;
  title: string;
  schedule: string;
  isActive: boolean;
};

export type RecentDownload = {
  id: string;
  name: string;
  generated: string;
  url: string;
};

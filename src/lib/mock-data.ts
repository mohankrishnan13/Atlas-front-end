import type { Application, RecentAlert, Severity } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const applications: Application[] = [
  { id: 'all', name: 'All Applications (12)' },
  { id: 'payment-service', name: 'Payment-Service' },
  { id: 'auth-service', name: 'Auth-Service' },
  { id: 'user-db', name: 'User-DB' },
  { id: 'api-gateway', name: 'API-Gateway' },
  { id: 'frontend-webapp', name: 'Frontend-Webapp' },
  { id: 'notification-service', name: 'Notification-Service' },
  { id: 'inventory-service', name: 'Inventory-Service' },
  { id: 'order-service', name: 'Order-Service' },
  { id: 'shipping-service', name: 'Shipping-Service' },
  { id: 'recommendation-engine', name: 'Recommendation-Engine' },
  { id: 'search-service', name: 'Search-Service' },
  { id: 'data-pipeline', name: 'Data-Pipeline' },
];

export const user = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: PlaceHolderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '',
};

export const recentAlerts: RecentAlert[] = [
    { id: '1', app: 'Auth-Service', message: 'Multiple failed login attempts from IP 192.168.1.100', severity: 'High', timestamp: '2m ago' },
    { id: '2', app: 'Payment-Service', message: 'Unusual transaction volume spike', severity: 'Critical', timestamp: '5m ago' },
    { id: '3', app: 'User-DB', message: 'High query latency detected', severity: 'Medium', timestamp: '15m ago' },
    { id: '4', app: 'API-Gateway', message: 'Endpoint /api/v2/data returning 5xx errors', severity: 'High', timestamp: '30m ago' },
    { id: '5', app: 'Frontend-Webapp', message: 'Cross-site scripting attempt blocked', severity: 'Low', timestamp: '1h ago' },
];

export const overviewData = {
  apiRequests: 1_257_345,
  errorRate: 1.7,
  activeAlerts: 4,
  costRisk: 7.2,
  appAnomalies: [
    { name: 'Payment-Svc', anomalies: 65 },
    { name: 'Auth-Svc', anomalies: 42 },
    { name: 'User-DB', anomalies: 28 },
    { name: 'API-GW', anomalies: 15 },
    { name: 'Frontend', anomalies: 89 },
    { name: 'Notify-Svc', anomalies: 12 },
    { name: 'Inventory-Svc', anomalies: 55 },
    { name: 'Order-Svc', anomalies: 30 },
  ],
  microservices: [
    { id: 'payment-service', name: 'Payment-Service', status: 'Failing' as const, position: { top: '30%', left: '50%' }, connections: ['api-gateway', 'order-service'] },
    { id: 'auth-service', name: 'Auth-Service', status: 'Healthy' as const, position: { top: '50%', left: '20%' }, connections: ['api-gateway'] },
    { id: 'user-db', name: 'User-DB', status: 'Healthy' as const, position: { top: '70%', left: '35%' }, connections: ['auth-service'] },
    { id: 'api-gateway', name: 'API-Gateway', status: 'Healthy' as const, position: { top: '10%', left: '35%' }, connections: [] },
    { id: 'frontend-webapp', name: 'Frontend-Webapp', status: 'Healthy' as const, position: { top: '0%', left: '10%' }, connections: ['api-gateway'] },
    { id: 'notification-service', name: 'Notification-Service', status: 'Healthy' as const, position: { top: '80%', left: '60%' }, connections: ['order-service'] },
    { id: 'inventory-service', name: 'Inventory-Service', status: 'Failing' as const, position: { top: '50%', left: '80%' }, connections: ['order-service'] },
    { id: 'order-service', name: 'Order-Service', status: 'Healthy' as const, position: { top: '50%', left: '50%' }, connections: ['user-db'] },
    { id: 'shipping-service', name: 'Shipping-Service', status: 'Healthy' as const, position: { top: '90%', left: '80%' }, connections: ['order-service'] },
    { id: 'recommendation-engine', name: 'Recommendation-Engine', status: 'Healthy' as const, position: { top: '10%', left: '70%' }, connections: ['data-pipeline'] },
    { id: 'search-service', name: 'Search-Service', status: 'Healthy' as const, position: { top: '30%', left: '0%' }, connections: ['data-pipeline'] },
    { id: 'data-pipeline', name: 'Data-Pipeline', status: 'Healthy' as const, position: { top: '30%', left: '95%' }, connections: [] },
  ],
  failingEndpoints: {
    'payment-service': '/api/v1/charge',
    'inventory-service': '/grpc/Inventory.Check',
  },
  apiRequestsChart: Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, requests: Math.floor(Math.random() * 200000) + 100000 })),
  systemAnomalies: [
    { id: 'ANOM-001', service: 'Data-Pipeline', type: 'Unexpected Data Format', severity: 'Medium' as Severity, timestamp: '2024-05-21 14:30 UTC' },
    { id: 'ANOM-002', service: 'Auth-Service', type: 'Anomalous Token Refresh Rate', severity: 'High' as Severity, timestamp: '2024-05-21 12:15 UTC' },
    { id: 'ANOM-003', service: 'Shipping-Service', type: 'Latency Spike to External API', severity: 'Low' as Severity, timestamp: '2024-05-21 11:00 UTC' },
    { id: 'ANOM-004', service: 'Payment-Service', type: 'High Rate of Card Declines', severity: 'Critical' as Severity, timestamp: '2024-05-20 22:05 UTC' },
  ],
};

export const apiMonitoringData = {
    apiCallsToday: 75_432,
    blockedRequests: 1_234,
    avgLatency: 128,
    estimatedCost: 345.67,
    apiUsageChart: Array.from({ length: 30 }, (_, i) => {
        const base = 50000 + Math.random() * 10000;
        return { 
            name: `Day ${i + 1}`, 
            actual: base + (Math.random() - 0.2) * 5000, 
            predicted: base + (Math.random() - 0.5) * 2000 
        }
    }),
    apiRouting: [
        { id: 1, app: 'Auth-Service', path: '/api/v1/login', method: 'POST', cost: 0.001, trend: 5, action: 'Normal' },
        { id: 2, app: 'Payment-Service', path: '/api/v1/charge', method: 'POST', cost: 0.005, trend: 15, action: 'Rate-Limited' },
        { id: 3, app: 'User-DB', path: '/graphql', method: 'POST', cost: 0.02, trend: -3, action: 'Normal' },
        { id: 4, app: 'Notification-Service', path: '/api/v1/send', method: 'POST', cost: 0.002, trend: 8, action: 'Normal' },
        { id: 5, app: 'API-Gateway', path: '/ext/partner/hook', method: 'PUT', cost: 0, trend: 25, action: 'Blocked' },
    ]
};

export const networkTrafficData = {
    bandwidth: 78, // in percent
    activeConnections: 12_543,
    droppedPackets: 432,
    networkAnomalies: [
        { id: 1, sourceIp: '203.0.113.54', destIp: '10.0.1.12', app: 'Payment-Service', port: 443, type: 'DDoS Attempt' },
        { id: 2, sourceIp: '198.51.100.2', destIp: '10.0.2.34', app: 'User-DB', port: 5432, type: 'Port Scan' },
        { id: 3, sourceIp: '10.0.5.88', destIp: '192.0.2.110', app: 'Data-Pipeline', port: 80, type: 'Data Exfiltration' },
        { id: 4, sourceIp: '203.0.113.12', destIp: '10.0.1.15', app: 'Auth-Service', port: 443, type: 'Brute Force' },
    ]
};

export const endpointSecurityData = {
    monitoredLaptops: 2345,
    offlineDevices: 123,
    malwareAlerts: 12,
    osDistribution: [
        { name: 'macOS', value: 1500, fill: 'var(--chart-1)' },
        { name: 'Windows', value: 700, fill: 'var(--chart-2)' },
        { name: 'Linux', value: 145, fill: 'var(--chart-3)' },
    ],
    alertTypes: [
        { name: 'Malware', value: 12, fill: 'var(--chart-5)' },
        { name: 'Phishing', value: 45, fill: 'var(--chart-2)' },
        { name: 'Suspicious Process', value: 88, fill: 'var(--chart-4)' },
    ],
    wazuhEvents: [
        { id: 1, workstationId: 'MAC-CFO-001', employee: 'John Smith', avatar: PlaceHolderImages.find(p => p.id === 'employee-1')?.imageUrl || '', alert: 'Potential ransomware detected', severity: 'Critical' as Severity },
        { id: 2, workstationId: 'WIN-MKT-012', employee: 'Emily Jones', avatar: PlaceHolderImages.find(p => p.id === 'employee-2')?.imageUrl || '', alert: 'Failed login from new location', severity: 'Medium' as Severity },
        { id: 3, workstationId: 'LNX-DEV-054', employee: 'Michael Brown', avatar: PlaceHolderImages.find(p => p.id === 'employee-3')?.imageUrl || '', alert: 'Unauthorized software installed', severity: 'High' as Severity },
        { id: 4, workstationId: 'WIN-HR-003', employee: 'Sarah Miller', avatar: PlaceHolderImages.find(p => p.id === 'employee-4')?.imageUrl || '', alert: 'Phishing link clicked', severity: 'High' as Severity },
    ]
};

export const dbMonitoringData = {
    activeConnections: 345,
    avgQueryLatency: 45, // ms
    dataExportVolume: 2.3, // TB
    operationsChart: Array.from({ length: 12 }, (_, i) => ({
      name: `Hour ${i}`,
      SELECT: 4000 + Math.random() * 1000,
      INSERT: 2400 + Math.random() * 500,
      UPDATE: 1200 + Math.random() * 300,
      DELETE: 100 + Math.random() * 50,
    })),
    suspiciousActivity: [
      { id: 1, app: 'Recommendation-Engine', user: 'service-account-rec', type: 'SELECT', table: 'user_profiles', reason: 'Anomalous full table scan' },
      { id: 2, app: 'Auth-Service', user: 'admin_user_temp', type: 'DELETE', table: 'audit_logs', reason: 'Privileged action outside business hours' },
      { id: 3, app: 'Data-Pipeline', user: 'etl_process_01', type: 'SELECT', table: 'transactions', reason: 'Unusually large data export' },
      { id: 4, app: 'Unknown (IP: 10.1.1.5)', user: 'postgres', type: 'SELECT', table: 'pg_catalog.pg_user', reason: 'System table enumeration' },
    ]
};

export const incidentsData = [
  { id: 'INC-001', eventName: 'Potential DDoS Attack', timestamp: '2024-05-21 14:30 UTC', severity: 'Critical' as Severity, sourceIp: 'Multiple (500+)', destIp: '10.0.1.12', targetApp: 'Payment-Service', status: 'Active', eventDetails: 'SYN flood detected by firewall, traffic volume > 10Gbps targeting payment endpoint. Multiple source countries.' },
  { id: 'INC-002', eventName: 'Anomalous Token Refresh Rate', timestamp: '2024-05-21 12:15 UTC', severity: 'High' as Severity, sourceIp: '203.0.113.12', destIp: '10.0.1.15', targetApp: 'Auth-Service', status: 'Contained', eventDetails: 'A single user account token was refreshed over 1000 times in 5 minutes. Associated with user account user@example.com.' },
  { id: 'INC-003', eventName: 'Port Scan Detected', timestamp: '2024-05-21 09:00 UTC', severity: 'Medium' as Severity, sourceIp: '198.51.100.2', destIp: '10.0.0.0/16', targetApp: 'N/A', status: 'Closed', eventDetails: 'Source IP 198.51.100.2 scanned over 500 ports across the 10.0.0.0/16 subnet. No successful connections made.' },
  { id: 'INC-004', eventName: 'Malware Detected on Endpoint', timestamp: '2024-05-20 18:45 UTC', severity: 'High' as Severity, sourceIp: 'N/A', destIp: '192.168.10.54', targetApp: 'Workstation LNX-DEV-054', status: 'Contained', eventDetails: 'Wazuh agent detected a known malware signature (Trojan.GenericKD.3142) and quarantined the file. Process was attempting to connect to C2 server at evil.com.'},
];

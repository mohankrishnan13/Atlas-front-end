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

export type RecentAlert = {
  id: string;
  app: string;
  message: string;
  severity: Severity;
  timestamp: string;
}

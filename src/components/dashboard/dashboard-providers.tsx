"use client";
import { EnvironmentProvider } from "@/context/EnvironmentContext";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return <EnvironmentProvider>{children}</EnvironmentProvider>;
}

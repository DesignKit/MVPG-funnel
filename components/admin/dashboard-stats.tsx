"use client";

import {
  ClipboardList,
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

interface StatsProps {
  leads: number;
  activeBookings: number;
  sessions: number;
  outlines: number;
  conversionRate: number;
  totalBookings: number;
}

const STAT_CARDS: {
  key: keyof StatsProps;
  label: string;
  icon: LucideIcon;
  format?: "percent";
}[] = [
  { key: "leads", label: "Total Leads", icon: ClipboardList },
  { key: "activeBookings", label: "Active Bookings", icon: Calendar },
  { key: "sessions", label: "Chat Sessions", icon: MessageSquare },
  { key: "outlines", label: "Outlines Generated", icon: FileText },
  { key: "conversionRate", label: "Conversion Rate", icon: TrendingUp, format: "percent" },
  { key: "totalBookings", label: "Total Bookings", icon: DollarSign },
];

export function DashboardStats(props: StatsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
      {STAT_CARDS.map(({ key, label, icon: Icon, format }) => {
        const value = props[key];
        return (
          <Card key={key} className="border-border bg-white shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription className="font-inter text-sm text-muted-secondary">
                  {label}
                </CardDescription>
                <div className="rounded-lg bg-surface-light-purple p-2">
                  <Icon className="h-4 w-4 text-accent-purple" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-inter-tight text-3xl font-bold text-foreground tabular-nums">
                {value > 0 ? (
                  <>
                    <NumberTicker value={value} />
                    {format === "percent" && "%"}
                  </>
                ) : (
                  <span>{format === "percent" ? "0%" : "0"}</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

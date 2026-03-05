"use client";

import { ClipboardList, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Activity {
  type: "registration" | "booking" | "outline";
  title: string;
  status: string;
  created_at: string;
}

const TYPE_CONFIG = {
  registration: {
    icon: ClipboardList,
    bg: "bg-primary/10",
    text: "text-primary",
  },
  booking: {
    icon: Calendar,
    bg: "bg-accent-purple/10",
    text: "text-accent-purple",
  },
  outline: {
    icon: FileText,
    bg: "bg-primary-gold/10",
    text: "text-primary-gold",
  },
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-primary-gold/10 text-primary-gold border-primary-gold/20",
  approved: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  confirmed: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  draft: "bg-surface-gray text-muted-secondary border-border",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <Card className="border-border bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="font-inter-tight text-base font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-secondary">No activity yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="font-inter-tight text-base font-semibold">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {activities.map((activity, i) => {
          const config = TYPE_CONFIG[activity.type];
          const Icon = config.icon;
          return (
            <div
              key={`${activity.type}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-white p-3"
            >
              <div className={`rounded-full p-2 ${config.bg}`}>
                <Icon className={`h-4 w-4 ${config.text}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-secondary">
                  {timeAgo(activity.created_at)}
                </p>
              </div>
              <Badge
                className={`text-[10px] ${STATUS_BADGE[activity.status] ?? "bg-surface-gray text-muted-secondary border-border"}`}
              >
                {activity.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

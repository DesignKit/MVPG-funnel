"use client";

import {
  Mail,
  UserPlus,
  MessageSquare,
  ArrowRightLeft,
  StickyNote,
  Globe,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ActivityEntry {
  id: string;
  event_type: string;
  event_source: string;
  description: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  lead_received: UserPlus,
  email_sent: Mail,
  status_changed: ArrowRightLeft,
  note_added: StickyNote,
  assigned: UserPlus,
  form_submitted: Globe,
};

const SOURCE_STYLES: Record<string, string> = {
  "make.com": "bg-violet-500/10 text-violet-600 border-violet-500/20",
  admin: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  funnel: "bg-primary/10 text-primary border-primary/20",
  stripe: "bg-green-500/10 text-green-600 border-green-500/20",
};

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function ActivityTimeline({
  activities,
}: {
  activities: ActivityEntry[];
}) {
  if (activities.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-secondary">
        No activity yet
      </p>
    );
  }

  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" />

      {activities.map((entry) => {
        const Icon = EVENT_ICONS[entry.event_type] ?? Zap;
        return (
          <div key={entry.id} className="relative flex gap-3 py-3">
            <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white">
              <Icon className="h-3.5 w-3.5 text-muted-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{entry.description}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  className={`text-[9px] ${SOURCE_STYLES[entry.event_source] ?? "bg-surface-gray text-muted-secondary border-border"}`}
                >
                  {entry.event_source}
                </Badge>
                <span className="text-[11px] text-muted-secondary">
                  {relativeTime(entry.created_at)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

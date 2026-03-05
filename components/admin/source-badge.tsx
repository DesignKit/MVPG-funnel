"use client";

import { Badge } from "@/components/ui/badge";

const SOURCE_STYLES: Record<string, string> = {
  website_funnel: "bg-primary/10 text-primary border-primary/20",
  website_contact: "bg-primary/10 text-primary border-primary/20",
  meta_ads: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  linkedin: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  cold_email: "bg-surface-gray text-muted-secondary border-border",
};

const SOURCE_LABELS: Record<string, string> = {
  website_funnel: "Website",
  website_contact: "Contact Form",
  meta_ads: "Meta Ads",
  linkedin: "LinkedIn",
  cold_email: "Cold Email",
};

export function SourceBadge({ source }: { source: string }) {
  return (
    <Badge
      className={`text-[10px] ${SOURCE_STYLES[source] ?? "bg-surface-gray text-muted-secondary border-border"}`}
    >
      {SOURCE_LABELS[source] ?? source}
    </Badge>
  );
}

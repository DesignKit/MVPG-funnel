"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadDetailPanel } from "./lead-detail-panel";
import { SourceBadge } from "./source-badge";

interface PipelineLead {
  id: string;
  name: string;
  email: string;
  idea_description: string;
  status: string;
  created_at: string;
  stage: string;
  source?: string;
  lead_status?: string;
  assigned_to?: string;
}

interface PipelineBoardProps {
  stages: Record<string, PipelineLead[]>;
}

const STAGE_COLORS: Record<string, string> = {
  "New Lead": "border-t-primary-gold",
  Approved: "border-t-primary",
  Booked: "border-t-accent-purple",
  Workshop: "border-t-accent-pink",
  Delivered: "border-t-green-500",
};

const STAGE_BADGE: Record<string, string> = {
  "New Lead": "bg-primary-gold/10 text-primary-gold",
  Approved: "bg-primary/10 text-primary",
  Booked: "bg-accent-purple/10 text-accent-purple",
  Workshop: "bg-accent-pink/10 text-accent-pink",
  Delivered: "bg-green-500/10 text-green-600",
};

function daysAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000
  );
  if (diff === 0) return "today";
  if (diff === 1) return "1d ago";
  return `${diff}d ago`;
}

function LeadCard({
  lead,
  onClick,
}: {
  lead: PipelineLead;
  onClick: () => void;
}) {
  return (
    <Card
      className="cursor-pointer border-border bg-white shadow-sm transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <p className="font-inter-tight text-sm font-medium text-foreground">
          {lead.name || "Unnamed"}
        </p>
        <p className="text-xs text-muted-secondary truncate">{lead.email}</p>
        <p className="mt-2 text-xs text-muted-secondary line-clamp-2">
          {lead.idea_description || "No idea provided"}
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          {lead.source && <SourceBadge source={lead.source} />}
          <Badge className="bg-surface-gray text-muted-secondary border-border text-[10px]">
            {daysAgo(lead.created_at)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function PipelineBoard({ stages }: PipelineBoardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const stageOrder = ["New Lead", "Approved", "Booked", "Workshop", "Delivered"];

  return (
    <>
      {/* Desktop: horizontal Kanban */}
      <div className="hidden tablet:flex gap-4 overflow-x-auto pb-4">
        {stageOrder.map((stageName) => {
          const leads = stages[stageName] ?? [];
          return (
            <div key={stageName} className="flex-shrink-0 w-[280px]">
              <div
                className={`mb-3 flex items-center justify-between rounded-lg border-t-4 bg-white p-3 shadow-sm ${STAGE_COLORS[stageName] ?? "border-t-border"}`}
              >
                <h3 className="font-inter-tight text-sm font-semibold text-foreground">
                  {stageName}
                </h3>
                <Badge
                  className={`text-[10px] ${STAGE_BADGE[stageName] ?? "bg-surface-gray text-muted-secondary"}`}
                >
                  {leads.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-2 min-h-[200px]">
                {leads.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted-secondary">
                    No leads
                  </p>
                )}
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() => setSelectedId(lead.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked accordion */}
      <div className="flex flex-col gap-2 tablet:hidden">
        {stageOrder.map((stageName) => {
          const leads = stages[stageName] ?? [];
          const isOpen = expandedStage === stageName;
          return (
            <div key={stageName}>
              <button
                onClick={() => setExpandedStage(isOpen ? null : stageName)}
                className={`w-full flex items-center justify-between rounded-lg border-t-4 bg-white p-3 shadow-sm ${STAGE_COLORS[stageName] ?? "border-t-border"}`}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-inter-tight text-sm font-semibold text-foreground">
                    {stageName}
                  </h3>
                  <Badge
                    className={`text-[10px] ${STAGE_BADGE[stageName] ?? "bg-surface-gray text-muted-secondary"}`}
                  >
                    {leads.length}
                  </Badge>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-secondary transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div className="mt-2 flex flex-col gap-2">
                  {leads.length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-secondary">
                      No leads
                    </p>
                  )}
                  {leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setSelectedId(lead.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <LeadDetailPanel
        registrationId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}

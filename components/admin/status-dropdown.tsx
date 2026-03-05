"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatusDropdownProps {
  id: string;
  currentStatus: string;
  options: string[];
  onUpdate: (id: string, status: string) => Promise<void>;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-primary-gold/10 text-primary-gold border-primary-gold/20",
  approved: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  confirmed: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  draft: "bg-surface-gray text-muted-secondary border-border",
  reviewed: "bg-primary/10 text-primary border-primary/20",
  finalized: "bg-accent-purple/10 text-accent-purple border-accent-purple/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  abandoned: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusDropdown({
  id,
  currentStatus,
  options,
  onUpdate,
}: StatusDropdownProps) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleSelect(newStatus: string) {
    if (newStatus === status) return;
    const prev = status;
    setStatus(newStatus);
    setSaving(true);
    try {
      await onUpdate(id, newStatus);
    } catch {
      setStatus(prev);
    } finally {
      setSaving(false);
    }
  }

  const badgeStyle =
    STATUS_STYLES[status] ?? "bg-surface-gray text-muted-secondary border-border";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={saving}>
        <button
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50 ${badgeStyle}`}
        >
          {status}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => handleSelect(opt)}
            className="text-xs"
          >
            <Badge
              className={`mr-2 text-[10px] ${STATUS_STYLES[opt] ?? "bg-surface-gray text-muted-secondary border-border"}`}
            >
              {opt}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

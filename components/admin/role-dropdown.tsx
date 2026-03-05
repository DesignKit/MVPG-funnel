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
import { updateUserRole } from "@/lib/actions/admin";

interface RoleDropdownProps {
  userId: string;
  currentRole: string;
}

const ROLE_OPTIONS = ["user", "admin", "super_admin"] as const;

const ROLE_STYLES: Record<string, string> = {
  user: "bg-surface-gray text-muted-secondary border-border",
  admin: "bg-surface-warm text-primary border-primary/20",
  super_admin: "bg-surface-light-purple text-accent-purple border-accent-purple/20",
};

export function RoleDropdown({ userId, currentRole }: RoleDropdownProps) {
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);

  async function handleSelect(newRole: string) {
    if (newRole === role) return;
    const prev = role;
    setRole(newRole);
    setSaving(true);
    try {
      await updateUserRole(userId, newRole as "user" | "admin" | "super_admin");
    } catch {
      setRole(prev);
    } finally {
      setSaving(false);
    }
  }

  const style = ROLE_STYLES[role] ?? ROLE_STYLES.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={saving}>
        <button
          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50 ${style}`}
        >
          {role.replace("_", " ")}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {ROLE_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => handleSelect(opt)}
            className="text-xs"
          >
            <Badge className={`mr-2 text-[10px] ${ROLE_STYLES[opt]}`}>
              {opt.replace("_", " ")}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

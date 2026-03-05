"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface SearchFilterBarProps {
  placeholder?: string;
  statusOptions?: string[];
  onSearch: (search: string) => void;
  onStatusFilter?: (status: string | null) => void;
}

export function SearchFilterBar({
  placeholder = "Search...",
  statusOptions,
  onSearch,
  onStatusFilter,
}: SearchFilterBarProps) {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    onSearch(e.target.value);
  }

  function handleStatusSelect(status: string | null) {
    setActiveStatus(status);
    onStatusFilter?.(status);
  }

  const hasFilters = search.length > 0 || activeStatus !== null;

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-secondary" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={handleSearchChange}
          className="pl-9 h-9 text-sm border-border bg-white"
        />
      </div>

      {statusOptions && statusOptions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-xs font-medium text-muted-secondary hover:bg-surface-gray transition-colors">
              Status
              {activeStatus && (
                <Badge className="ml-1 bg-accent-purple/10 text-accent-purple border-accent-purple/20 text-[10px]">
                  {activeStatus}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => handleStatusSelect(null)}
              className="text-xs"
            >
              All statuses
            </DropdownMenuItem>
            {statusOptions.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => handleStatusSelect(opt)}
                className="text-xs"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {hasFilters && (
        <button
          onClick={() => {
            setSearch("");
            setActiveStatus(null);
            onSearch("");
            onStatusFilter?.(null);
          }}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-muted-secondary hover:text-foreground transition-colors"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}

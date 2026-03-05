"use client";

import { useState, useRef, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { SearchFilterBar } from "@/components/admin/search-filter-bar";
import { getChatSessions } from "@/lib/actions/admin";

interface Props {
  initialData: Record<string, unknown>[];
  initialCount: number;
}

const SESSION_STATUS_OPTIONS = ["in_progress", "completed", "abandoned"];

const STATUS_STYLES: Record<string, string> = {
  in_progress: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  abandoned: "bg-destructive/10 text-destructive border-destructive/20",
};

export function SessionsTable({ initialData, initialCount }: Props) {
  const [data, setData] = useState(initialData);
  const [count, setCount] = useState(initialCount);
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtersRef = useRef<{ search?: string; status?: string }>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(async (p: number) => {
    const result = await getChatSessions(p, 20, filtersRef.current);
    setData(result.data);
    setCount(result.count);
    setPage(p);
  }, []);

  function handlePageChange(newPage: number) {
    fetchData(newPage);
  }

  function handleSearch(search: string) {
    filtersRef.current = { ...filtersRef.current, search: search || undefined };
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchData(1), 300);
  }

  function handleStatusFilter(status: string | null) {
    filtersRef.current = { ...filtersRef.current, status: status ?? undefined };
    fetchData(1);
  }

  const columns = [
    {
      key: "id",
      header: "Session",
      render: (row: Record<string, unknown>) => (
        <button
          onClick={() =>
            setExpanded(expanded === (row.id as string) ? null : (row.id as string))
          }
          className="text-xs font-medium text-accent-purple hover:underline"
        >
          {(row.id as string).slice(0, 8)}...
        </button>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Record<string, unknown>) => {
        const s = row.status as string;
        return (
          <Badge className={`text-[10px] ${STATUS_STYLES[s] ?? "bg-surface-gray text-muted-secondary border-border"}`}>
            {s}
          </Badge>
        );
      },
    },
    {
      key: "chat_responses",
      header: "Completion",
      render: (row: Record<string, unknown>) => {
        const responses = row.chat_responses as unknown[];
        const count = responses?.length ?? 0;
        const pct = Math.round((count / 4) * 100);
        return (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-surface-gray">
              <div
                className="h-1.5 rounded-full bg-accent-purple"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-muted-secondary">{count}/4</span>
          </div>
        );
      },
    },
    {
      key: "created_at",
      header: "Created",
      render: (row: Record<string, unknown>) =>
        new Date(row.created_at as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchFilterBar
        placeholder="Search sessions..."
        statusOptions={SESSION_STATUS_OPTIONS}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
      />
      <DataTable
        columns={columns}
        data={data}
        totalCount={count}
        page={page}
        perPage={20}
        onPageChange={handlePageChange}
      />

      {expanded && (
        <div className="mt-4 rounded-lg border border-border bg-white p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Responses for session {expanded.slice(0, 8)}...
          </h3>
          {(() => {
            const session = data.find((s) => s.id === expanded);
            const responses = (session?.chat_responses ?? []) as Record<string, unknown>[];
            if (responses.length === 0) {
              return <p className="text-sm text-muted-secondary">No responses yet</p>;
            }
            return (
              <div className="space-y-2">
                {responses.map((r) => (
                  <div key={r.id as string} className="rounded-lg bg-surface-gray p-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-secondary">
                      {r.question_text as string}
                    </p>
                    <p className="mt-1 text-sm text-foreground">
                      {r.answer_text as string}
                    </p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

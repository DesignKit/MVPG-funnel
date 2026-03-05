"use client";

import { useState, useRef, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { StatusDropdown } from "@/components/admin/status-dropdown";
import { SearchFilterBar } from "@/components/admin/search-filter-bar";
import {
  getRegistrations,
  updateRegistrationStatus,
} from "@/lib/actions/admin";
import { SourceBadge } from "@/components/admin/source-badge";

interface Props {
  initialData: Record<string, unknown>[];
  initialCount: number;
}

const STATUS_OPTIONS = ["pending", "approved", "rejected"];

export function RegistrationsTable({ initialData, initialCount }: Props) {
  const [data, setData] = useState(initialData);
  const [count, setCount] = useState(initialCount);
  const [page, setPage] = useState(1);
  const filtersRef = useRef<{ search?: string; status?: string; source?: string; lead_status?: string }>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(async (p: number) => {
    const result = await getRegistrations(p, 20, filtersRef.current);
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
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "idea_description",
      header: "Idea",
      render: (row: Record<string, unknown>) => (
        <span className="line-clamp-2 max-w-xs text-xs">
          {row.idea_description as string}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Record<string, unknown>) => (
        <StatusDropdown
          id={row.id as string}
          currentStatus={row.status as string}
          options={STATUS_OPTIONS}
          onUpdate={updateRegistrationStatus}
        />
      ),
    },
    {
      key: "source",
      header: "Source",
      render: (row: Record<string, unknown>) =>
        row.source ? <SourceBadge source={row.source as string} /> : null,
    },
    {
      key: "lead_status",
      header: "Lead Status",
      render: (row: Record<string, unknown>) => (
        <span className="text-xs capitalize">{((row.lead_status as string) || "open").replace(/_/g, " ")}</span>
      ),
    },
    {
      key: "assigned_to",
      header: "Assigned",
      render: (row: Record<string, unknown>) => (
        <span className="text-xs">{(row.assigned_to as string) || "—"}</span>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (row: Record<string, unknown>) =>
        new Date(row.created_at as string).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <SearchFilterBar
        placeholder="Search by name or email..."
        statusOptions={STATUS_OPTIONS}
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
    </div>
  );
}

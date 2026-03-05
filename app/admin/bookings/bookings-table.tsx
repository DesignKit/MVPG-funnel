"use client";

import { useState, useRef, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { StatusDropdown } from "@/components/admin/status-dropdown";
import { SearchFilterBar } from "@/components/admin/search-filter-bar";
import { getBookings, updateBookingStatus } from "@/lib/actions/admin";

interface Props {
  initialData: Record<string, unknown>[];
  initialCount: number;
}

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "completed"];

export function BookingsTable({ initialData, initialCount }: Props) {
  const [data, setData] = useState(initialData);
  const [count, setCount] = useState(initialCount);
  const [page, setPage] = useState(1);
  const filtersRef = useRef<{ search?: string; status?: string }>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchData = useCallback(async (p: number) => {
    const result = await getBookings(p, 20, filtersRef.current);
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
      key: "registrations",
      header: "User",
      render: (row: Record<string, unknown>) => {
        const reg = row.registrations as Record<string, unknown> | null;
        return reg ? `${reg.name} (${reg.email})` : "—";
      },
    },
    { key: "booking_date", header: "Date" },
    { key: "booking_time", header: "Time" },
    {
      key: "status",
      header: "Status",
      render: (row: Record<string, unknown>) => (
        <StatusDropdown
          id={row.id as string}
          currentStatus={row.status as string}
          options={STATUS_OPTIONS}
          onUpdate={updateBookingStatus}
        />
      ),
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
        placeholder="Search by user name or email..."
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

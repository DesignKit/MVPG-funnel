"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/data-table";
import { RoleDropdown } from "@/components/admin/role-dropdown";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getProfiles,
  inviteUser,
  updateUserProfile,
  deleteUser,
} from "@/lib/actions/admin";

interface Props {
  initialData: Record<string, unknown>[];
  initialCount: number;
  isSuperAdmin: boolean;
}

const PROGRESS_LABELS: Record<string, { label: string; style: string }> = {
  registered: { label: "Registered", style: "bg-primary/10 text-primary border-primary/20" },
  booked: { label: "Booked", style: "bg-primary-gold/10 text-primary-gold border-primary-gold/20" },
  workshop: { label: "Workshop", style: "bg-accent-purple/10 text-accent-purple border-accent-purple/20" },
  completed: { label: "Completed", style: "bg-green-500/10 text-green-600 border-green-500/20" },
};

type Role = "user" | "admin" | "super_admin";

export function UsersTable({ initialData, initialCount, isSuperAdmin }: Props) {
  const [data, setData] = useState(initialData);
  const [count, setCount] = useState(initialCount);
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Record<string, unknown> | null>(null);
  const [deletingUser, setDeletingUser] = useState<Record<string, unknown> | null>(null);

  async function refresh() {
    const result = await getProfiles(page, 20);
    setData(result.data);
    setCount(result.count);
  }

  async function handlePageChange(newPage: number) {
    const result = await getProfiles(newPage, 20);
    setData(result.data);
    setCount(result.count);
    setPage(newPage);
  }

  const columns = [
    {
      key: "display_name",
      header: "Name",
      render: (row: Record<string, unknown>) =>
        (row.display_name as string) || (
          <span className="text-muted-secondary">—</span>
        ),
    },
    { key: "email", header: "Email" },
    {
      key: "progress",
      header: "Progress",
      render: (row: Record<string, unknown>) => {
        const p = row.progress as string;
        const info = p ? PROGRESS_LABELS[p] : null;
        return info ? (
          <Badge className={`text-[10px] ${info.style}`}>{info.label}</Badge>
        ) : (
          <span className="text-xs text-muted-secondary">New</span>
        );
      },
    },
    {
      key: "role",
      header: "Role",
      render: (row: Record<string, unknown>) =>
        isSuperAdmin ? (
          <RoleDropdown
            userId={row.user_id as string}
            currentRole={row.role as string}
          />
        ) : (
          <Badge className="bg-surface-gray text-muted-secondary border-border text-[10px]">
            {row.role as string}
          </Badge>
        ),
    },
    {
      key: "created_at",
      header: "Joined",
      render: (row: Record<string, unknown>) =>
        new Date(row.created_at as string).toLocaleDateString(),
    },
    ...(isSuperAdmin
      ? [
          {
            key: "_actions",
            header: "",
            render: (row: Record<string, unknown>) => (
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingUser(row)}
                  className="rounded-md px-2 py-1 text-xs text-muted-secondary hover:bg-surface-gray hover:text-foreground transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeletingUser(row)}
                  className="rounded-md px-2 py-1 text-xs text-destructive/60 hover:bg-destructive/5 hover:text-destructive transition-colors"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      {isSuperAdmin && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Add User
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        totalCount={count}
        page={page}
        perPage={20}
        onPageChange={handlePageChange}
      />

      {/* Add User Dialog */}
      <AddUserDialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refresh}
      />

      {/* Edit User Dialog */}
      <EditUserDialog
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={refresh}
      />

      {/* Delete User Dialog */}
      <DeleteUserDialog
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onSuccess={refresh}
      />
    </div>
  );
}

/* ── Add User Dialog ── */

function AddUserDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("user");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await inviteUser(email.trim(), name.trim(), role);
      await onSuccess();
      setEmail("");
      setName("");
      setRole("user");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite user");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-inter-tight">Add User</DialogTitle>
          <DialogDescription>
            Send an invite email to add a new user.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="add-email">Email *</Label>
            <Input
              id="add-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-name">Name</Label>
            <Input
              id="add-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-role">Role</Label>
            <select
              id="add-role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="super_admin">super_admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-gray transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !email.trim()}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {saving ? "Sending invite..." : "Send Invite"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Edit User Dialog ── */

function EditUserDialog({
  user,
  onClose,
  onSuccess,
}: {
  user: Record<string, unknown> | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [name, setName] = useState((user?.display_name as string) || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Reset name when user changes
  if (user && name === "" && (user.display_name as string)) {
    setName((user.display_name as string) || "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      await updateUserProfile(user.user_id as string, name.trim());
      await onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-inter-tight">Edit User</DialogTitle>
          <DialogDescription>{user?.email as string}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Display Name</Label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-gray transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Delete User Dialog ── */

function DeleteUserDialog({
  user,
  onClose,
  onSuccess,
}: {
  user: Record<string, unknown> | null;
  onClose: () => void;
  onSuccess: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!user) return;
    setDeleting(true);
    setError("");
    try {
      await deleteUser(user.user_id as string);
      await onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-inter-tight">Delete User</DialogTitle>
          <DialogDescription>
            Permanently delete{" "}
            <span className="font-medium text-foreground">
              {(user?.display_name as string) || (user?.email as string)}
            </span>
            ? This removes their auth account, profile, and cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-gray transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

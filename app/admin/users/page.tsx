import { getProfiles, getAdminInfo } from "@/lib/actions/admin";
import { UsersTable } from "./users-table";

export default async function AdminUsersPage() {
  const [info, { data, count }] = await Promise.all([
    getAdminInfo(),
    getProfiles(1, 20),
  ]);
  const role = info?.role ?? "user";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          All registered user profiles
        </p>
      </div>
      <UsersTable
        initialData={data}
        initialCount={count}
        isSuperAdmin={role === "super_admin"}
      />
    </div>
  );
}

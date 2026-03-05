import { getRegistrations } from "@/lib/actions/admin";
import { RegistrationsTable } from "./registrations-table";

export default async function AdminRegistrationsPage() {
  const { data, count } = await getRegistrations(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">Registrations</h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          All funnel registrations with idea details
        </p>
      </div>
      <RegistrationsTable initialData={data} initialCount={count} />
    </div>
  );
}

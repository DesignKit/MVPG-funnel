import { getChatSessions } from "@/lib/actions/admin";
import { SessionsTable } from "./sessions-table";

export default async function AdminSessionsPage() {
  const { data, count } = await getChatSessions(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">Chat Sessions</h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          AI Workshop sessions with user responses
        </p>
      </div>
      <SessionsTable initialData={data} initialCount={count} />
    </div>
  );
}

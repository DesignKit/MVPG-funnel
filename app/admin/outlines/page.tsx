import { getProjectOutlines } from "@/lib/actions/admin";
import { OutlinesTable } from "./outlines-table";

export default async function AdminOutlinesPage() {
  const { data, count } = await getProjectOutlines(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">Project Outlines</h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          AI-generated project outlines and their review status
        </p>
      </div>
      <OutlinesTable initialData={data} initialCount={count} />
    </div>
  );
}

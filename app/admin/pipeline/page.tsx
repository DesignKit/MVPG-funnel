import { getPipelineData } from "@/lib/actions/admin";
import { PipelineBoard } from "@/components/admin/pipeline-board";

export default async function PipelinePage() {
  const { stages } = await getPipelineData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">
          Pipeline
        </h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          Track leads through the funnel
        </p>
      </div>

      <PipelineBoard stages={stages} />
    </div>
  );
}

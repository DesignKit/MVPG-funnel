export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-40 rounded-md bg-surface-gray" />
        <div className="mt-2 h-4 w-64 rounded-md bg-surface-gray" />
      </div>
      <div className="h-9 w-full max-w-sm rounded-md bg-surface-gray" />
      <div className="rounded-lg border border-border bg-white">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-border p-4">
            <div className="h-4 w-24 rounded bg-surface-gray" />
            <div className="h-4 w-40 rounded bg-surface-gray" />
            <div className="h-4 w-16 rounded bg-surface-gray" />
            <div className="h-4 w-20 rounded bg-surface-gray" />
          </div>
        ))}
      </div>
    </div>
  );
}

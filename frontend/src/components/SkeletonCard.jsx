export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-bg-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-full bg-bg-elevated" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-bg-elevated" />
          <div className="h-3 w-1/3 rounded bg-bg-elevated" />
        </div>
      </div>
      <div className="mb-3 h-3 w-full rounded bg-bg-elevated" />
      <div className="mb-4 h-3 w-2/3 rounded bg-bg-elevated" />
      <div className="h-10 w-full rounded-[10px] bg-bg-elevated" />
    </div>
  );
}

import { Skeleton } from "@/shared/components/ui/skeleton";

export function ExploreSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-card/50 border-border h-[216px] overflow-hidden rounded-xl border"
        >
          <div className="bg-muted h-28 animate-pulse" />
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <div className="mt-2 flex items-center justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

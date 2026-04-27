import { Skeleton } from "@/shared/components/ui/skeleton";

export function ExploreSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card/50 border border-border rounded-xl overflow-hidden h-[216px]">
                    <div className="h-28 bg-muted animate-pulse" />
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between items-center mt-2">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-3 w-10" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

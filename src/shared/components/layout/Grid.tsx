import { GAPS } from "@/shared/const/design-tokens";
import { cn } from "@/shared/lib/utils";


export function Grid({
    cols = 2,
    gap = "md",
    children,
    className,
}: {
    cols?: number;
    gap?: keyof typeof GAPS;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "grid",
                GAPS[gap],
                `grid-cols-1 sm:grid-cols-${cols}`
            )}
        >
            {children}
        </div>
    );
}
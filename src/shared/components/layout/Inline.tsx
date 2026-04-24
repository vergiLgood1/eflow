import { GAPS } from "@/shared/const/design-tokens";
import { cn } from "@/shared/lib/utils";


export function Inline({
    gap = "md",
    align = "center",
    children,
    className,
}: {
    gap?: keyof typeof GAPS;
    align?: "start" | "center" | "end";
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex flex-row",
                GAPS[gap],
                {
                    "items-start": align === "start",
                    "items-center": align === "center",
                    "items-end": align === "end",
                },
                className
            )}
        >
            {children}
        </div>
    );
}
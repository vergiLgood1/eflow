import { cn } from "@/shared/lib/utils";

const gaps = {
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
};

export function Stack({
    gap = "md",
    children,
    className,
}: {
    gap?: keyof typeof gaps;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col", gaps[gap], className)}>
            {children}
        </div>
    );
}
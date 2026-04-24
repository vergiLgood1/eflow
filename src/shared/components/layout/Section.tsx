import { cn } from "@/shared/lib/utils";

const spacing = {
    none: "py-0",
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
};

export function Section({
    size = "md",
    children,
    className,
}: {
    size?: keyof typeof spacing;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section className={cn(spacing[size], className)}>
            {children}
        </section>
    );
}
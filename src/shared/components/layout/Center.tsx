import { cn } from "@/shared/lib/utils";

export function Center({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      {children}
    </div>
  );
}

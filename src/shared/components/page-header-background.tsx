"use client";

import { cn } from "@/shared/lib/utils";

interface PageHeaderBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export function PageHeaderBackground({
  className,
  children,
}: PageHeaderBackgroundProps) {
  return (
    <div
      className={cn(
        "border-border relative overflow-hidden border-b",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_400px_at_70%_30%,rgba(34,197,94,0.1),transparent_60%),radial-gradient(800px_400px_at_40%_80%,rgba(244,63,94,0.12),transparent_60%)]" />
      <div className="bg-background absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.22)_1px,transparent_1px)] mask-[radial-gradient(60%_55%_at_50%_20%,black_55%,transparent_100%)] bg-size-[28px_28px] opacity-[0.35]" />
      <div className="relative">{children}</div>
    </div>
  );
}

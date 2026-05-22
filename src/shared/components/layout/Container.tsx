import { cn } from "@/shared/lib/utils";
import { forwardRef } from "react";

const sizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

export const Container = forwardRef<
  HTMLDivElement,
  {
    size?: keyof typeof sizes;
    className?: string;
    children: React.ReactNode;
  }
>(({ size = "xl", className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizes[size],
        className,
      )}
    >
      {children}
    </div>
  );
});

Container.displayName = "Container";

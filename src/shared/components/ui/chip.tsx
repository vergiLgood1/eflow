import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const chipVariants = cva(
  "inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-card/50 border-border text-muted-foreground hover:text-foreground hover:border-border/80",
        active: "bg-primary/10 border-primary/40 text-foreground",
        outline:
          "bg-transparent border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground",
        secondary:
          "bg-secondary border-secondary-foreground/10 text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ChipProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <button className={cn(chipVariants({ variant }), className)} {...props} />
  );
}

export { Chip, chipVariants };

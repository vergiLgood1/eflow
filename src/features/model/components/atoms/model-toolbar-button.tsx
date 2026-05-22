"use client";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface ModelToolbarButtonProps extends ButtonProps {
  tooltip?: string;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ModelToolbarButton({
  tooltip,
  icon,
  label,
  className,
  children,
  ...props
}: ModelToolbarButtonProps) {
  const button = (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "text-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8 shrink-0",
        label &&
          "flex h-auto flex-col items-center justify-center gap-0 px-1.5 py-2",
        className,
      )}
      {...props}
    >
      {icon || children}
      {label && (
        <span className="text-muted-foreground mt-0.5 text-[7px] leading-none font-medium">
          {label}
        </span>
      )}
    </Button>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="bottom" className="px-2 py-1 text-[10px]">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

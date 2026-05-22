import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import React, { ReactNode, forwardRef } from "react";

interface BoxIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  tooltip: string;
}

export const BoxIconButton = forwardRef<HTMLButtonElement, BoxIconButtonProps>(
  ({ icon, tooltip, onClick, className, disabled, ...props }, ref) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "text-primary-foreground cursor-pointer transition-opacity outline-none hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            onClick={(e) => {
              onClick?.(e);
            }}
            {...props}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="px-2 py-1 text-[10px]">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  },
);

BoxIconButton.displayName = "BoxIconButton";

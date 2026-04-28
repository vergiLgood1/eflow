import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
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
                            "text-primary-foreground transition-opacity hover:opacity-70 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none",
                            className
                        )}
                        onClick={(e) => {
                            // We don't stop propagation here to allow Popover triggers to work
                            onClick?.(e);
                        }}
                        {...props}
                    >
                        {icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px] py-1 px-2">
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        );
    }
);

BoxIconButton.displayName = "BoxIconButton";

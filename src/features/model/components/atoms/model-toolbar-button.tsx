"use client";

import { Button, type ButtonProps } from "@/shared/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
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
                "h-8 w-8 shrink-0 text-foreground hover:bg-accent hover:text-accent-foreground",
                label && "flex flex-col items-center justify-center gap-0 px-1.5 h-auto py-2",
                className
            )}
            {...props}
        >
            {icon || children}
            {label && (
                <span className="text-[7px] leading-none font-medium text-muted-foreground mt-0.5">
                    {label}
                </span>
            )}
        </Button>
    );

    if (tooltip) {
        return (
                <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[10px] py-1 px-2">
                        {tooltip}
                    </TooltipContent>
            </Tooltip>
        );
    }

    return button;
}

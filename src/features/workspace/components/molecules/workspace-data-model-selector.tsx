import React from "react";
import { ChevronsUpDown, Box } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface WorkspaceDataModelSelectorProps {
    className?: string;
}

export function WorkspaceDataModelSelector({
    className,
}: WorkspaceDataModelSelectorProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "gap-2.5 px-3 text-xs h-9 max-w-[260px] justify-between border border-transparent hover:border-border/50 font-medium",
                className
            )}
        >
            <span className="truncate flex items-center gap-2 text-muted-foreground">
                <Box className="h-3.5 w-3.5" />
                Select a data model
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 ml-2 opacity-50 shrink-0" />
        </Button>
    );
}

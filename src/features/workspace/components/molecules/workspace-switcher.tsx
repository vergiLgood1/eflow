import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface WorkspaceSwitcherProps {
    workspaceName: string;
    className?: string;
}

export function WorkspaceSwitcher({
    workspaceName,
    className,
}: WorkspaceSwitcherProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "gap-2 px-3 text-xs h-9 max-w-[260px] justify-between font-medium",
                className
            )}
        >
            <span className="truncate flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                {workspaceName}
            </span>
            <ChevronsUpDown className="h-4 w-4 ml-2 opacity-60" />
        </Button>
    );
}

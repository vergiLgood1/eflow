import React from "react";
import { cn } from "@/shared/lib/utils";

interface WorkspaceModelTabItemProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export function WorkspaceModelTabItem({
    label,
    isActive = false,
    onClick,
}: WorkspaceModelTabItemProps) {
    return (
        <div
            className={cn(
                "flex h-[26px] items-center gap-2 rounded-t px-2 pt-1 text-[12px] shadow-sm cursor-pointer transition-colors",
                isActive
                    ? "bg-background border-b-2 border-primary"
                    : "bg-muted/30 hover:bg-muted/50 border-transparent"
            )}
            onClick={onClick}
        >
            <button className="max-w-[180px] truncate text-left text-[12px]">
                <span
                    className={cn(
                        "font-semibold",
                        isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {label}
                </span>
            </button>
        </div>
    );
}

"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { cn } from "@/shared/lib/utils";
import { ChevronRight, Eye, EyeOff, Table2, Trash2 } from "lucide-react";
import React from "react";

interface ModelSidebarTableProps {
    name: string;
    isOpen?: boolean;
    onToggle?: () => void;
    isHidden?: boolean;
    onToggleVisibility?: () => void;
    onDelete?: () => void;
    children?: React.ReactNode;
}

export function ModelSidebarTable({
    name,
    isOpen = false,
    onToggle,
    isHidden = false,
    onToggleVisibility,
    onDelete,
    children,
}: ModelSidebarTableProps) {
    return (
        <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
            <div
                className={cn(
                    "group flex w-full min-w-0 items-center rounded px-2 py-1.5 text-[12px] transition-all duration-200",
                    isOpen ? "bg-foreground/3" : "hover:bg-foreground/5"
                )}
            >
                <CollapsibleTrigger asChild>
                    <div className="flex flex-1 items-center gap-2 cursor-pointer min-w-0">
                        <ChevronRight
                            className={cn(
                                "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-200",
                                isOpen && "rotate-90 text-muted-foreground"
                            )}
                        />
                        <Table2 className={cn(
                            "h-3.5 w-3.5 transition-colors shrink-0",
                            isHidden ? "text-muted-foreground/40" : "text-primary/80"
                        )} />
                        <span className={cn(
                            "min-w-0 flex-1 truncate text-left font-medium transition-opacity",
                            isHidden ? "opacity-40" : "opacity-100"
                        )}>
                            {name}
                        </span>
                    </div>
                </CollapsibleTrigger>
                <div className="ml-auto flex shrink-0 items-center gap-1.5  transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility?.();
                        }}
                        className={cn(
                            "cursor-pointer transition-colors p-0.5 rounded hover:bg-foreground/10",
                            isHidden ? "text-muted-foreground/40" : "text-sky-500 hover:text-sky-400"
                        )}
                        title={isHidden ? "Show table" : "Hide table"}
                    >
                        {isHidden ? (
                            <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                            <Eye className="h-3.5 w-3.5" />
                        )}
                    </button>
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="cursor-pointer transition-colors p-0.5 rounded bg-destructive/10 text-destructive"
                            title="Delete table"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>
            <CollapsibleContent className="ml-5 mt-0.5 space-y-0.5 pb-2 border-l border-border/40 pl-2">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

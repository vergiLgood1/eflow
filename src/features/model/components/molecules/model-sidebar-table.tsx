import React from "react";
import { ChevronRight, Plus, Eye, Table2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

interface ModelSidebarTableProps {
    name: string;
    isOpen?: boolean;
    onToggle?: () => void;
    children?: React.ReactNode;
}

export function ModelSidebarTable({
    name,
    isOpen = false,
    onToggle,
    children,
}: ModelSidebarTableProps) {
    return (
        <Collapsible open={isOpen} onOpenChange={onToggle} className="px-2">
            <div
                className="group flex w-full min-w-0 cursor-pointer items-center gap-2 rounded px-2 py-1 text-[12px] text-foreground hover:bg-foreground/10"
                draggable="false"
            >
                <CollapsibleTrigger asChild>
                    <ChevronRight
                        className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform",
                            isOpen && "rotate-90"
                        )}
                    />
                </CollapsibleTrigger>
                <Table2 className="h-3.5 w-3.5 text-primary" />
                <span className="min-w-0 flex-1 truncate text-left">{name}</span>
                <div className="ml-auto flex shrink-0 items-center gap-2 opacity-80 group-hover:opacity-100">
                    <button className="opacity-40 cursor-not-allowed" disabled>
                        <Plus className="h-3.5 w-3.5 text-muted-foreground/40" />
                    </button>
                    <button className="cursor-pointer hover:text-sky-400 transition-colors">
                        <Eye className="h-3.5 w-3.5 text-sky-500" />
                    </button>
                </div>
            </div>
            <CollapsibleContent className="ml-7 mt-1 space-y-1 pb-2 text-[12px] text-muted-foreground">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

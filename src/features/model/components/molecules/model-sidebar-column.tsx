"use client";

import React, { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

interface ModelSidebarColumnProps {
    name: string;
    type: string;
    id?: string;
    isHidden?: boolean;
    onToggleVisibility?: () => void;
}

export function ModelSidebarColumn({
    name,
    type,
    id,
    isHidden = false,
    onToggleVisibility,
}: ModelSidebarColumnProps) {
    return (
        <div className="group flex items-center gap-2 rounded px-1.5 py-0.5 hover:bg-foreground/5 transition-colors">
            <button
                className={cn(
                    "min-w-0 flex-1 truncate text-left cursor-pointer transition-opacity",
                    isHidden ? "opacity-40" : "opacity-100"
                )}
                id={id}
            >
                <span className="text-muted-foreground text-xs">{name}</span>{" "}
                <span className="text-muted-foreground/50 font-mono text-xs">{type}</span>
            </button>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility?.();
                }}
                className={cn(
                    "opacity-0 group-hover:opacity-100 transition-all hover:text-sky-500",
                    isHidden && "opacity-100 text-muted-foreground/40"
                )}
            >
                {isHidden ? (
                    <EyeOff className="h-3 w-3" />
                ) : (
                    <Eye className="h-3 w-3" />
                )}
            </button>
        </div>
    );
}

interface ModelSidebarSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function ModelSidebarSection({
    title,
    children,
    defaultOpen = true,
}: ModelSidebarSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full mt-1.5 first:mt-0">
            <CollapsibleTrigger asChild>
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors py-1 group/section">
                    <ChevronRight
                        className={cn(
                            "h-3 w-3 text-muted-foreground/50 transition-transform duration-200",
                            isOpen && "rotate-90 text-muted-foreground"
                        )}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 group-hover/section:text-foreground/80">
                        {title}
                    </span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-2.5 space-y-0.5 overflow-hidden transition-all duration-300">
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

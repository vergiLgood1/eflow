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
    <div className="group hover:bg-foreground/5 flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors">
      <button
        className={cn(
          "min-w-0 flex-1 cursor-pointer truncate text-left transition-opacity",
          isHidden ? "opacity-40" : "opacity-100",
        )}
        id={id}
      >
        <span className="text-muted-foreground text-xs">{name}</span>{" "}
        <span className="text-muted-foreground/50 font-mono text-xs">
          {type}
        </span>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility?.();
        }}
        className={cn(
          "opacity-0 transition-all group-hover:opacity-100 hover:text-sky-500",
          isHidden && "text-muted-foreground/40 opacity-100",
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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="mt-1.5 w-full first:mt-0"
    >
      <CollapsibleTrigger asChild>
        <div className="hover:text-foreground group/section flex cursor-pointer items-center gap-1 py-1 transition-colors">
          <ChevronRight
            className={cn(
              "text-muted-foreground/50 h-3 w-3 transition-transform duration-200",
              isOpen && "text-muted-foreground rotate-90",
            )}
          />
          <span className="text-muted-foreground/60 group-hover/section:text-foreground/80 text-[10px] font-bold tracking-widest uppercase">
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

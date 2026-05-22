import React from "react";
import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";

interface ModelTabItemProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

export function ModelTabItem({
  label,
  isActive = false,
  onClick,
  onClose,
}: ModelTabItemProps) {
  return (
    <div
      className={cn(
        "group relative flex h-[30px] cursor-pointer items-center gap-2 rounded-t-md border-x border-t px-3 text-[12px] transition-all",
        isActive
          ? "bg-background border-border text-foreground z-10 font-semibold shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
          : "bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground/80 border-transparent",
      )}
      onClick={onClick}
    >
      <span className="max-w-[120px] truncate select-none">{label}</span>

      {onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={cn(
            "hover:bg-foreground/10 ml-1 rounded-sm p-0.5 transition-colors",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}

      {isActive && (
        <div className="bg-primary absolute right-0 -bottom-px left-0 h-[2px]" />
      )}
    </div>
  );
}

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
                "group flex h-[30px] items-center gap-2 rounded-t-md px-3 text-[12px] cursor-pointer transition-all relative border-x border-t",
                isActive
                    ? "bg-background border-border text-foreground font-semibold shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-10"
                    : "bg-muted/20 border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground/80"
            )}
            onClick={onClick}
        >
            <span className="max-w-[120px] truncate select-none">
                {label}
            </span>
            
            {onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className={cn(
                        "ml-1 p-0.5 rounded-sm hover:bg-foreground/10 transition-colors",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                >
                    <X className="h-2.5 w-2.5" />
                </button>
            )}

            {isActive && (
                <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-primary" />
            )}
        </div>
    );
}

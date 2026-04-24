import React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface WorkspaceSidebarItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
}

export function WorkspaceSidebarItem({
    icon,
    label,
    isActive,
    onClick,
    className,
}: WorkspaceSidebarItemProps) {
    return (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            size="sm"
            className={cn(
                "w-full justify-start gap-3 h-10 px-3",
                !isActive && "text-muted-foreground hover:text-foreground",
                className
            )}
            onClick={onClick}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </Button>
    );
}

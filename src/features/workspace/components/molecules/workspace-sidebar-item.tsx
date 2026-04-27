import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import React from "react";

interface WorkspaceSidebarItemProps {
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
    href?: string;
}

export function WorkspaceSidebarItem({
    icon,
    label,
    isActive,
    onClick,
    className,
    href,
}: WorkspaceSidebarItemProps) {
    const content = (
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
            <span className="text-sm font-medium truncate">{label}</span>
        </Button>
    );

    if (href) {
        return (
            <Link href={href} className="block w-full">
                {content}
            </Link>
        );
    }

    return content;
}

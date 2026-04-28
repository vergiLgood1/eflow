import React from "react";

interface ModelSidebarColumnProps {
    name: string;
    type: string;
    id?: string;
}

export function ModelSidebarColumn({
    name,
    type,
    id,
}: ModelSidebarColumnProps) {
    return (
        <div className="group flex items-center gap-1">
            <button
                className="min-w-0 flex-1 truncate text-left hover:text-foreground cursor-pointer"
                id={id}
            >
                {name} <span className="text-muted-foreground/50">{type}</span>
            </button>
        </div>
    );
}

interface ModelSidebarSectionProps {
    title: string;
    children: React.ReactNode;
}

export function ModelSidebarSection({
    title,
    children,
}: ModelSidebarSectionProps) {
    return (
        <>
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground/50">›</span>
                <span>{title}</span>
            </div>
            <div className="ml-5 space-y-0.5">{children}</div>
        </>
    );
}

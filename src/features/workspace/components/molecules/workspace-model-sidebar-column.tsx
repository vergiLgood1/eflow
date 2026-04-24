import React from "react";

interface WorkspaceModelSidebarColumnProps {
    name: string;
    type: string;
    id?: string;
}

export function WorkspaceModelSidebarColumn({
    name,
    type,
    id,
}: WorkspaceModelSidebarColumnProps) {
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

interface WorkspaceModelSidebarSectionProps {
    title: string;
    children: React.ReactNode;
}

export function WorkspaceModelSidebarSection({
    title,
    children,
}: WorkspaceModelSidebarSectionProps) {
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

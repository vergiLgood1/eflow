import React from "react";
import { WorkspaceHeader } from "../organisms/workspace-header";
import { WorkspaceSidebar } from "../organisms/workspace-sidebar";

interface WorkspaceLayoutTemplateProps {
    children: React.ReactNode;
    userName: string;
}

export function WorkspaceLayoutTemplate({
    children,
    userName,
}: WorkspaceLayoutTemplateProps) {
    return (
        <div className="h-full flex flex-col min-w-0 overflow-hidden">
            <WorkspaceHeader userName={userName} />
            <div className="flex-1 flex overflow-hidden">
                <WorkspaceSidebar />
                <main className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

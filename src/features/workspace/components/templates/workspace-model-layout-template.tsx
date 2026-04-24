import React from "react";
import { WorkspaceHeader } from "../organisms/workspace-header";
import { WorkspaceModelSidebar } from "../organisms/workspace-model-sidebar";
import { WorkspaceModelToolbar } from "../organisms/workspace-model-toolbar";

interface WorkspaceLayoutTemplateProps {
    children: React.ReactNode;
    userName: string;
}

export function WorkspaceModelLayoutTemplate({
    children,
    userName,
}: WorkspaceLayoutTemplateProps) {
    return (
        <div className="h-screen flex flex-col min-w-0 overflow-hidden bg-background">
            {/* Main Application Header */}
            <WorkspaceHeader userName={userName} />

            <div className="flex-1 flex overflow-hidden">
                {/* Model Navigation Sidebar */}
                <WorkspaceModelSidebar />

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col relative bg-muted/10">
                    {/* Secondary Toolbars (Tabs & Actions) */}
                    <WorkspaceModelToolbar />

                    {/* Canvas / Editor View */}
                    <div className="flex-1 relative overflow-hidden">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

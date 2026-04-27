import React from "react";
import { WorkspaceHeader } from "../organisms/workspace-header";
import { WorkspaceModelSidebar } from "../organisms/workspace-model-sidebar";
import { WorkspaceModelToolbar } from "../organisms/workspace-model-toolbar";

import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceChatPanel } from "../organisms/workspace-chat-panel";

interface WorkspaceModelLayoutTemplateProps {
    children: React.ReactNode;
    userName: string;
    workspacesPromise: Promise<Workspace[]>;
    modelsPromise: Promise<DataModel[]>;
}

export function WorkspaceModelLayoutTemplate({
    children,
    userName,
    workspacesPromise,
    modelsPromise,
}: WorkspaceModelLayoutTemplateProps) {
    return (
        <div className="h-screen flex flex-col min-w-0 overflow-hidden bg-background">
            {/* Main Application Header */}
            <WorkspaceHeader
                workspacesPromise={workspacesPromise}
                modelsPromise={modelsPromise}
                userName={userName}
            />

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

                <WorkspaceChatPanel />
            </div>
        </div>
    );
}

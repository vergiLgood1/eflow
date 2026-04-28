import React from "react";
import { WorkspaceHeader } from "@/features/workspace/components/organisms/workspace-header";
import { ModelSidebar } from "../organisms/model-sidebar";
import { ModelToolbar } from "../organisms/model-toolbar";

import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceChatPanel } from "@/features/workspace/components/organisms/workspace-chat-panel";

interface ModelLayoutTemplateProps {
    children: React.ReactNode;
    userName: string;
    workspaces: Workspace[];
    models: DataModel[];
}

export function ModelLayoutTemplate({
    children,
    userName,
    workspaces,
    models,
}: ModelLayoutTemplateProps) {
    return (
        <div className="h-screen flex flex-col min-w-0 overflow-hidden bg-background">
            {/* Main Application Header */}
            <WorkspaceHeader
                workspaces={workspaces}
                models={models}
                userName={userName}
            />

            <div className="flex-1 flex overflow-hidden">
                {/* Model Navigation Sidebar */}
                <ModelSidebar />

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col relative bg-muted/10">
                    {/* Secondary Toolbars (Tabs & Actions) */}
                    <ModelToolbar />

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

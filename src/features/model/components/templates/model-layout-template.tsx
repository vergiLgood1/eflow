"use client"

import { WorkspaceHeader } from "@/features/workspace/components/organisms/workspace-header";
import { Tabs } from "@/shared/components/ui/tabs";
import { ReactFlowProvider } from "@xyflow/react";
import React from "react";
import { useWorkspaceStore } from "../../store/use-workspace-store";
import { ModelSidebar } from "../organisms/model-sidebar";
import { ModelToolbar } from "../organisms/model-toolbar";

import { DbmlPanel } from "../organisms/dbml-panel";
import { WorkspaceChatPanel } from "@/features/workspace/components/organisms/workspace-chat-panel";
import type { DataModel, Workspace } from "../../../../../prisma/generated";

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
    const { activeTabId, setActiveTab } = useWorkspaceStore();

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
                <ReactFlowProvider>
                    <Tabs
                        value={activeTabId || ""}
                        onValueChange={setActiveTab}
                        className="flex-1 min-w-0 flex flex-col relative bg-muted/10"
                    >
                        {/* Secondary Toolbars (Tabs & Actions) */}
                        <ModelToolbar />

                        {/* Canvas / Editor View Area */}
                        <div className="flex-1 flex relative overflow-hidden">
                            <DbmlPanel />
                            <div className="flex-1 relative overflow-hidden">
                                {activeTabId ? (
                                    <div className="h-full w-full">
                                        {children}
                                    </div>
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground italic">
                                        No active workspace. Create one from the toolbar.
                                    </div>
                                )}
                            </div>
                        </div>
                    </Tabs>
                </ReactFlowProvider>

                <WorkspaceChatPanel />
            </div>
        </div>
    );
}

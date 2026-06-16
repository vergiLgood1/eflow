"use client";

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
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription.action";

interface ModelLayoutTemplateProps {
  children: React.ReactNode;
  userName: string;
  workspaces: Workspace[];
  models: DataModel[];
  subscriptionAccess: SubscriptionAccess | null;
}

export function ModelLayoutTemplate({
  children,
  userName,
  workspaces,
  models,
  subscriptionAccess,
}: ModelLayoutTemplateProps) {
  const { activeTabId, setActiveTab } = useWorkspaceStore();

  return (
    <div className="bg-background flex h-screen min-w-0 flex-col overflow-hidden">
      {/* Main Application Header */}
      <WorkspaceHeader
        workspaces={workspaces}
        models={models}
        userName={userName}
        subscriptionAccess={subscriptionAccess}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Model Navigation Sidebar */}
        <ModelSidebar />

        {/* Main Content Area */}
        <ReactFlowProvider>
          <Tabs
            value={activeTabId || ""}
            onValueChange={setActiveTab}
            className="bg-muted/10 relative flex min-w-0 flex-1 flex-col"
          >
            {/* Secondary Toolbars (Tabs & Actions) */}
            <ModelToolbar />

            {/* Canvas / Editor View Area */}
            <div className="relative flex flex-1 overflow-hidden">
              <DbmlPanel />
              <div className="relative flex-1 overflow-hidden">
                {activeTabId ? (
                  <div className="h-full w-full">{children}</div>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center italic">
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

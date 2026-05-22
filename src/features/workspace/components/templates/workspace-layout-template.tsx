import { ScrollArea } from "@/shared/components/ui/scroll-area";
import React from "react";
import { WorkspaceHeader } from "../organisms/workspace-header";
import { WorkspaceSidebar } from "../organisms/workspace-sidebar";

import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceChatPanel } from "../organisms/workspace-chat-panel";

interface WorkspaceLayoutTemplateProps {
  children: React.ReactNode;
  userName: string;
  workspaces: Workspace[];
  models: DataModel[];
}

export function WorkspaceLayoutTemplate({
  children,
  userName,
  workspaces,
  models,
}: WorkspaceLayoutTemplateProps) {
  return (
    <div className="bg-background flex h-screen min-w-0 flex-col overflow-hidden">
      <WorkspaceHeader
        userName={userName}
        workspaces={workspaces}
        models={models}
      />
      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar models={models} />
        <main className="relative min-w-0 flex-1">
          <ScrollArea className="h-full w-full">{children}</ScrollArea>
        </main>
        <WorkspaceChatPanel />
      </div>
    </div>
  );
}

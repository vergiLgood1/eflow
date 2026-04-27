import { ScrollArea } from "@/shared/components/ui/scroll-area";
import React from "react";
import { WorkspaceHeader } from "../organisms/workspace-header";
import { WorkspaceSidebar } from "../organisms/workspace-sidebar";

import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceChatPanel } from "../organisms/workspace-chat-panel";

interface WorkspaceLayoutTemplateProps {
    children: React.ReactNode;
    userName: string;
    workspacesPromise?: Promise<Workspace[]>;
    modelsPromise?: Promise<DataModel[]>;
}

export function WorkspaceLayoutTemplate({
    children,
    userName,
    workspacesPromise,
    modelsPromise,
}: WorkspaceLayoutTemplateProps) {
    return (
        <div className="h-screen flex flex-col min-w-0 overflow-hidden bg-background">
            <WorkspaceHeader
                userName={userName}
                workspacesPromise={workspacesPromise}
                modelsPromise={modelsPromise}
            />
            <div className="flex-1 flex overflow-hidden">
                <WorkspaceSidebar />
                <main className="flex-1 min-w-0 relative">
                    <ScrollArea className="h-full w-full">
                        {children}
                    </ScrollArea>
                </main>
                <WorkspaceChatPanel />
            </div>
        </div>
    );
}

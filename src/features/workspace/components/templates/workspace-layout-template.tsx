import React from "react";
import { WorkspaceHeader } from "../organisms/workspace-header";
import { WorkspaceSidebar } from "../organisms/workspace-sidebar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

import { WorkspaceChatPanel } from "../organisms/workspace-chat-panel";

interface WorkspaceLayoutTemplateProps {
    children: React.ReactNode;
    userName: string;
}

export function WorkspaceLayoutTemplate({
    children,
    userName,
}: WorkspaceLayoutTemplateProps) {
    return (
        <div className="h-screen flex flex-col min-w-0 overflow-hidden bg-background">
            <WorkspaceHeader userName={userName} />
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

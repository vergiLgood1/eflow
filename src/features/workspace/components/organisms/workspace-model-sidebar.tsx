import React from "react";
import { WorkspaceModelSearchInput } from "../molecules/workspace-model-search-input";
import { WorkspaceModelSidebarTable } from "../molecules/workspace-model-sidebar-table";
import {
    WorkspaceModelSidebarColumn,
    WorkspaceModelSidebarSection,
} from "../molecules/workspace-model-sidebar-column";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function WorkspaceModelSidebar() {
    return (
        <aside className="flex w-[280px] flex-col bg-card border-r text-foreground h-full overflow-hidden">
            <div className="px-3 pt-3 pb-2">
                <WorkspaceModelSearchInput />
            </div>
            <ScrollArea className="flex-1">
                <div className="px-1 pb-2">
                    <WorkspaceModelSidebarTable name="addresses" isOpen={true}>
                        <WorkspaceModelSidebarSection title="Columns">
                            <WorkspaceModelSidebarColumn name="id" type="bigint" />
                            <WorkspaceModelSidebarColumn name="chain" type="varchar" />
                            <WorkspaceModelSidebarColumn name="address" type="varchar" />
                            <WorkspaceModelSidebarColumn name="key_id" type="uuid" />
                            <WorkspaceModelSidebarColumn name="public_key" type="bytea" />
                            <WorkspaceModelSidebarColumn name="type" type="varchar" />
                            <WorkspaceModelSidebarColumn name="nonce" type="bigint" />
                            <WorkspaceModelSidebarColumn name="created_at" type="bigint" />
                            <WorkspaceModelSidebarColumn name="last_updated" type="bigint" />
                        </WorkspaceModelSidebarSection>
                        <WorkspaceModelSidebarSection title="Foreign keys (0)">
                            {null}
                        </WorkspaceModelSidebarSection>
                    </WorkspaceModelSidebarTable>

                    <WorkspaceModelSidebarTable name="blocks" />
                    <WorkspaceModelSidebarTable name="tokens" />
                    <WorkspaceModelSidebarTable name="transactions" />
                </div>

                <div className="border-t mt-2">
                    <div className="flex flex-col gap-2 px-3 py-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                                Procedures
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 hover:bg-accent"
                                disabled
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <div className="py-6 text-center text-xs text-muted-foreground">
                            No procedures yet.
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}

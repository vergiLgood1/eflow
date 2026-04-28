"use client";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useCanvasStore } from "../../store/use-canvas-store";
import { isTableNode } from "../../types/canvas";
import { ModelSearchInput } from "../molecules/model-search-input";
import { ModelSidebarColumn, ModelSidebarSection } from "../molecules/model-sidebar-column";

import { ModelSidebarTable } from "../molecules/model-sidebar-table";

export function ModelSidebar() {
    const nodes = useCanvasStore((s) => s.nodes);
    const tableNodes = nodes.filter(isTableNode);

    return (
        <aside className="flex w-[280px] flex-col bg-card border-r text-foreground h-full overflow-hidden">
            <div className="px-3 pt-3 pb-2">
                <ModelSearchInput />
            </div>
            <ScrollArea className="flex-1">
                <div className="px-1 pb-2">
                    {tableNodes.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground">
                            No tables yet. Add one from the toolbar.
                        </div>
                    ) : (
                        tableNodes.map((node) => (
                            <ModelSidebarTable key={node.id} name={node.data.name} isOpen={true}>
                                <ModelSidebarSection title="Columns">
                                    {node.data.columns?.map((col) => (
                                        <ModelSidebarColumn
                                            key={col.id}
                                            name={col.name}
                                            type={col.type}
                                        />
                                    ))}
                                </ModelSidebarSection>
                            </ModelSidebarTable>
                        ))
                    )}
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

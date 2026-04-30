"use client";

import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useCanvasStore } from "../../store/use-canvas-store";
import { isTableNode } from "../../types/canvas";
import { ModelSearchInput } from "../molecules/model-search-input";
import { ModelSidebarColumn, ModelSidebarSection } from "../molecules/model-sidebar-column";
import { ModelSidebarTable } from "../molecules/model-sidebar-table";
import { useState } from "react";

export function ModelSidebar() {
    const nodes = useCanvasStore((s) => s.nodes);
    const updateNode = useCanvasStore((s) => s.updateNode);
    const updateNodeData = useCanvasStore((s) => s.updateNodeData);
    
    const tableNodes = nodes.filter(isTableNode);

    // Sidebar UI state
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});

    const filteredTables = tableNodes.filter((node) =>
        node.data.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleTableExpansion = (id: string) => {
        setExpandedTables((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const toggleTableVisibility = (id: string, currentHidden: boolean) => {
        updateNode(id, { hidden: !currentHidden });
    };

    const toggleColumnVisibility = (nodeId: string, colId: string, hiddenColumns: string[] = []) => {
        const isHidden = hiddenColumns.includes(colId);
        const nextHidden = isHidden 
            ? hiddenColumns.filter(id => id !== colId)
            : [...hiddenColumns, colId];
        
        updateNodeData(nodeId, { hiddenColumns: nextHidden });
    };

    return (
        <aside className="flex w-[280px] flex-col bg-card border-r text-foreground h-full overflow-hidden">
            <div className="px-3 pt-3 pb-2">
                <ModelSearchInput 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <ScrollArea className="flex-1">
                <div className="px-1 pb-2">
                    {tableNodes.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground">
                            No tables yet. Add one from the toolbar.
                        </div>
                    ) : filteredTables.length === 0 ? (
                        <div className="py-6 text-center text-xs text-muted-foreground italic">
                            No tables matching &quot;{searchQuery}&quot;
                        </div>
                    ) : (
                        filteredTables.map((node) => {
                            const hiddenColumns = (node.data.hiddenColumns as string[]) || [];
                            const isExpanded = expandedTables[node.id] ?? false;

                            return (
                                <ModelSidebarTable 
                                    key={node.id} 
                                    name={node.data.name} 
                                    isOpen={isExpanded}
                                    onToggle={() => toggleTableExpansion(node.id)}
                                    isHidden={node.hidden}
                                    onToggleVisibility={() => toggleTableVisibility(node.id, !!node.hidden)}
                                >
                                    <ModelSidebarSection title="Columns">
                                        {node.data.columns?.map((col) => (
                                            <ModelSidebarColumn
                                                key={col.id}
                                                name={col.name}
                                                type={col.type}
                                                isHidden={hiddenColumns.includes(col.id)}
                                                onToggleVisibility={() => toggleColumnVisibility(node.id, col.id, hiddenColumns)}
                                            />
                                        ))}
                                    </ModelSidebarSection>
                                    
                                    <ModelSidebarSection title="Indexes" defaultOpen={false}>
                                        <div className="py-1 px-2 text-[10px] text-muted-foreground italic">
                                            No indexes defined
                                        </div>
                                    </ModelSidebarSection>

                                    <ModelSidebarSection title="Triggers" defaultOpen={false}>
                                        <div className="py-1 px-2 text-[10px] text-muted-foreground italic">
                                            No triggers defined
                                        </div>
                                    </ModelSidebarSection>
                                </ModelSidebarTable>
                            );
                        })
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

"use client";

import { Separator } from "@/shared/components/ui/separator";
import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useReactFlow } from "@xyflow/react";
import {
    Activity,
    ChevronLeft,
    Clock,
    CodeXml,
    Download,
    FileCode,
    Layers,
    MousePointer2,
    Plus,
    Redo2,
    Settings,
    Square,
    Table2,
    Undo2,
    Upload,
    Users,
    X,
    ZoomIn,
    ZoomOut
} from "lucide-react";
import { useState } from "react";
import { useCanvasStore, type CanvasTool } from "../../store/use-canvas-store";
import { useWorkspaceStore } from "../../store/use-workspace-store";
import { ModelRelationIcon } from "../atoms/model-relation-icon";
import { ModelToolbarButton } from "../atoms/model-toolbar-button";
import { ModelUserAvatar } from "../molecules/model-user-avatar";

const ACTIVE_TOOL_CLASS =
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80";

export function ModelToolbar() {
    const activeTool = useCanvasStore((s) => s.activeTool);
    const setActiveTool = useCanvasStore((s) => s.setActiveTool);

    const { tabs, activeTabId, setActiveTab, closeTab, addTab, renameTab } =
        useWorkspaceStore();

    const { zoomIn, zoomOut } = useReactFlow();
    const { 
        undo, 
        redo, 
        toggleAnimation, 
        isAnimated, 
        history, 
        future 
    } = useCanvasStore();

    const [editingTabId, setEditingTabId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    const handleToolClick = (tool: CanvasTool) => {
        setActiveTool(activeTool === tool ? "select" : tool);
    };

    const handleRenameSubmit = (id: string) => {
        if (editingName.trim()) {
            renameTab(id, editingName.trim());
        }
        setEditingTabId(null);
    };

    return (
        <div className="flex flex-col bg-card">
            {/* ================= TAB BAR ================= */}
            <div className="flex h-10 items-end gap-1 px-2 py-1 border-b bg-muted/10 select-none overflow-hidden">
                <ModelToolbarButton
                    tooltip="Back"
                    icon={<ChevronLeft className="h-4 w-4" />}
                />

                <ModelToolbarButton
                    tooltip="Add new workspace"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => addTab({ name: "new_tab", type: "diagram" })}
                />

                <TabsList className="bg-transparent p-0 gap-1 h-full items-end no-scrollbar">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            onDoubleClick={() => {
                                setEditingTabId(tab.id);
                                setEditingName(tab.name);
                            }}
                            className="group relative bg-transparent border-0 rounded-b-none  no-scrollbar"
                        >
                            {/* Tab Label */}
                            {editingTabId === tab.id ? (
                                <input
                                    autoFocus
                                    className="h-6 w-24 rounded border border-primary bg-background px-1 text-[12px] focus:outline-none"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => handleRenameSubmit(tab.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleRenameSubmit(tab.id);
                                        if (e.key === "Escape") setEditingTabId(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="max-w-[120px] truncate text-[12px] font-semibold">
                                    {tab.name}
                                </span>
                            )}

                            {/* Close Button */}
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(tab.id);
                                }}
                                className="p-0.5 rounded-sm hover:bg-foreground/10 transition-all opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 cursor-pointer"
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </span>

                            {/* Active underline indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* ================= ACTION BAR ================= */}
            <div className="flex h-12 items-center gap-2 bg-background px-2 text-foreground overflow-x-auto no-scrollbar">
                <div className="flex min-w-0 flex-1 items-center gap-1">
                    <ModelToolbarButton tooltip="Settings" icon={<Settings className="h-4 w-4" />} />
                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton
                        tooltip="Cursor"
                        icon={<MousePointer2 className="h-4 w-4" />}
                        className={activeTool === "select" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => setActiveTool("select")}
                    />
                    <ModelToolbarButton
                        tooltip="Add Table (click canvas to place)"
                        icon={<Table2 className="h-4 w-4" />}
                        className={activeTool === "table" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("table")}
                    />

                    <ModelToolbarButton
                        tooltip="One to One"
                        label="1:1"
                        className={activeTool === "rel-1-1" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("rel-1-1")}
                    >
                        <ModelRelationIcon type="1:1" />
                    </ModelToolbarButton>
                    <ModelToolbarButton
                        tooltip="One to Many"
                        label="1:n"
                        className={activeTool === "rel-1-n" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("rel-1-n")}
                    >
                        <ModelRelationIcon type="1:n" />
                    </ModelToolbarButton>
                    <ModelToolbarButton
                        tooltip="One to One (optional)"
                        label="0..1"
                        className={activeTool === "rel-0-1" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("rel-0-1")}
                    >
                        <ModelRelationIcon type="0..1" />
                    </ModelToolbarButton>
                    <ModelToolbarButton
                        tooltip="One to Many (optional)"
                        label="0..n"
                        className={activeTool === "rel-0-n" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("rel-0-n")}
                    >
                        <ModelRelationIcon type="0..n" />
                    </ModelToolbarButton>
                    <ModelToolbarButton
                        tooltip="Many to Many"
                        label="n:n"
                        className={activeTool === "rel-n-n" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("rel-n-n")}
                    >
                        <ModelRelationIcon type="n:n" />
                    </ModelToolbarButton>

                    <ModelToolbarButton
                        tooltip="Note (click canvas to place)"
                        icon={<Square className="h-4 w-4" />}
                        className={activeTool === "note" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("note")}
                    />
                    <ModelToolbarButton tooltip="Group" icon={<Layers className="h-4 w-4" />} />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton tooltip="Import SQL" icon={<Upload className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="Export SQL" icon={<Download className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="Import DBML" icon={<FileCode className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="DBML Mode" icon={<CodeXml className="h-4 w-4" />} />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton
                        tooltip="Undo (Ctrl+Z)"
                        icon={<Undo2 className="h-4 w-4" />}
                        onClick={undo}
                        disabled={history.length === 0}
                    />
                    <ModelToolbarButton
                        tooltip="Redo (Ctrl+Y)"
                        icon={<Redo2 className="h-4 w-4" />}
                        onClick={redo}
                        disabled={future.length === 0}
                    />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton
                        tooltip="Zoom In"
                        icon={<ZoomIn className="h-4 w-4" />}
                        onClick={() => zoomIn()}
                    />
                    <ModelToolbarButton
                        tooltip="Zoom Out"
                        icon={<ZoomOut className="h-4 w-4" />}
                        onClick={() => zoomOut()}
                    />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton
                        tooltip="Animated Relationships"
                        icon={<Activity className="h-4 w-4" />}
                        onClick={toggleAnimation}
                        className={isAnimated ? ACTIVE_TOOL_CLASS : undefined}
                    />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <ModelToolbarButton tooltip="Share" icon={<Users className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="Activity" icon={<Clock className="h-4 w-4" />} />
                    <ModelUserAvatar name="Diyo Anggara" />
                </div>
            </div>
        </div>
    );
}
"use client";

import { Separator } from "@/shared/components/ui/separator";
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
    TableProperties,
    Undo2,
    Upload,
    Users,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { useCanvasStore, type CanvasTool } from "../../store/use-canvas-store";
import { ModelRelationIcon } from "../atoms/model-relation-icon";
import { ModelToolbarButton } from "../atoms/model-toolbar-button";
import { ModelTabItem } from "../molecules/model-tab-item";
import { ModelUserAvatar } from "../molecules/model-user-avatar";


const ACTIVE_TOOL_CLASS = "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80";

export function ModelToolbar() {
    const activeTool = useCanvasStore((s) => s.activeTool);
    const setActiveTool = useCanvasStore((s) => s.setActiveTool);

    const handleToolClick = (tool: CanvasTool) => {
        setActiveTool(activeTool === tool ? "select" : tool);
    };

    return (
        <div className="flex flex-col border-b bg-card">
            {/* Tab Bar */}
            <div className="flex h-10 items-center gap-2 px-2 border-b">
                <ModelToolbarButton tooltip="Back" icon={<ChevronLeft className="h-4 w-4" />} />
                <ModelToolbarButton tooltip="Add new workspace" icon={<Plus className="h-4 w-4" />} disabled />
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex items-center gap-2">
                        <ModelTabItem label="client" isActive />
                    </div>
                </div>
            </div>

            {/* Action Bar */}
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
                        tooltip="Add View (click canvas to place)"
                        icon={<TableProperties className="h-4 w-4" />}
                        className={activeTool === "view" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("view")}
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

                    <ModelToolbarButton tooltip="Undo" icon={<Undo2 className="h-4 w-4" />} disabled />
                    <ModelToolbarButton tooltip="Redo" icon={<Redo2 className="h-4 w-4" />} disabled />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton tooltip="Zoom In" icon={<ZoomIn className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="Zoom Out" icon={<ZoomOut className="h-4 w-4" />} />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ModelToolbarButton tooltip="Animated Relationships" icon={<Activity className="h-4 w-4" />} />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <ModelToolbarButton tooltip="Share" icon={<Users className="h-4 w-4" />} />
                    <ModelToolbarButton tooltip="Diagram Activity" icon={<Clock className="h-4 w-4" />} />
                    <ModelUserAvatar name="Diyo Anggara" />
                </div>
            </div>
        </div>
    );
}

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
import { WorkspaceModelRelationIcon } from "../atoms/workspace-model-relation-icon";
import { WorkspaceModelToolbarButton } from "../atoms/workspace-model-toolbar-button";
import { WorkspaceModelTabItem } from "../molecules/workspace-model-tab-item";
import { WorkspaceModelUserAvatar } from "../molecules/workspace-model-user-avatar";

const ACTIVE_TOOL_CLASS = "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80";

export function WorkspaceModelToolbar() {
    const activeTool = useCanvasStore((s) => s.activeTool);
    const setActiveTool = useCanvasStore((s) => s.setActiveTool);

    const handleToolClick = (tool: CanvasTool) => {
        setActiveTool(activeTool === tool ? "select" : tool);
    };

    return (
        <div className="flex flex-col border-b bg-card">
            {/* Tab Bar */}
            <div className="flex h-10 items-center gap-2 px-2 border-b">
                <WorkspaceModelToolbarButton tooltip="Back" icon={<ChevronLeft className="h-4 w-4" />} />
                <WorkspaceModelToolbarButton tooltip="Add new workspace" icon={<Plus className="h-4 w-4" />} disabled />
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex items-center gap-2">
                        <WorkspaceModelTabItem label="client" isActive />
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex h-12 items-center gap-2 bg-background px-2 text-foreground overflow-x-auto no-scrollbar">
                <div className="flex min-w-0 flex-1 items-center gap-1">
                    <WorkspaceModelToolbarButton tooltip="Settings" icon={<Settings className="h-4 w-4" />} />
                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <WorkspaceModelToolbarButton
                        tooltip="Cursor"
                        icon={<MousePointer2 className="h-4 w-4" />}
                        className={activeTool === "select" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => setActiveTool("select")}
                    />
                    <WorkspaceModelToolbarButton
                        tooltip="Add Table (click canvas to place)"
                        icon={<Table2 className="h-4 w-4" />}
                        className={activeTool === "table" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("table")}
                    />
                    <WorkspaceModelToolbarButton
                        tooltip="Add View (click canvas to place)"
                        icon={<TableProperties className="h-4 w-4" />}
                        className={activeTool === "view" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("view")}
                    />

                    <WorkspaceModelToolbarButton tooltip="One to One" label="1:1">
                        <WorkspaceModelRelationIcon type="1:1" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="One to Many" label="1:n">
                        <WorkspaceModelRelationIcon type="1:n" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="One to One (optional)" label="0..1">
                        <WorkspaceModelRelationIcon type="0..1" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="One to Many (optional)" label="0..n">
                        <WorkspaceModelRelationIcon type="0..n" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="Many to Many" label="n:n">
                        <WorkspaceModelRelationIcon type="n:n" />
                    </WorkspaceModelToolbarButton>

                    <WorkspaceModelToolbarButton
                        tooltip="Note (click canvas to place)"
                        icon={<Square className="h-4 w-4" />}
                        className={activeTool === "note" ? ACTIVE_TOOL_CLASS : undefined}
                        onClick={() => handleToolClick("note")}
                    />
                    <WorkspaceModelToolbarButton tooltip="Group" icon={<Layers className="h-4 w-4" />} />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <WorkspaceModelToolbarButton tooltip="Import SQL" icon={<Upload className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Export SQL" icon={<Download className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Import DBML" icon={<FileCode className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="DBML Mode" icon={<CodeXml className="h-4 w-4" />} />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <WorkspaceModelToolbarButton tooltip="Undo" icon={<Undo2 className="h-4 w-4" />} disabled />
                    <WorkspaceModelToolbarButton tooltip="Redo" icon={<Redo2 className="h-4 w-4" />} disabled />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <WorkspaceModelToolbarButton tooltip="Zoom In" icon={<ZoomIn className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Zoom Out" icon={<ZoomOut className="h-4 w-4" />} />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <WorkspaceModelToolbarButton tooltip="Animated Relationships" icon={<Activity className="h-4 w-4" />} />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <WorkspaceModelToolbarButton tooltip="Share" icon={<Users className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Diagram Activity" icon={<Clock className="h-4 w-4" />} />
                    <WorkspaceModelUserAvatar name="Diyo Anggara" />
                </div>
            </div>
        </div>
    );
}

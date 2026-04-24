// "use client";

import { Separator } from "@/shared/components/ui/separator";
import {
    Activity,
    ChevronLeft,
    Clock,
    CodeXml,
    Cpu,
    Download,
    FileCode,
    Flag,
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
import { WorkspaceModelRelationIcon } from "../atoms/workspace-model-relation-icon";
import { WorkspaceModelToolbarButton } from "../atoms/workspace-model-toolbar-button";
import { WorkspaceModelTabItem } from "../molecules/workspace-model-tab-item";
import { WorkspaceModelUserAvatar } from "../molecules/workspace-model-user-avatar";

export function WorkspaceModelToolbar() {
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
                        tooltip="Move"
                        icon={<MousePointer2 className="h-4 w-4" />}
                        className="bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                    />
                    <WorkspaceModelToolbarButton tooltip="Table" icon={<Table2 className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Table properties" icon={<TableProperties className="h-4 w-4" />} />
                    
                    <WorkspaceModelToolbarButton tooltip="1:1" label="1:1">
                        <WorkspaceModelRelationIcon type="1:1" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="1:n" label="1:n">
                        <WorkspaceModelRelationIcon type="1:n" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="0..1" label="0..1">
                        <WorkspaceModelRelationIcon type="0..1" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="0..n" label="0..n">
                        <WorkspaceModelRelationIcon type="0..n" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton tooltip="n:n" label="n:n">
                        <WorkspaceModelRelationIcon type="n:n" />
                    </WorkspaceModelToolbarButton>
                    
                    <WorkspaceModelToolbarButton tooltip="Diagram" icon={<Square className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Outline" icon={<Layers className="h-4 w-4" />} />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton tooltip="Comment" icon={<Flag className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Upload" icon={<Upload className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Download" icon={<Download className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="File Code" icon={<FileCode className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="CodeXml" icon={<CodeXml className="h-4 w-4" />} />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton tooltip="Undo" icon={<Undo2 className="h-4 w-4" />} disabled />
                    <WorkspaceModelToolbarButton tooltip="Redo" icon={<Redo2 className="h-4 w-4" />} disabled />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton tooltip="Zoom In" icon={<ZoomIn className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Zoom Out" icon={<ZoomOut className="h-4 w-4" />} />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton tooltip="Activity" icon={<Activity className="h-4 w-4" />} />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <WorkspaceModelToolbarButton tooltip="Users" icon={<Users className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="CPU" icon={<Cpu className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton tooltip="Clock" icon={<Clock className="h-4 w-4" />} />
                    <WorkspaceModelUserAvatar name="Diyo Anggara" />
                </div>
            </div>
        </div>
    );
}

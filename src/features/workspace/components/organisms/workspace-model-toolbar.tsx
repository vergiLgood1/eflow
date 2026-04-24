import React from "react";
import {
    ChevronLeft,
    Plus,
    Settings,
    MousePointer2,
    Table2,
    TableProperties,
    Square,
    Layers,
    Flag,
    Upload,
    Download,
    FileCode,
    CodeXml,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Activity,
    Users,
    Cpu,
    Clock,
} from "lucide-react";
import { WorkspaceModelToolbarButton } from "../atoms/workspace-model-toolbar-button";
import { WorkspaceModelRelationIcon } from "../atoms/workspace-model-relation-icon";
import { WorkspaceModelTabItem } from "../molecules/workspace-model-tab-item";
import { WorkspaceModelUserAvatar } from "../molecules/workspace-model-user-avatar";
import { Separator } from "@/shared/components/ui/separator";

export function WorkspaceModelToolbar() {
    return (
        <div className="flex flex-col border-b bg-card">
            {/* Tab Bar */}
            <div className="flex h-10 items-center gap-2 px-2 border-b">
                <WorkspaceModelToolbarButton icon={<ChevronLeft className="h-4 w-4" />} />
                <WorkspaceModelToolbarButton icon={<Plus className="h-4 w-4" />} disabled />
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <div className="flex items-center gap-2">
                        <WorkspaceModelTabItem label="client" isActive />
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex h-12 items-center gap-2 bg-background px-2 text-foreground overflow-x-auto no-scrollbar">
                <div className="flex min-w-0 flex-1 items-center gap-1">
                    <WorkspaceModelToolbarButton icon={<Settings className="h-4 w-4" />} />
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton
                        icon={<MousePointer2 className="h-4 w-4" />}
                        className="bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                    />
                    <WorkspaceModelToolbarButton icon={<Table2 className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<TableProperties className="h-4 w-4" />} />
                    
                    <WorkspaceModelToolbarButton label="1:1">
                        <WorkspaceModelRelationIcon type="1:1" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton label="1:n">
                        <WorkspaceModelRelationIcon type="1:n" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton label="0..1">
                        <WorkspaceModelRelationIcon type="0..1" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton label="0..n">
                        <WorkspaceModelRelationIcon type="0..n" />
                    </WorkspaceModelToolbarButton>
                    <WorkspaceModelToolbarButton label="n:n">
                        <WorkspaceModelRelationIcon type="n:n" />
                    </WorkspaceModelToolbarButton>
                    
                    <WorkspaceModelToolbarButton icon={<Square className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<Layers className="h-4 w-4" />} />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton icon={<Flag className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<Upload className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<Download className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<FileCode className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<CodeXml className="h-4 w-4" />} />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton icon={<Undo2 className="h-4 w-4" />} disabled />
                    <WorkspaceModelToolbarButton icon={<Redo2 className="h-4 w-4" />} disabled />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton icon={<ZoomIn className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<ZoomOut className="h-4 w-4" />} />
                    
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    
                    <WorkspaceModelToolbarButton icon={<Activity className="h-4 w-4" />} />
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Separator orientation="vertical" className="mx-1 h-6" />
                    <WorkspaceModelToolbarButton icon={<Users className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<Cpu className="h-4 w-4" />} />
                    <WorkspaceModelToolbarButton icon={<Clock className="h-4 w-4" />} />
                    <WorkspaceModelUserAvatar name="Diyo Anggara" />
                </div>
            </div>
        </div>
    );
}

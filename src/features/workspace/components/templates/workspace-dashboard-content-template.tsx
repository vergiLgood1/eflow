import { useDebounceValue } from "@/shared/hooks/use-debounce-value";
import { useParams } from "next/navigation";
import React from "react";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceProUpsellCard } from "../molecules/workspace-pro-upsell-card";
import { WorkspaceUpgradeBanner } from "../molecules/workspace-upgrade-banner";
import { WorkspaceDashboardHeader } from "../organisms/workspace-dashboard-header";
import { WorkspaceDiagramList } from "../organisms/workspace-diagram-list";

interface WorkspaceDashboardContentTemplateProps {
    models: DataModel[];
    workspaces: Workspace[];
}

export function WorkspaceDashboardContentTemplate({ models, workspaces }: WorkspaceDashboardContentTemplateProps) {
    const params = useParams();
    const slug = params?.slug as string;
    
    const [searchQuery, setSearchQuery] = React.useState("");
    const [debouncedSearch] = useDebounceValue(searchQuery, 300);
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

    const filteredModels = models.filter(model => 
        model.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const currentWorkspace = workspaces.find(w => w.slug === slug);
    const workspaceName = currentWorkspace?.name || "Workspace";

    return (
        <div className="w-full mx-auto p-6 md:p-10 pb-20">
            <WorkspaceDashboardHeader 
                title={workspaceName} 
                path={`workspaces/${slug}`} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />
            
            <WorkspaceUpgradeBanner />
            
            <WorkspaceDiagramList 
                models={filteredModels} 
                workspaces={workspaces} 
                viewMode={viewMode}
            />
            
            <WorkspaceProUpsellCard />
        </div>
    );
}

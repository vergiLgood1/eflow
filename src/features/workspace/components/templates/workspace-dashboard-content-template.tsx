import { useWorkspaceStore } from "@/features/workspace/store/use-workspace-store";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
    
    // Hydration handling for persisted zustand store
    const [isMounted, setIsMounted] = useState(false);
    const { isBannerVisible, hideBanner } = useWorkspaceStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const filteredModels = models.filter(model => 
        model.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const currentWorkspace = workspaces.find(w => w.slug === slug);
    const workspaceName = currentWorkspace?.name || "Workspace";

    // Mock subscription data - in real app, this would come from a useSubscription hook
    const maxModels = 3; 

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
            
            {isMounted && isBannerVisible && (
                <WorkspaceUpgradeBanner
                    modelCount={models.length}
                    maxModels={maxModels}
                    onDismiss={hideBanner}
                />
            )}
            
            <WorkspaceDiagramList 
                models={filteredModels} 
                workspaces={workspaces} 
                viewMode={viewMode}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery("")}
            />
            
            <WorkspaceProUpsellCard />
        </div>
    );
}

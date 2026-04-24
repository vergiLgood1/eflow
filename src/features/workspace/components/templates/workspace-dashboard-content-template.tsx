import React from "react";
import { WorkspaceDashboardHeader } from "../organisms/workspace-dashboard-header";
import { WorkspaceUpgradeBanner } from "../molecules/workspace-upgrade-banner";
import { WorkspaceDiagramList } from "../organisms/workspace-diagram-list";
import { WorkspaceProUpsellCard } from "../molecules/workspace-pro-upsell-card";

export function WorkspaceDashboardContentTemplate() {
    return (
        <div className="max-w-[1600px] mx-auto p-6 md:p-10 pb-20">
            <WorkspaceDashboardHeader 
                title="workspace" 
                path="workspace/my-workspace12" 
            />
            
            <WorkspaceUpgradeBanner />
            
            <WorkspaceDiagramList />
            
            <WorkspaceProUpsellCard />
        </div>
    );
}

import type { DataModel } from "../../../../../prisma/generated";
import { WorkspaceProUpsellCard } from "../molecules/workspace-pro-upsell-card";
import { WorkspaceUpgradeBanner } from "../molecules/workspace-upgrade-banner";
import { WorkspaceDashboardHeader } from "../organisms/workspace-dashboard-header";
import { WorkspaceDiagramList } from "../organisms/workspace-diagram-list";

interface WorkspaceDashboardContentTemplateProps {
    modelsPromise: Promise<DataModel[]>;
}

export function WorkspaceDashboardContentTemplate({ modelsPromise }: WorkspaceDashboardContentTemplateProps) {
    return (
        <div className="max-w-[1600px] mx-auto p-6 md:p-10 pb-20">
            <WorkspaceDashboardHeader 
                title="workspace" 
                path="workspace/my-workspace12" 
            />
            
            <WorkspaceUpgradeBanner />
            
            <WorkspaceDiagramList modelsPromise={modelsPromise} />
            
            <WorkspaceProUpsellCard />
        </div>
    );
}

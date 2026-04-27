import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { WorkspaceProUpsellCard } from "../molecules/workspace-pro-upsell-card";
import { WorkspaceUpgradeBanner } from "../molecules/workspace-upgrade-banner";
import { WorkspaceDashboardHeader } from "../organisms/workspace-dashboard-header";
import { WorkspaceDiagramList } from "../organisms/workspace-diagram-list";

interface WorkspaceDashboardContentTemplateProps {
    modelsPromise: Promise<DataModel[]>;
    workspacePromise: Promise<Workspace[]>;
}

export function WorkspaceDashboardContentTemplate({ modelsPromise, workspacePromise }: WorkspaceDashboardContentTemplateProps) {
    return (
        <div className="w-full mx-auto p-6 md:p-10 pb-20">
            <WorkspaceDashboardHeader 
                title="workspace" 
                path="workspace/my-workspace12" 
            />
            
            <WorkspaceUpgradeBanner />
            
            <WorkspaceDiagramList modelsPromise={modelsPromise} workspacePromise={workspacePromise} />
            
            <WorkspaceProUpsellCard />
        </div>
    );
}

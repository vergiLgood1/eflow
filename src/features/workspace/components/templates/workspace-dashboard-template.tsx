import { WorkspaceDashboardEmptyState } from "../organisms/workspace-dashboard-empty-state";
import { WorkspaceDashboardContentTemplate } from "./workspace-dashboard-content-template";

interface WorkspaceDashboardTemplateProps {
    hasDiagrams?: boolean;
}

export function WorkspaceDashboardTemplate({
    hasDiagrams = true,
}: WorkspaceDashboardTemplateProps) {
    return (
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
            {hasDiagrams ? (
                <WorkspaceDashboardContentTemplate />
            ) : (
                <WorkspaceDashboardEmptyState />
            )}
        </div>
    );
}

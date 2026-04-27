import { getDataModelsBySlug, getWorkspacesByCurrentUser } from "@/features/workspace/applications/workspace.action";
import { WorkspaceDashboardTemplate } from "@/features/workspace/components/templates/workspace-dashboard-template";

export default async function WorkspaceSlugPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    
    const modelsPromise = getDataModelsBySlug(slug);
    const workspacePromise = getWorkspacesByCurrentUser();

    return <WorkspaceDashboardTemplate modelsPromise={modelsPromise} workspacePromise={workspacePromise} />;
}
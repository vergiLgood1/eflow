import { getDataModelsBySlug } from "@/features/workspace/applications/workspace.action";
import { WorkspaceDashboardTemplate } from "@/features/workspace/components/templates/workspace-dashboard-template";

export default async function WorkspaceSlugPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const modelsPromise = getDataModelsBySlug(slug);

    return <WorkspaceDashboardTemplate modelsPromise={modelsPromise} />;
}
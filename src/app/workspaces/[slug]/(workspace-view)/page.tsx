import { WorkspaceDashboardTemplate } from "@/features/workspace/components/templates/workspace-dashboard-template";
import { getDataModelsBySlug } from "@/features/workspace/applications/workspace.action";

export default async function WorkspaceSlugPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const modelsPromise = getDataModelsBySlug(slug);

    return <WorkspaceDashboardTemplate modelsPromise={modelsPromise} />;
}
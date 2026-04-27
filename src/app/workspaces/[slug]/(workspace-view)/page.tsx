import { getDataModelsBySlug } from "@/features/workspace/applications/workspace.action";
import { WorkspaceDashboardTemplate } from "@/features/workspace/components/templates/workspace-dashboard-template";

export default async function WorkspaceSlugPage({ params }: { params: { slug: string } }) {

    const { slug } = params;
    const modelsPromise = getDataModelsBySlug(slug);

    return <WorkspaceDashboardTemplate modelsPromise={modelsPromise} />;
}
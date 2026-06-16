import {
  getDataModelsBySlug,
  getWorkspacesByCurrentUser,
} from "@/features/workspace/applications/workspace.action";
import { getCurrentUserSubscriptionAccess } from "@/features/subscription/applications/subscription.action";
import { WorkspaceDashboardTemplate } from "@/features/workspace/components/templates/workspace-dashboard-template";

export default async function WorkspaceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const modelsPromise = getDataModelsBySlug(slug);
  const workspacePromise = getWorkspacesByCurrentUser();
  const subscriptionAccessPromise = getCurrentUserSubscriptionAccess();

  return (
    <WorkspaceDashboardTemplate
      modelsPromise={modelsPromise}
      workspacePromise={workspacePromise}
      subscriptionAccessPromise={subscriptionAccessPromise}
    />
  );
}

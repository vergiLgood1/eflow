import { auth } from "@/features/authentication/lib/auth-server";
import {
  getDataModelById,
  getDataModelsBySlug,
  getWorkspacesByCurrentUser,
} from "@/features/workspace/applications/workspace.action";
import { ModelLayoutTemplate } from "@/features/model/components/templates/model-layout-template";
import { redirect, notFound } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const model = await getDataModelById(id);

  if (!model) {
    // If the model doesn't exist or is private and user has no access
    return notFound();
  }

  const session = await auth.getSession();
  const workspaces = await getWorkspacesByCurrentUser();
  const models = await getDataModelsBySlug(slug);

  const userName = session.data?.user?.name || "Guest";

  return (
    <ModelLayoutTemplate
      userName={userName}
      workspaces={workspaces}
      models={models}
    >
      {children}
    </ModelLayoutTemplate>
  );
}

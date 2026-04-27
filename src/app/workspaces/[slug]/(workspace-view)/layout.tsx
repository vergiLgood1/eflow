import { auth } from "@/features/authentication/lib/auth-server";
import { getDataModelsBySlug, getWorkspacesByCurrentUser } from "@/features/workspace/applications/workspace.action";
import { WorkspaceLayoutTemplate } from "@/features/workspace/components/templates/workspace-layout-template";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
        params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Resolve data on the server
    const workspaces = await getWorkspacesByCurrentUser();
    const models = await getDataModelsBySlug(slug);

    const session = await auth.getSession()

    if (!session || !session.data) {
        return redirect("/auth/sign-in")
    }

    const userName = session.data.user.name;

    return (
        <WorkspaceLayoutTemplate
            userName={userName}
            workspaces={workspaces}
            models={models}
        >
            {children}
        </WorkspaceLayoutTemplate>
    );
}
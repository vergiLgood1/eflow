import { auth } from "@/features/authentication/lib/auth-server";
import { getDataModelsBySlug, getWorkspaces } from "@/features/workspace/applications/workspace.action";
import { WorkspaceLayoutTemplate } from "@/features/workspace/components/templates/workspace-layout-template";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode;
        params: { slug: string };
}) {
    const { slug } = params;

    // Prefetch data for the header components
    const workspacesPromise = getWorkspaces();
    const modelsPromise = getDataModelsBySlug(slug);

    // In a real app, we would fetch user data here.
    const session = await auth.getSession()

    if (!session || !session.data) {
        return redirect("/auth/sign-in")
    }

    const userName = session.data.user.name;


    return (
        <WorkspaceLayoutTemplate
            userName={userName}
            workspacesPromise={workspacesPromise}
            modelsPromise={modelsPromise}
        >
            {children}
        </WorkspaceLayoutTemplate>
    );
}
import { WorkspaceLayoutTemplate } from "@/features/workspace/components/templates/workspace-layout-template";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // In a real app, we would fetch user data here.
    // For now, using a placeholder name.
    const userName = "Diyo Anggara Pradipa Putra";

    return (
        <WorkspaceLayoutTemplate userName={userName}>
            {children}
        </WorkspaceLayoutTemplate>
    );
}
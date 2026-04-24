import { WorkspaceModelLayoutTemplate } from "@/features/workspace/components/templates/workspace-model-layout-template";

interface LayoutProps {
    children: React.ReactNode;
    params: {
        id: string;
    };
}

export default async function Layout({ children, params }: LayoutProps) {
    return (
        <WorkspaceModelLayoutTemplate userName="Diyo Anggara">
            {children}
        </WorkspaceModelLayoutTemplate>
    );
}
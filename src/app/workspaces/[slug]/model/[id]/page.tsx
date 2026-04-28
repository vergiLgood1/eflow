import { WorkspaceModelCanvas } from "@/features/workspace/components/organisms/workspace-model-canvas";

export default async function ModelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="w-full h-full">
            <WorkspaceModelCanvas dataModelId={id} />
        </div>
    );
}
import { WorkspaceModelCanvas } from "@/features/workspace/components/organisms/workspace-model-canvas";

export default async function ModelPage({ params }: { params: { id: string } }) {
    return (
        <div className="w-full h-full">
            <WorkspaceModelCanvas />
        </div>
    );
}
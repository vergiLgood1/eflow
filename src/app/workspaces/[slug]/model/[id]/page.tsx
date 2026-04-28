import { ModelCanvas } from "@/features/model/components/organisms/model-canvas";

export default async function ModelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <div className="w-full h-full">
            <ModelCanvas dataModelId={id} />
        </div>
    );
}
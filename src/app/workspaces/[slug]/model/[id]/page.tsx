import { ModelCanvas } from "@/features/model/components/organisms/model-canvas";
import { getModelDiagram } from "@/features/model/applications/model.action";
import { notFound } from "next/navigation";

export default async function ModelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diagramId = `${id}-default`;

  const response = await getModelDiagram(id, diagramId);

  if (!response.success) {
    return notFound();
  }

  return (
    <div className="h-full w-full">
      <ModelCanvas
        dataModelId={id}
        initialNodes={response.data?.nodes || []}
        initialEdges={response.data?.edges || []}
      />
    </div>
  );
}

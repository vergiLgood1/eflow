import "./setup";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "bun:test";
import { act, render, fireEvent } from "@testing-library/react";
import { ReactFlowProvider } from "@xyflow/react";
import { useCanvasStore } from "@/features/model/store/use-canvas-store";
import { ModelCanvas } from "@/features/model/components/organisms/model-canvas";
import { ImportSchemaDialog } from "@/shared/components/ui/import-schema-dialog";

vi.mock("@/features/model/applications/model.action", () => ({
  syncModelSchema: vi.fn(() => Promise.resolve({ success: true })),
  getModelDiagram: vi.fn(() => Promise.resolve({ success: true, data: { nodes: [], edges: [] } })),
}));

function setupCanvas() {
  return render(
    <ReactFlowProvider>
      <ModelCanvas dataModelId="model-1" withProvider={false} shouldLoad={false} />
    </ReactFlowProvider>
  );
}

describe("Model autosave UI", () => {
  beforeEach(() => {
    useCanvasStore.setState({
      nodes: [],
      edges: [],
      isDirty: false,
    });
  });

  it("marks dirty when adding a table via canvas click", async () => {
    setupCanvas();
    useCanvasStore.getState().setActiveTool("table");

    const pane = document.querySelector(".react-flow__pane") as HTMLElement | null;
    expect(pane).not.toBeNull();

    await act(async () => {
      fireEvent.click(pane as HTMLElement, { clientX: 200, clientY: 200 });
    });

    const state = useCanvasStore.getState();
    expect(state.nodes.length).toBe(1);
    expect(state.nodes[0]?.type).toBe("table");
    expect(state.isDirty).toBe(true);
  });
});

describe("Import schema UI", () => {
  it("imports DBML and sets nodes in store", async () => {
    render(<ImportSchemaDialog open defaultMode="dbml" />);

    const textarea = document.querySelector('[data-slot="textarea"]') as HTMLTextAreaElement | null;
    expect(textarea).not.toBeNull();

    await act(async () => {
      fireEvent.change(textarea as HTMLTextAreaElement, {
        target: {
          value: "Table users {\n  id integer [pk]\n}\n",
        },
      });
    });

    const importButton = Array.from(document.querySelectorAll("button"))
      .find((btn) => btn.textContent?.includes("Import"));

    expect(importButton).not.toBeUndefined();

    await act(async () => {
      fireEvent.click(importButton as HTMLButtonElement);
    });

    const state = useCanvasStore.getState();
    expect(state.nodes.length).toBeGreaterThan(0);
    expect(state.nodes[0]?.type).toBe("table");
  });
});

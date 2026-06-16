"use client";

import { CardinalityType } from "@/features/model/types/canvas";
import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export interface RelationshipEdgeContextMenuProps {
  edgeId: string;
  currentCardinality: CardinalityType;
  onChangeCardinality: (cardinality: CardinalityType) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function RelationshipEdgeContextMenu({
  edgeId,
  currentCardinality,
  onChangeCardinality,
  onDelete,
  onClose,
}: RelationshipEdgeContextMenuProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const cardinalityOptions: { value: CardinalityType; label: string }[] = [
    { value: "1:1", label: "One-to-One" },
    { value: "0..1", label: "Optional One-to-One" },
    { value: "1:n", label: "One-to-Many" },
    { value: "0..n", label: "Optional One-to-Many" },
    { value: "n:m", label: "Many-to-Many" },
  ];

  const handleCardinalityChange = (cardinality: CardinalityType) => {
    onChangeCardinality(cardinality);
    onClose();
  };

  return (
    <div className="p-1">
      <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
        Relationship {edgeId.slice(0, 8)}
      </div>
      <div className="bg-border mx-1 h-px" />

      {isConfirmingDelete ? (
        <div className="space-y-3 p-1">
          <p className="text-sm">
            Are you sure you want to delete this relationship?
          </p>
          <p className="text-muted-foreground text-xs">
            This will remove the relationship line from the diagram.
          </p>
          <div className="border-border mt-2 flex justify-end gap-2 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="px-1 py-1">
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs">
              <Edit className="h-3 w-3" />
              <span className="font-medium">Edit Cardinality</span>
            </div>
            <div className="mt-1 flex flex-col gap-0.5">
              {cardinalityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleCardinalityChange(option.value)}
                  className={`hover:bg-accent w-full rounded px-2 py-1.5 text-left text-xs transition-colors ${
                    currentCardinality === option.value ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {currentCardinality === option.value && (
                      <span className="text-xs">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-border mx-1 h-px" />

          <button
            onClick={() => setIsConfirmingDelete(true)}
            className="text-destructive hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete Relationship</span>
          </button>
        </>
      )}
    </div>
  );
}

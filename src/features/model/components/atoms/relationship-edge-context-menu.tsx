"use client";

import { CardinalityType } from "@/features/model/types/canvas";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Edit, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

export interface RelationshipEdgeContextMenuProps {
  edgeId: string;
  currentCardinality: CardinalityType;
  position: { x: number; y: number };
  onChangeCardinality: (cardinality: CardinalityType) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function RelationshipEdgeContextMenu({
  edgeId,
  currentCardinality,
  position,
  onChangeCardinality,
  onDelete,
  onClose,
}: RelationshipEdgeContextMenuProps) {
  const [open, setOpen] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     triggerRef.current?.click();
  //   }, 10);
  //   return () => clearTimeout(timer);
  // }, []);

  const cardinalityOptions: { value: CardinalityType; label: string }[] = [
    { value: "1:1", label: "One-to-One" },
    { value: "0..1", label: "Optional One-to-One" },
    { value: "1:n", label: "One-to-Many" },
    { value: "0..n", label: "Optional One-to-Many" },
    { value: "n:m", label: "Many-to-Many" },
  ];

  const handleCardinalityChange = (cardinality: CardinalityType) => {
    onChangeCardinality(cardinality);
    setOpen(false);
  };

  return (

    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) onClose(); }}>
      <PopoverTrigger asChild>
        <button ref={triggerRef} style={{ display: 'none' }} />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        <div className="text-xs font-semibold px-2 py-1.5 text-muted-foreground">
          Relationship {edgeId.slice(0, 8)}
        </div>
        <div className="h-px bg-border mx-1" />

        <div className="px-1 py-1">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs">
            <Edit className="h-3 w-3" />
            <span className="font-medium">Edit Cardinality</span>
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            {cardinalityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleCardinalityChange(option.value)}
                className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-accent transition-colors ${currentCardinality === option.value ? "bg-accent" : ""
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

        <div className="h-px bg-border mx-1" />

        <button
          onClick={() => {
            onDelete();
            setOpen(false);
          }}
          className="w-full text-left px-2 py-1.5 text-xs text-destructive hover:bg-accent rounded transition-colors flex items-center gap-2"
        >
          <Trash2 className="h-3 w-3" />
          <span>Delete Relationship</span>
        </button>
      </PopoverContent>
    </Popover>

  );
}

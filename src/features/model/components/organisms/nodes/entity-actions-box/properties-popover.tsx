"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { TableNodeData } from "@/features/model/types/canvas";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/shared/components/color-picker";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import Color from "color";
import { Palette, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import { PopoverHeader } from "../../../atoms/popover-header";

const PRESET_COLORS = [
  colors.blue[500],
  colors.green[500],
  colors.purple[500],
  colors.orange[500],
  colors.red[500],
];

export function PropertiesPopover({
  nodeId,
  data,
  onClose,
}: {
  nodeId: string;
  data: TableNodeData;
  onClose: () => void;
}) {
  const { updateTable } = useTableActions();

  const [name, setName] = useState(data.name);
  const [color, setColor] = useState(data.color ?? colors.blue[500]);
  const [showPicker, setShowPicker] = useState(false);

  // Real-time synchronization
  useEffect(() => {
    if (name !== data.name || color !== data.color) {
      updateTable(nodeId, { name, color });
    }
  }, [name, color, data.name, data.color, nodeId, updateTable]);

  const handleReset = () => {
    setColor(colors.blue[500]);
    setShowPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="p-1">
      <PopoverHeader
        title="Table Properties"
        description="Configure table settings"
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Table Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Header Color</Label>
          <div className="mb-3 flex flex-wrap gap-2 pt-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  "size-6 rounded-full transition-all hover:scale-110",
                  color === c ? "ring-primary ring-2 ring-offset-1" : "ring-0",
                )}
                style={{ backgroundColor: c }}
                onClick={() => {
                  setColor(c);
                  setShowPicker(false);
                }}
              />
            ))}

            <div className="ml-auto flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7", showPicker && "bg-accent")}
                onClick={() => setShowPicker(!showPicker)}
              >
                <Palette className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleReset}
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </div>

          {showPicker && (
            <div className="border-border mt-2 border-t pt-2">
              <ColorPicker
                value={color}
                onChange={(val) => {
                  if (Array.isArray(val)) {
                    const [r, g, b, a] = val;
                    setColor(Color.rgb(r, g, b).alpha(a).toString());
                  }
                }}
                className="space-y-2"
              >
                <ColorPickerSelection className="h-32 rounded-md" />
                <ColorPickerHue />
                <ColorPickerAlpha />
                <div className="flex items-center gap-2">
                  <ColorPickerOutput />
                  <ColorPickerFormat />
                </div>
              </ColorPicker>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

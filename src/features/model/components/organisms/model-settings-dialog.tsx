import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import { Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCanvasStore } from "../../store/use-canvas-store";
import { ModelToolbarButton } from "../atoms/model-toolbar-button";

const COLUMN_TYPES = [
    "int", "bigint", "varchar", "text", "timestamp", "date", "boolean", "decimal", "uuid"
];

export function ModelSettingsDialog() {
    const [open, setOpen] = useState(false);
    const settings = useCanvasStore(s => s.modelSettings);
    const updateSettings = useCanvasStore(s => s.updateModelSettings);

    const addColumn = (col?: { name: string; type: string; nullable: boolean }) => {
        const newCol = {
            id: crypto.randomUUID(),
            name: col?.name || "new_column",
            type: col?.type || "varchar",
            nullable: col?.nullable ?? false,
        };
        updateSettings({ defaultColumns: [...settings.defaultColumns, newCol] });
    };

    const removeColumn = (id: string) => {
        updateSettings({
            defaultColumns: settings.defaultColumns.filter(c => c.id !== id)
        });
    };

    const updateColumn = (id: string, updates: { name?: string; type?: string; nullable?: boolean }) => {
        updateSettings({
            defaultColumns: settings.defaultColumns.map(c => c.id === id ? { ...c, ...updates } : c)
        });
    };

    const addTimestampPreset = () => {
        updateSettings({
            defaultColumns: [
                ...settings.defaultColumns,
                { id: crypto.randomUUID(), name: "created_at", type: "timestamp", nullable: false },
                { id: crypto.randomUUID(), name: "updated_at", type: "timestamp", nullable: false }
            ]
        });
    };

    const addSoftDeletePreset = () => {
        updateSettings({
            defaultColumns: [
                ...settings.defaultColumns,
                { id: crypto.randomUUID(), name: "deleted_at", type: "timestamp", nullable: true }
            ]
        });
    };

    const addAuditPreset = () => {
        updateSettings({
            defaultColumns: [
                ...settings.defaultColumns,
                { id: crypto.randomUUID(), name: "created_by", type: "uuid", nullable: false },
                { id: crypto.randomUUID(), name: "updated_by", type: "uuid", nullable: false }
            ]
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ModelToolbarButton tooltip="Settings" icon={<Settings className="h-4 w-4" />} />
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto min-w-2xl">
                <DialogHeader>
                    <DialogTitle>Data Model Settings</DialogTitle>
                    <DialogDescription>
                        Configure default behavior and display options for this data model.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Relationship Labels */}
                    <section>
                        <h3 className="text-sm font-semibold mb-4 text-foreground/90">Relationship Labels</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="show-fk-name" className="flex-1 cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors">
                                    Show foreign key name on relationship edges
                                </Label>
                                <Switch
                                    id="show-fk-name"
                                    checked={settings.showFkName}
                                    onCheckedChange={(val) => updateSettings({ showFkName: val })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="show-rel-type" className="flex-1 cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors">
                                    Show relationship type (1:1, 1:n, etc.) on edges
                                </Label>
                                <Switch
                                    id="show-rel-type"
                                    checked={settings.showRelType}
                                    onCheckedChange={(val) => updateSettings({ showRelType: val })}
                                />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Table Defaults */}
                    <section>
                        <h3 className="text-sm font-semibold mb-4 text-foreground/90">Table Defaults</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="id-column-type">ID column type</Label>
                                <Select
                                    value={settings.idColumnType}
                                    onValueChange={(val) => updateSettings({ idColumnType: val })}
                                >
                                    <SelectTrigger className="w-full" id="id-column-type">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value="int">INT AUTO_INCREMENT</SelectItem>
                                        <SelectItem value="bigint">BIGINT AUTO_INCREMENT</SelectItem>
                                        <SelectItem value="uuid">UUID</SelectItem>
                                        <SelectItem value="cuid">CUID</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="varchar-length">VARCHAR default length</Label>
                                <Input
                                    id="varchar-length"
                                    type="number"
                                    value={settings.varcharDefaultLength}
                                    onChange={(e) => updateSettings({ varcharDefaultLength: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="decimal-precision">DECIMAL default precision</Label>
                                <Input
                                    id="decimal-precision"
                                    type="number"
                                    value={settings.decimalDefaultPrecision}
                                    onChange={(e) => updateSettings({ decimalDefaultPrecision: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="decimal-scale">DECIMAL default scale</Label>
                                <Input
                                    id="decimal-scale"
                                    type="number"
                                    value={settings.decimalDefaultScale}
                                    onChange={(e) => updateSettings({ decimalDefaultScale: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* Default Columns */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-foreground/90">Default Columns for New Tables</h3>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs px-3" onClick={addTimestampPreset}>
                                    + Timestamps
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs px-3" onClick={addSoftDeletePreset}>
                                    + Soft Delete
                                </Button>
                                <Button variant="outline" size="sm" className="h-8 text-xs px-3" onClick={addAuditPreset}>
                                    + Audit
                                </Button>
                            </div>
                        </div>

                        {settings.defaultColumns.length > 0 ? (
                            <div className="space-y-2">
                                {settings.defaultColumns.map((col) => (
                                    <div key={col.id} className="flex items-center gap-2 rounded-md border p-2 bg-muted/10 group animate-in fade-in slide-in-from-top-1 duration-200">
                                        <Input
                                            placeholder="column_name"
                                            className="flex-1 h-9 bg-background/50"
                                            value={col.name}
                                            onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                                        />
                                        <Select
                                            value={col.type}
                                            onValueChange={(val) => updateColumn(col.id, { type: val })}
                                        >
                                            <SelectTrigger className="w-36 h-9 bg-background/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COLUMN_TYPES.map(type => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex items-center gap-2 px-2">
                                            <Switch
                                                id={`null-${col.id}`}
                                                checked={col.nullable}
                                                onCheckedChange={(val) => updateColumn(col.id, { nullable: val })}
                                                className="scale-90"
                                            />
                                            <Label htmlFor={`null-${col.id}`} className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight w-12">
                                                Nullable
                                            </Label>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                            onClick={() => removeColumn(col.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="h-8 mt-2" onClick={() => addColumn()}>
                                    <Plus className="h-3.5 w-3.5 mr-2" />
                                    Add Custom Column
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border border-dashed p-10 text-center bg-muted/5 transition-colors hover:bg-muted/10">
                                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                                    No default columns configured. Use the presets above or add custom columns that will be automatically included in every new table.
                                </p>
                                <Button variant="outline" size="sm" className="h-9 px-4" onClick={() => addColumn()}>
                                    <Plus className="h-3.5 w-3.5 mr-2" />
                                    Create Custom Column
                                </Button>
                            </div>
                        )}
                    </section>
                </div>

                <DialogFooter className="pt-6 border-t border-border/50">
                    <Button
                        variant="default"
                        onClick={() => setOpen(false)}
                        className="px-8 font-semibold shadow-sm hover:shadow-md transition-all active:scale-95"
                    >
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

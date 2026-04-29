"use client";

import { useTableActions } from "@/features/model/hooks/use-table-actions";
import { Button } from "@/shared/components/ui/button";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Textarea } from "@/shared/components/ui/textarea";
import { useState } from "react";

export function TRGConfigDialog({ nodeId, onClose }: { nodeId: string; onClose: () => void }) {
    const { getTableData } = useTableActions();
    const table = getTableData(nodeId);

    const [name, setName] = useState("");
    const [timing, setTiming] = useState("BEFORE");
    const [event, setEvent] = useState("INSERT");
    const [isTemplate, setIsTemplate] = useState(false);
    const [template, setTemplate] = useState("SOFT_DELETE");
    const [forEach, setForEach] = useState("ROW");
    const [unique, setUnique] = useState("NON UNIQUE");
    const [definition, setDefinition] = useState("");
    const [notes, setNotes] = useState("");

    const handleSave = () => {
        // Implement Trigger saving logic here
        onClose();
    };

    return (
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
                <DialogTitle>Create Trigger</DialogTitle>
                <DialogDescription>
                    Define automated behavior for table <span className="font-bold text-foreground">{table?.name}</span>.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-xs">Trigger Name</Label>
                        <Input
                            placeholder="trg_audit_log..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-9"
                        />
                    </div>

                    {/* Templates */}
                    <div className="grid gap-2">
                        <Label className="text-xs">Trigger Templates</Label>
                        <Select value={event} onValueChange={setEvent}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INSERT">Soft Delete</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-xs">Timing</Label>
                        <Select value={timing} onValueChange={setTiming}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BEFORE">BEFORE</SelectItem>
                                <SelectItem value="AFTER">AFTER</SelectItem>
                                <SelectItem value="INSTEAD OF">INSTEAD OF</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs">Event</Label>
                        <Select value={event} onValueChange={setEvent}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INSERT">INSERT</SelectItem>
                                <SelectItem value="UPDATE">UPDATE</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                                <SelectItem value="TRUNCATE">TRUNCATE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs">For Each</Label>
                        <Select value={forEach} onValueChange={setForEach}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ROW">ROW</SelectItem>
                                <SelectItem value="STATEMENT">STATEMENT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Unique or not */}
                    <div className="grid gap-2">
                        <Label className="text-xs">Unique or not</Label>
                        <Select value={unique} onValueChange={setUnique}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UNIQUE">UNIQUE</SelectItem>
                                <SelectItem value="NON UNIQUE">NON UNIQUE</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* When condition */}
                <div className="grid gap-2">
                    <Label className="text-xs">When condition</Label>
                    <Input placeholder="WHEN event = 'INSERT' THEN..." className="w-full h-9" />
                </div>

                <Tabs defaultValue="code" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-9">
                        <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
                        <TabsTrigger value="description" className="text-xs">Description</TabsTrigger>
                    </TabsList>
                    <TabsContent value="code" className="pt-3 space-y-2">
                        {/* <Label className="text-xs">Definition (SQL)</Label> */}
                        <Textarea
                            placeholder="EXECUTE FUNCTION notify_change()..."
                            className="w-full min-h-[120px] font-mono text-xs"
                            value={definition}
                            onChange={(e) => setDefinition(e.target.value)}
                        />
                    </TabsContent>
                    <TabsContent value="description" className="pt-3 space-y-2">
                        {/* <Label className="text-xs">Description</Label> */}
                        <Textarea
                            placeholder="Describe what this trigger does..."
                            className="w-full min-h-[120px] text-xs"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <DialogFooter>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Create Trigger</Button>
            </DialogFooter>
        </DialogContent>
    );
}

"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value";
import { cn } from "@/shared/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Box, Check, ChevronsUpDown, MoreVertical, Plus, Search } from "lucide-react";
import React, { Suspense, use, useMemo } from "react";
import { getDataModelsBySlug } from "../../applications/workspace.action";

interface DataModel {
    id: string;
    name: string;
    updatedAt: Date;
}

interface ModelListProps {
    promise?: Promise<DataModel[]>;
    selectedId?: string;
    onSelect: (model: DataModel) => void;
}

function ModelList({ promise, selectedId, onSelect }: ModelListProps) {
    if (!promise) return null;
    const models = use(promise);

    return (
        <div className="p-1">
            <p className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Data Models
            </p>
            {models.map((model) => (
                <div key={model.id} className="group relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "w-full justify-between font-normal h-12 px-2 text-xs",
                            selectedId === model.id && "bg-accent text-accent-foreground font-medium"
                        )}
                        onClick={() => onSelect(model)}
                    >
                        <div className="flex flex-col items-start gap-0.5 min-w-0 pr-6 text-left">
                            <span className="truncate w-full flex items-center gap-2">
                                {selectedId === model.id && <Check className="h-3 w-3 text-primary shrink-0" />}
                                {model.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-normal">
                                Edited {formatDistanceToNow(new Date(model.updatedAt))} ago
                            </span>
                        </div>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ))}
            {models.length === 0 && (
                <div className="px-2 py-8 text-center">
                    <Box className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                        No models found
                    </p>
                </div>
            )}
        </div>
    );
}

function ModelListSkeleton() {
    return (
        <div className="p-1 space-y-1">
            <div className="px-2 py-1.5 h-4 w-20 bg-muted animate-pulse rounded mb-1" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 w-full bg-muted/50 animate-pulse rounded" />
            ))}
        </div>
    );
}

interface WorkspaceDataModelSelectorProps {
    slug: string;
    className?: string;
    initialPromise?: Promise<DataModel[]>;
}

export function WorkspaceDataModelSelector({
    slug,
    className,
    initialPromise,
}: WorkspaceDataModelSelectorProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [debouncedSearch] = useDebounceValue(searchQuery, 300);
    const [selectedModel, setSelectedModel] = React.useState<DataModel | null>(null);

    const [modelsPromise, setModelsPromise] = React.useState(initialPromise);

    React.useEffect(() => {
        if (!debouncedSearch) {
            setModelsPromise(initialPromise);
            return;
        }

        const newPromise = getDataModelsBySlug(slug, debouncedSearch);
        setModelsPromise(newPromise);
    }, [slug, debouncedSearch, initialPromise]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "gap-2.5 px-3 text-xs h-9 min-w-[180px] max-w-[260px] justify-between border border-transparent hover:border-border/50 font-medium hover:bg-accent/50 transition-all",
                        className
                    )}
                >
                    <span className="truncate flex items-center gap-2 text-foreground">
                        <Box className={cn("h-3.5 w-3.5", selectedModel ? "text-primary" : "text-muted-foreground")} />
                        {selectedModel ? selectedModel.name : "Select a data model"}
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 ml-2 opacity-50 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0 shadow-lg border-border/50" align="start">
                <div className="p-2 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Find a data model..."
                            className="h-8 pl-8 text-xs bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="max-h-[280px]">
                    <Suspense fallback={<ModelListSkeleton />}>
                        <ModelList
                            promise={modelsPromise}
                            selectedId={selectedModel?.id}
                            onSelect={(m) => {
                                setSelectedModel(m);
                                setOpen(false);
                            }}
                        />
                    </Suspense>
                </ScrollArea>
                <Separator />
                <div className="p-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 h-9 px-2 text-xs font-medium text-primary hover:text-primary hover:bg-primary/5"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Create New Data Model
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

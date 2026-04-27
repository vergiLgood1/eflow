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
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import React, { Suspense, use, useMemo } from "react";
import { getWorkspaces } from "../../applications/workspace.action";

const WORKSPACE_COLORS = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-indigo-500",
];

interface Workspace {
    id: string;
    name: string;
    slug: string;
}

interface WorkspaceListProps {
    promise: Promise<Workspace[]>;
    selectedId?: string;
    onSelect: (workspace: Workspace) => void;
}

function WorkspaceList({ promise, selectedId, onSelect }: WorkspaceListProps) {
    const workspaces = use(promise);

    return (
        <div className="p-1">
            <p className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Workspaces
            </p>
            {workspaces.map((workspace, index) => (
                <Button
                    key={workspace.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "w-full justify-between font-normal h-9 px-2 text-xs",
                        selectedId === workspace.slug && "bg-accent text-accent-foreground font-medium"
                    )}
                    onClick={() => onSelect(workspace)}
                >
                    <span className="flex items-center gap-2 truncate">
                        <span className={cn("h-2 w-2 rounded-full", WORKSPACE_COLORS[index % WORKSPACE_COLORS.length])} />
                        {workspace.name}
                    </span>
                    {selectedId === workspace.slug && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                    )}
                </Button>
            ))}
            {workspaces.length === 0 && (
                <p className="px-2 py-4 text-xs text-center text-muted-foreground">
                    No workspaces found
                </p>
            )}
        </div>
    );
}

function WorkspaceListSkeleton() {
    return (
        <div className="p-1 space-y-1">
            <div className="px-2 py-1.5 h-4 w-16 bg-muted animate-pulse rounded mb-1" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 w-full bg-muted/50 animate-pulse rounded" />
            ))}
        </div>
    );
}

interface WorkspaceSwitcherProps {
    workspaceName: string;
    slug?: string;
    className?: string;
    initialPromise?: Promise<Workspace[]>;
}

export function WorkspaceSwitcher({
    workspaceName: initialWorkspaceName,
    slug: currentSlug,
    className,
    initialPromise,
}: WorkspaceSwitcherProps) {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [debouncedSearch] = useDebounceValue(searchQuery, 300);

    // Initial display name
    const [displayName, setDisplayName] = React.useState(initialWorkspaceName);

    const workspacesPromise = useMemo(() => {
        if (!debouncedSearch && initialPromise) return initialPromise;
        return getWorkspaces(debouncedSearch);
    }, [debouncedSearch, initialPromise]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "gap-2 px-3 text-xs h-9 min-w-[160px] max-w-[260px] justify-between font-medium hover:bg-accent/50 transition-all",
                        className
                    )}
                >
                    <span className="truncate flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full shrink-0 bg-primary")} />
                        {displayName}
                    </span>
                    <ChevronsUpDown className="h-4 w-4 ml-2 opacity-60 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-0 shadow-lg border-border/50" align="start">
                <div className="p-2 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Search workspaces..."
                            className="h-8 pl-8 text-xs bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="max-h-[240px]">
                    <Suspense fallback={<WorkspaceListSkeleton />}>
                        <WorkspaceList
                            promise={workspacesPromise}
                            selectedId={currentSlug} // Using slug as ID for visual check in this mock-like list
                            onSelect={(w) => {
                                setDisplayName(w.name);
                                setOpen(false);
                                // In real app, we would redirect here:
                                // window.location.href = `/workspaces/${w.slug}`;
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
                        Create New Workspace
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

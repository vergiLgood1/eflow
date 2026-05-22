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
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { getWorkspaces } from "../../applications/workspace.action";
import { CreateWorkspaceDialog } from "../organisms/create-workspace-dialog";

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
  workspaces: Workspace[];
  selectedId?: string;
  onSelect: (workspace: Workspace) => void;
}

function WorkspaceList({
  workspaces,
  selectedId,
  onSelect,
}: WorkspaceListProps) {
  return (
    <div className="p-1">
      <p className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
        Workspaces
      </p>
      {workspaces.map((workspace, index) => (
        <Button
          key={workspace.id}
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-full justify-between px-2 text-xs font-normal",
            selectedId === workspace.slug &&
              "bg-accent text-accent-foreground font-medium",
          )}
          onClick={() => onSelect(workspace)}
        >
          <span className="flex items-center gap-2 truncate">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                WORKSPACE_COLORS[index % WORKSPACE_COLORS.length],
              )}
            />
            {workspace.name}
          </span>
          {selectedId === workspace.slug && (
            <Check className="text-primary h-3.5 w-3.5" />
          )}
        </Button>
      ))}
      {workspaces.length === 0 && (
        <p className="text-muted-foreground px-2 py-4 text-center text-xs">
          No workspaces found
        </p>
      )}
    </div>
  );
}

function WorkspaceListSkeleton() {
  return (
    <div className="space-y-1 p-1">
      <div className="px-2 py-1.5">
        <Skeleton className="h-3 w-16" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex h-9 items-center gap-2 px-2">
          <Skeleton className="h-2 w-2 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

interface WorkspaceSwitcherProps {
  slug?: string;
  className?: string;
  initialData: Workspace[];
}

export function WorkspaceSwitcher({
  slug: currentSlug,
  className,
  initialData,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 300);

  const router = useRouter();

  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!debouncedSearch) {
        setWorkspaces(initialData);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getWorkspaces(debouncedSearch);
        setWorkspaces(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, [debouncedSearch, initialData]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setOpen(false);
    router.push(`/workspaces/${workspace.slug}`);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hover:bg-accent/50 h-9 max-w-[260px] min-w-[160px] justify-between gap-2 px-3 text-xs font-medium transition-all",
              className,
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <span
                className={cn("bg-primary h-2 w-2 shrink-0 rounded-full")}
              />
              {workspaces.find((w) => w.slug === currentSlug)?.name ||
                "Select Workspace"}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-border/50 w-[240px] p-0 shadow-lg"
          align="start"
        >
          <div className="border-border border-b p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
              <Input
                placeholder="Search workspaces..."
                className="bg-muted/50 focus-visible:ring-primary/20 h-8 border-none pl-8 text-xs focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="max-h-[240px]">
            {isLoading ? (
              <WorkspaceListSkeleton />
            ) : (
              <WorkspaceList
                workspaces={workspaces}
                selectedId={currentSlug}
                onSelect={handleWorkspaceSelect}
              />
            )}
          </ScrollArea>
          <Separator />
          <div className="p-1">
            <CreateWorkspaceDialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/5 h-9 w-full justify-start gap-2 px-2 text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5" />
                Create New Workspace
              </Button>
            </CreateWorkspaceDialog>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

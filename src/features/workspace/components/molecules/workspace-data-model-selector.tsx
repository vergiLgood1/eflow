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
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription.action";
import { formatDistanceToNow } from "date-fns";
import {
  Box,
  Check,
  ChevronsUpDown,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { getDataModelsBySlug } from "../../applications/workspace.action";
import { CreateDiagramDialog } from "../organisms/create-diagram-dialog";

interface DataModel {
  id: string;
  name: string;
  isPublic?: boolean;
  updatedAt: Date;
}

interface ModelListProps {
  models: DataModel[];
  selectedId?: string;
  onSelect: (model: DataModel) => void;
}

function ModelList({ models, selectedId, onSelect }: ModelListProps) {
  return (
    <div className="p-1">
      <p className="text-muted-foreground px-2 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
        Data Models
      </p>
      {models.map((model) => (
        <div key={model.id} className="group relative">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-12 w-full justify-between px-2 text-xs font-normal",
              selectedId === model.id &&
                "bg-accent text-accent-foreground font-medium",
            )}
            onClick={() => onSelect(model)}
          >
            <div className="flex min-w-0 flex-col items-start gap-0.5 pr-6 text-left">
              <span className="flex w-full items-center gap-2 truncate">
                {selectedId === model.id && (
                  <Check className="text-primary h-3 w-3 shrink-0" />
                )}
                {model.name}
              </span>
              <span className="text-muted-foreground text-[10px] font-normal">
                Edited {formatDistanceToNow(new Date(model.updatedAt))} ago
              </span>
            </div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      {models.length === 0 && (
        <div className="px-2 py-8 text-center">
          <Box className="text-muted-foreground/20 mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-xs">No models found</p>
        </div>
      )}
    </div>
  );
}

function ModelListSkeleton() {
  return (
    <div className="space-y-1 p-1">
      <div className="px-2 py-1.5">
        <Skeleton className="h-3 w-20" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex h-14 flex-col justify-center gap-2 px-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2 w-20" />
        </div>
      ))}
    </div>
  );
}

interface WorkspaceDataModelSelectorProps {
  slug: string;
  modelId?: string;
  className?: string;
  initialData: DataModel[];
  subscriptionAccess?: SubscriptionAccess | null;
}

export function WorkspaceDataModelSelector({
  slug,
  modelId,
  className,
  initialData,
  subscriptionAccess,
}: WorkspaceDataModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounceValue(searchQuery, 300);

  const [models, setModels] = React.useState<DataModel[]>(initialData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const router = useRouter();

  const selectedModel = models.find((m) => m.id === modelId);
  const publicModelLimit =
    subscriptionAccess?.entitlements.maxPublicModels ?? null;
  const hasReachedPublicModelLimit =
    publicModelLimit !== null &&
    initialData.filter((model) => model.isPublic).length >= publicModelLimit;

  React.useEffect(() => {
    const fetchModels = async () => {
      if (!debouncedSearch) {
        setModels(initialData);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getDataModelsBySlug(slug, debouncedSearch);
        setModels(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [slug, debouncedSearch, initialData]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hover:border-border/50 hover:bg-accent/50 h-9 w-auto justify-between gap-2.5 border border-transparent px-3 text-xs font-medium transition-all",
              className,
            )}
          >
            <span className="text-foreground flex items-center gap-2 truncate">
              <Box
                className={cn(
                  "h-3.5 w-3.5",
                  selectedModel ? "text-primary" : "text-muted-foreground",
                )}
              />
              {selectedModel ? selectedModel.name : "Select a data model"}
            </span>
            <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-border/50 w-[280px] p-0 shadow-lg"
          align="start"
        >
          <div className="border-border border-b p-2">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
              <Input
                placeholder="Find a data model..."
                className="bg-muted/50 focus-visible:ring-primary/20 h-8 border-none pl-8 text-xs focus-visible:ring-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="max-h-[280px]">
            {isLoading ? (
              <ModelListSkeleton />
            ) : (
              <ModelList
                models={models}
                selectedId={modelId}
                onSelect={(model) => {
                  setOpen(false);
                  router.push(`/workspaces/${slug}/model/${model.id}`);
                }}
              />
            )}
          </ScrollArea>
          <Separator />
          <div className="p-1">
            {hasReachedPublicModelLimit ? (
              <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Free plan includes 3 public data models.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/5 h-8 w-full justify-start gap-2 px-2 text-xs font-medium"
                  onClick={() => {
                    setOpen(false);
                    router.push("/account/billing");
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade to create more
                </Button>
              </div>
            ) : (
              <CreateDiagramDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:bg-primary/5 h-9 w-full justify-start gap-2 px-2 text-xs font-medium"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create New Data Model
                </Button>
              </CreateDiagramDialog>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}

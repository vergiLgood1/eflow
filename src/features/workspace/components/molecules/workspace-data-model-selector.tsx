"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription-access";
import { formatDistanceToNow } from "date-fns";
import {
  Box,
  Check,
  ChevronsUpDown,
  Pencil,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import {
  deleteDataModel,
  getDataModelsBySlug,
  updateDataModelName,
} from "../../applications/workspace.action";
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
  onEdit: (model: DataModel) => void;
  onDelete: (model: DataModel) => void;
}

function ModelList({
  models,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: ModelListProps) {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(event) => event.stopPropagation()}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl">
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-xs"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(model);
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2 text-xs"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(model);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
  const [editingModel, setEditingModel] = React.useState<DataModel | null>(null);
  const [deletingModel, setDeletingModel] = React.useState<DataModel | null>(
    null,
  );
  const [editName, setEditName] = React.useState("");
  const [isMutating, setIsMutating] = React.useState(false);

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

  const openEditDialog = (model: DataModel) => {
    setOpen(false);
    setEditingModel(model);
    setEditName(model.name);
  };

  const openDeleteDialog = (model: DataModel) => {
    setOpen(false);
    setDeletingModel(model);
  };

  const handleUpdateModel = async () => {
    if (!editingModel) return;

    setIsMutating(true);
    const result = await updateDataModelName(editingModel.id, editName);
    setIsMutating(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message ?? "Data model updated");
    setEditingModel(null);
    router.refresh();
  };

  const handleDeleteModel = async () => {
    if (!deletingModel) return;

    setIsMutating(true);
    const result = await deleteDataModel(deletingModel.id);
    setIsMutating(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message ?? "Data model deleted");
    setDeletingModel(null);
    if (deletingModel.id === modelId) {
      router.push(`/workspaces/${slug}`);
      return;
    }

    router.refresh();
  };

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
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
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

      <Dialog open={editingModel !== null} onOpenChange={() => setEditingModel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Data Model</DialogTitle>
            <DialogDescription>
              Rename this data model. Existing tables and relationships are not
              changed.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            placeholder="Data model name"
            disabled={isMutating}
          />
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isMutating}
              onClick={() => setEditingModel(null)}
            >
              Cancel
            </Button>
            <Button disabled={isMutating} onClick={handleUpdateModel}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deletingModel !== null} onOpenChange={() => setDeletingModel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Data Model</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{deletingModel?.name}&quot; and all of
              its diagram data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={isMutating}
              onClick={() => setDeletingModel(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isMutating}
              onClick={handleDeleteModel}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

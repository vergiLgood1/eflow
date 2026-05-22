"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Database, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import type { DataModel, Workspace } from "../../../../../prisma/generated";
import { EmptyDiagramState } from "../molecules/empty-diagram-state";
import { WorkspaceDiagramCard } from "../molecules/workspace-diagram-card";
import { ShareDiagramDialog } from "./share-diagram-dialog";
import { useDiagramActions } from "../../hooks/use-diagram-actions";
import { WorkspaceDiagramDropdown } from "../molecules/workspace-diagram-dropdown";

interface WorkspaceDiagramListProps {
  models: DataModel[];
  workspaces: Workspace[];
  viewMode?: "grid" | "list";
  searchQuery?: string;
  onClearSearch?: () => void;
}

function DiagramGrid({
  models,
  workspaces,
  searchQuery,
  onClearSearch,
}: {
  models: DataModel[];
  workspaces: Workspace[];
  searchQuery?: string;
  onClearSearch?: () => void;
}) {
  if (models.length === 0) {
    return (
      <EmptyDiagramState
        type={searchQuery ? "no-search" : "empty"}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />
    );
  }

  const workspaceMap = new Map(workspaces.map((w) => [w.id, w]));

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {models.map((model) => (
        <WorkspaceDiagramCard
          key={model.id}
          id={model.id}
          title={model.name}
          workspaceName={workspaceMap.get(model.workspaceId)?.name ?? ""}
          workspaceSlug={workspaceMap.get(model.workspaceId)?.slug ?? ""}
          dbType={model.dbType.toLowerCase()}
          updatedAt={formatDistanceToNow(new Date(model.updatedAt), {
            addSuffix: false,
          })}
          isPinned={model.isPinned}
          isPublic={model.isPublic}
        />
      ))}
    </div>
  );
}

function DiagramList({
  models,
  workspaces,
  searchQuery,
  onClearSearch,
}: {
  models: DataModel[];
  workspaces: Workspace[];
  searchQuery?: string;
  onClearSearch?: () => void;
}) {
  if (models.length === 0) {
    return (
      <EmptyDiagramState
        type={searchQuery ? "no-search" : "empty"}
        searchQuery={searchQuery}
        onClearSearch={onClearSearch}
      />
    );
  }

  const workspaceMap = new Map(workspaces.map((w) => [w.id, w]));

  return (
    <div className="flex flex-col gap-3">
      <div className="text-muted-foreground/60 grid grid-cols-12 px-4 py-2 text-xs font-semibold tracking-wider uppercase">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Database</div>
        <div className="col-span-3">Last Modified</div>
        <div className="col-span-2 px-4 text-right">Actions</div>
      </div>
      {models.map((model) => (
        <DiagramListItem
          key={model.id}
          model={model}
          workspaceName={
            workspaceMap.get(model.workspaceId)?.name ?? "Unknown Workspace"
          }
          workspaceSlug={workspaceMap.get(model.workspaceId)?.slug ?? ""}
        />
      ))}
    </div>
  );
}

function DiagramListItem({
  model,
  workspaceName,
  workspaceSlug,
}: {
  model: DataModel;
  workspaceName: string;
  workspaceSlug: string;
}) {
  const router = useRouter();
  const { handlePin, handleActionClick } = useDiagramActions(model.id);

  const handleClick = () => {
    router.push(`/workspaces/${workspaceSlug}/model/${model.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-card border-border/50 hover:border-primary/30 group grid cursor-pointer grid-cols-12 items-center rounded-xl border px-4 py-3 transition-all hover:shadow-md"
    >
      <div className="col-span-5 flex min-w-0 items-center gap-3">
        <div className="bg-primary/5 group-hover:bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors">
          <Database className="text-primary h-5 w-5" />
        </div>
        <div className="truncate">
          <p className="text-foreground truncate text-sm font-bold">
            {model.name}
          </p>
          <p className="text-muted-foreground text-[10px] font-medium tracking-tight uppercase">
            {workspaceName}
          </p>
        </div>
      </div>
      <div className="col-span-2">
        <Badge
          variant="outline"
          className="bg-muted/30 border-border/50 h-5 text-[10px] font-bold uppercase"
        >
          {model.dbType}
        </Badge>
      </div>
      <div className="text-muted-foreground col-span-3 flex items-center gap-2 text-[11px] font-medium tracking-tight uppercase">
        {formatDistanceToNow(new Date(model.updatedAt), { addSuffix: false })}
      </div>
      <div
        className="col-span-2 flex items-center justify-end gap-1 px-2"
        onClick={handleActionClick}
      >
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-muted-foreground h-8 w-8 transition-colors hover:bg-yellow-500/5 hover:text-yellow-500",
            model.isPinned && "text-yellow-500 opacity-100",
          )}
          onClick={handlePin}
        >
          <Star className={cn("h-4 w-4", model.isPinned && "fill-current")} />
        </Button>

        <ShareDiagramDialog title={model.name}>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-primary/5 h-8 w-8"
          >
            <Users className="h-4 w-4" />
          </Button>
        </ShareDiagramDialog>

        <WorkspaceDiagramDropdown
          id={model.id}
          isPublic={model.isPublic}
          isPinned={model.isPinned}
        />
      </div>
    </div>
  );
}

export function WorkspaceDiagramList({
  models,
  workspaces,
  viewMode = "grid",
  searchQuery,
  onClearSearch,
}: WorkspaceDiagramListProps) {
  return (
    <section className="mb-10">
      <div className="mb-8">
        <h2 className="text-foreground flex items-center gap-3 text-2xl font-bold tracking-tight">
          Data Models
          <DiagramCount models={models} workspaces={workspaces} />
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
          Manage your ER diagrams and database schemas with ease
        </p>
      </div>

      {viewMode === "grid" ? (
        <DiagramGrid
          models={models}
          workspaces={workspaces}
          searchQuery={searchQuery}
          onClearSearch={onClearSearch}
        />
      ) : (
        <DiagramList
          models={models}
          workspaces={workspaces}
          searchQuery={searchQuery}
          onClearSearch={onClearSearch}
        />
      )}
    </section>
  );
}

function DiagramCount({
  models,
  workspaces,
}: {
  models: DataModel[];
  workspaces: Workspace[];
}) {
  return (
    <Badge
      variant="secondary"
      className="text-[10px] font-bold tracking-widest uppercase"
    >
      {models.length} Total
    </Badge>
  );
}

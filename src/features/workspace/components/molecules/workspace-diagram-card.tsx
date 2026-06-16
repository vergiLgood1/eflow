import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { Globe, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { ShareDiagramDialog } from "../organisms/share-diagram-dialog";
import { useDiagramActions } from "../../hooks/use-diagram-actions";
import { WorkspaceDiagramDropdown } from "./workspace-diagram-dropdown";

interface WorkspaceDiagramCardProps {
  id: string;
  title: string;
  workspaceName: string;
  workspaceSlug: string;
  dbType: string;
  updatedAt: string;
  isPublic?: boolean;
  isPinned?: boolean;
  className?: string;
}

export function WorkspaceDiagramCard({
  id,
  title,
  workspaceName,
  workspaceSlug,
  dbType,
  updatedAt,
  isPublic = true,
  isPinned: initialIsPinned = false,
  className,
}: WorkspaceDiagramCardProps) {
  const router = useRouter();
  const { handlePin, handleDelete, handleActionClick } = useDiagramActions(id);

  const handleClick = () => {
    router.push(`/workspaces/${workspaceSlug}/model/${id}`);
  };

  return (
    <div
      className={cn(
        "group bg-card/50 border-border hover:border-border/80 flex cursor-pointer flex-col overflow-hidden rounded-xl border text-left transition-all hover:shadow-lg hover:shadow-black/20",
        className,
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="bg-background relative h-32 bg-[radial-gradient(circle,rgba(63,63,70,0.1)_1px,transparent_1px)] bg-size-[12px_12px]">
        {/* Visual Preview Placeholder */}
        <div className="absolute inset-4 flex items-center justify-center gap-2 opacity-30 transition-opacity group-hover:opacity-50">
          <div className="bg-muted border-border border-t-primary h-12 w-16 rounded border border-t-[3px]" />
          <div className="bg-muted border-border border-t-primary h-10 w-16 rounded border border-t-[3px]" />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-muted-foreground absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100",
            initialIsPinned && "text-yellow-500 opacity-100",
          )}
          onClick={handlePin}
        >
          <Star className={cn("h-4 w-4", initialIsPinned && "fill-current")} />
        </Button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px]">
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
          <span className="text-muted-foreground truncate font-semibold tracking-wider uppercase">
            {workspaceName}
          </span>
          {isPublic ? (
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-400">
              <Globe className="h-2.5 w-2.5" />
              Public
            </span>
          ) : (
            <span className="bg-muted border-border text-muted-foreground ml-auto inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-medium">
              Private
            </span>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-foreground flex-1 truncate font-semibold">
            {title}
          </h3>
          <div
            className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleActionClick}
          >
            <ShareDiagramDialog title={title}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-muted/50 h-7 w-7 rounded-full"
              >
                <Users className="h-3.5 w-3.5" />
              </Button>
            </ShareDiagramDialog>

            <WorkspaceDiagramDropdown
              id={id}
              isPublic={isPublic}
              isPinned={initialIsPinned}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <div className="text-muted-foreground mt-auto flex items-center justify-between text-[11px] font-medium tracking-wider uppercase">
          <span>{dbType}</span>
          <span>{updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

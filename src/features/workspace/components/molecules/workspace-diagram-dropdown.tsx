import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Ellipsis, Globe, Lock, Pencil, Star, Trash2 } from "lucide-react";
import type React from "react";
import { useDiagramActions } from "../../hooks/use-diagram-actions";

interface WorkspaceDiagramDropdownProps {
  id: string;
  isPublic: boolean;
  isPinned: boolean;
  onEdit?: () => void;
  onDelete?: (event: React.MouseEvent) => void;
}

export function WorkspaceDiagramDropdown({
  id,
  isPublic,
  isPinned,
  onEdit,
  onDelete,
}: WorkspaceDiagramDropdownProps) {
  const { handlePin, handleVisibility } = useDiagramActions(id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8 w-8"
        >
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="border-border/60 w-40 rounded-xl shadow-xl"
      >
        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg py-2 font-medium"
          onClick={handleVisibility}
        >
          {isPublic ? (
            <>
              <Lock className="h-3.5 w-3.5" />
              Make Private
            </>
          ) : (
            <>
              <Globe className="h-3.5 w-3.5" />
              Make Public
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg py-2 font-medium"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg py-2 font-medium"
          onClick={handlePin}
        >
          <Star className="h-3.5 w-3.5" />
          {isPinned ? "Unstar" : "Star"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2 rounded-lg py-2 font-medium"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

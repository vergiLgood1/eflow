import { Button } from "@/shared/components/ui/button";
import { SearchX } from "lucide-react";

interface WorkspaceDiagramEmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function WorkspaceDiagramEmptyState({
  searchQuery,
  onClearSearch,
}: WorkspaceDiagramEmptyStateProps) {
  if (searchQuery) {
    return (
      <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center py-20 text-center duration-300">
        <div className="bg-muted/30 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <SearchX className="text-muted-foreground/40 h-10 w-10" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-bold">
          No diagrams found
        </h3>
        <p className="text-muted-foreground mx-auto mb-8 max-w-xs">
          We couldn't find any diagrams matching{" "}
          <span className="text-foreground font-semibold">"{searchQuery}"</span>
          .
        </p>
        {onClearSearch && (
          <Button
            variant="outline"
            onClick={onClearSearch}
            className="border-border/60 hover:bg-accent rounded-xl"
          >
            Clear search
          </Button>
        )}
      </div>
    );
  }

  return null; // The full empty state is handled by WorkspaceDashboardEmptyState
}

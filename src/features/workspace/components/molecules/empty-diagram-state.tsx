import { Button } from "@/shared/components/ui/button";
import { Database, Plus, SearchX } from "lucide-react";
import { CreateDiagramDialog } from "../organisms/create-diagram-dialog";

interface EmptyDiagramStateProps {
  type?: "empty" | "no-search";
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function EmptyDiagramState({
  type = "empty",
  searchQuery,
  onClearSearch,
}: EmptyDiagramStateProps) {
  if (type === "no-search") {
    return (
      <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center px-6 py-24 text-center duration-500">
        <div className="bg-muted/30 mb-8 flex h-24 w-24 rotate-12 items-center justify-center rounded-3xl transition-transform duration-500 group-hover:rotate-0">
          <SearchX className="text-muted-foreground/40 h-12 w-12" />
        </div>
        <h3 className="text-foreground mb-3 text-2xl font-bold">
          No results found
        </h3>
        <p className="text-muted-foreground mx-auto mb-10 max-w-sm text-base leading-relaxed">
          We couldn't find any data models matching{" "}
          <span className="text-primary font-bold">"{searchQuery}"</span>. Try
          adjusting your search term.
        </p>
        {onClearSearch && (
          <Button
            variant="outline"
            size="lg"
            onClick={onClearSearch}
            className="border-border/60 hover:bg-accent hover:border-border rounded-xl px-8 text-[13px] font-bold transition-all"
          >
            Clear Search
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-muted/10 border-border/40 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-24 text-center duration-700">
      <div className="bg-primary/10 mb-8 flex h-24 w-24 -rotate-6 items-center justify-center rounded-3xl">
        <Database className="text-primary h-12 w-12" />
      </div>
      <h3 className="text-foreground mb-3 text-2xl font-extrabold">
        No data models yet
      </h3>
      <p className="text-muted-foreground mx-auto mb-10 max-w-sm text-base leading-relaxed font-medium">
        Start by creating your first ER diagram. You can import from SQL or use
        one of our templates.
      </p>
      <CreateDiagramDialog>
        <Button
          size="lg"
          className="shadow-primary/20 h-12 gap-2.5 rounded-xl px-10 text-[13px] font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Create Your First Model
        </Button>
      </CreateDiagramDialog>
    </div>
  );
}

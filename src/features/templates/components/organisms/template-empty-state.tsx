import { SearchX } from "lucide-react";

export function TemplateEmptyState() {
  return (
    <div className="border-border/40 bg-card/20 animate-in fade-in slide-in-from-bottom-4 rounded-3xl border-2 border-dashed p-20 text-center duration-500">
      <div className="bg-muted/30 mx-auto mb-6 flex h-20 w-20 rotate-6 items-center justify-center rounded-2xl transition-transform group-hover:rotate-0">
        <SearchX className="text-muted-foreground/40 h-10 w-10" />
      </div>
      <h3 className="text-foreground text-xl font-bold">No templates found</h3>
      <p className="text-muted-foreground mx-auto mt-2 max-w-xs text-sm font-medium">
        Try a different search or adjust your database filters to find what
        you're looking for.
      </p>
    </div>
  );
}

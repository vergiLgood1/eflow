import { SearchX } from "lucide-react";

export function TemplateEmptyState() {
    return (
        <div className="rounded-3xl border-2 border-dashed border-border/40 bg-card/20 p-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-20 w-20 rounded-2xl bg-muted/30 flex items-center justify-center mx-auto mb-6 rotate-6 group-hover:rotate-0 transition-transform">
                <SearchX className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No templates found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto font-medium">
                Try a different search or adjust your database filters to find what you're looking for.
            </p>
        </div>
    );
}

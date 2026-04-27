import { Button } from "@/shared/components/ui/button";
import { SearchX } from "lucide-react";

interface WorkspaceDiagramEmptyStateProps {
    searchQuery?: string;
    onClearSearch?: () => void;
}

export function WorkspaceDiagramEmptyState({ searchQuery, onClearSearch }: WorkspaceDiagramEmptyStateProps) {
    if (searchQuery) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                    <SearchX className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No diagrams found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mb-8">
                    We couldn't find any diagrams matching <span className="font-semibold text-foreground">"{searchQuery}"</span>.
                </p>
                {onClearSearch && (
                    <Button 
                        variant="outline" 
                        onClick={onClearSearch}
                        className="rounded-xl border-border/60 hover:bg-accent"
                    >
                        Clear search
                    </Button>
                )}
            </div>
        );
    }

    return null; // The full empty state is handled by WorkspaceDashboardEmptyState
}

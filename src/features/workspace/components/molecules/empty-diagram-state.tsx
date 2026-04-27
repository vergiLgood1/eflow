import { Button } from "@/shared/components/ui/button";
import { Database, Plus, SearchX } from "lucide-react";
import { CreateDiagramDialog } from "../organisms/create-diagram-dialog";

interface EmptyDiagramStateProps {
    type?: "empty" | "no-search";
    searchQuery?: string;
    onClearSearch?: () => void;
}

export function EmptyDiagramState({ type = "empty", searchQuery, onClearSearch }: EmptyDiagramStateProps) {
    if (type === "no-search") {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-24 w-24 rounded-3xl bg-muted/30 flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <SearchX className="h-12 w-12 text-muted-foreground/40" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">No results found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-10 text-base leading-relaxed">
                    We couldn't find any data models matching <span className="font-bold text-primary">"{searchQuery}"</span>. Try adjusting your search term.
                </p>
                {onClearSearch && (
                    <Button 
                        variant="outline" 
                        size="lg"
                        onClick={onClearSearch}
                        className="rounded-xl border-border/60 hover:bg-accent hover:border-border font-bold text-[13px] px-8 transition-all"
                    >
                        Clear Search
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 -rotate-6">
                <Database className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-extrabold text-foreground mb-3">No data models yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-10 text-base leading-relaxed font-medium">
                Start by creating your first ER diagram. You can import from SQL or use one of our templates.
            </p>
            <CreateDiagramDialog>
                <Button 
                    size="lg"
                    className="h-12 px-10 gap-2.5 shadow-lg shadow-primary/20 font-bold text-[13px] rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    Create Your First Model
                </Button>
            </CreateDiagramDialog>
        </div>
    );
}

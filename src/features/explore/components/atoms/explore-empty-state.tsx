import { Button } from "@/shared/components/ui/button";
import { Globe, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExploreEmptyStateProps {
    type?: "empty" | "no-search";
    searchQuery?: string;
}

export function ExploreEmptyState({ type = "empty", searchQuery }: ExploreEmptyStateProps) {
    const router = useRouter();

    const handleClearSearch = () => {
        router.push("/explore");
    };

    if (type === "no-search") {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6 rotate-12">
                    <SearchX className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No matching models</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8">
                    We couldn't find any public diagrams matching <span className="font-bold text-primary">"{searchQuery}"</span>.
                </p>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearSearch}
                    className="h-9 px-6 rounded-xl border-border/60 hover:bg-accent font-bold text-xs"
                >
                    Clear Search
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 -rotate-6">
                <Globe className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No public models yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-8 font-medium">
                The public gallery is currently empty. Be the first to share your diagram with the community!
            </p>
        </div>
    );
}

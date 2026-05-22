import { Button } from "@/shared/components/ui/button";
import { Globe, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExploreEmptyStateProps {
  type?: "empty" | "no-search";
  searchQuery?: string;
}

export function ExploreEmptyState({
  type = "empty",
  searchQuery,
}: ExploreEmptyStateProps) {
  const router = useRouter();

  const handleClearSearch = () => {
    router.push("/explore");
  };

  if (type === "no-search") {
    return (
      <div className="animate-in fade-in zoom-in flex flex-col items-center justify-center px-6 py-20 text-center duration-500">
        <div className="bg-muted/30 mb-6 flex h-20 w-20 rotate-12 items-center justify-center rounded-3xl">
          <SearchX className="text-muted-foreground/40 h-10 w-10" />
        </div>
        <h3 className="text-foreground mb-2 text-xl font-bold">
          No matching models
        </h3>
        <p className="text-muted-foreground mx-auto mb-8 max-w-xs text-sm">
          We couldn't find any public diagrams matching{" "}
          <span className="text-primary font-bold">"{searchQuery}"</span>.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearSearch}
          className="border-border/60 hover:bg-accent h-9 rounded-xl px-6 text-xs font-bold"
        >
          Clear Search
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/10 border-border/40 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-24 text-center duration-700">
      <div className="bg-primary/10 mb-6 flex h-20 w-20 -rotate-6 items-center justify-center rounded-3xl">
        <Globe className="text-primary h-10 w-10" />
      </div>
      <h3 className="text-foreground mb-2 text-xl font-bold">
        No public models yet
      </h3>
      <p className="text-muted-foreground mx-auto mb-8 max-w-xs text-sm font-medium">
        The public gallery is currently empty. Be the first to share your
        diagram with the community!
      </p>
    </div>
  );
}

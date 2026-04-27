import { Badge } from "@/shared/components/ui/badge";

export function ExploreCardBadge() {
    return (
        <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 text-[10px] px-2 py-0.5 bg-background/70 border border-border/70 text-foreground font-medium backdrop-blur-sm"
        >
            Public
        </Badge>
    );
}

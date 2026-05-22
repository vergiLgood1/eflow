import { Badge } from "@/shared/components/ui/badge";

export function ExploreCardBadge() {
  return (
    <Badge
      variant="secondary"
      className="bg-background/70 border-border/70 text-foreground absolute top-2 left-2 border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm"
    >
      Public
    </Badge>
  );
}

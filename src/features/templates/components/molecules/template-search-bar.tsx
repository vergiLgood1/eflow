import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface TemplateSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function TemplateSearchBar({ value, onChange }: TemplateSearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        className="bg-card/40 border-border/80 focus-visible:ring-ring/60 h-11 rounded-xl pr-10 pl-9 shadow-sm backdrop-blur transition-all focus-visible:ring-2"
        placeholder="Search templates..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

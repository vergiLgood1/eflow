import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";

interface TemplateSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export function TemplateSearchBar({ value, onChange }: TemplateSearchBarProps) {
    return (
        <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                className="h-11 pl-9 pr-10 rounded-xl bg-card/40 border-border/80 backdrop-blur focus-visible:ring-2 focus-visible:ring-ring/60 transition-all shadow-sm"
                placeholder="Search templates..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

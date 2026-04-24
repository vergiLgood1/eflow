import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

interface WorkspaceModelSearchInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function WorkspaceModelSearchInput({
    placeholder = "Search...",
    value,
    onChange,
}: WorkspaceModelSearchInputProps) {
    return (
        <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                className="h-[31px] w-full rounded border border-border bg-background px-2 pr-9 text-[13px] text-foreground placeholder:text-muted-foreground/50 shadow-none focus-visible:ring-1"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

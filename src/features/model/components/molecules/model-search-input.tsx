import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

interface ModelSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ModelSearchInput({
  placeholder = "Search...",
  value,
  onChange,
}: ModelSearchInputProps) {
  return (
    <div className="relative">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
      <Input
        className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 h-[31px] w-full rounded border px-2 pr-9 text-[13px] shadow-none focus-visible:ring-1"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

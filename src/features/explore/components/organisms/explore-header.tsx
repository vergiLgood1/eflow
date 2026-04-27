"use client";

import { Globe, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { PageHeaderBackground } from "@/shared/components/page-header-background";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounceValue } from "@/shared/hooks/use-debounce-value";

export function ExploreHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
    const [debouncedSearch] = useDebounceValue(searchValue, 300);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedSearch) {
            params.set("q", debouncedSearch);
        } else {
            params.delete("q");
        }
        // Only push if the query actually changed from what's in the URL
        if (params.get("q") !== searchParams.get("q")) {
            params.set("page", "1"); // Reset to page 1 on search
            router.push(`/explore?${params.toString()}`);
        }
    }, [debouncedSearch, router, searchParams]);

    return (
        <PageHeaderBackground>
            <div className="relative max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            Public gallery
                        </div>
                        <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                            Explore public models
                        </h1>
                        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                            Discover community diagrams, open instantly, and use the
                            share-link flow to view or edit (when permitted).
                        </p>
                        
                        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="relative w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="h-11 pl-9 pr-10 rounded-xl bg-card/40 border-border/80 backdrop-blur focus-visible:ring-2 focus-visible:ring-ring/60"
                                    placeholder="Search models or workspaces..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            className="shadow-sm h-9 px-4"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </div>
            </div>
        </PageHeaderBackground>
    );
}

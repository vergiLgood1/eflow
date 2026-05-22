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
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-muted-foreground inline-flex items-center gap-2 text-xs">
              <Globe className="h-4 w-4" />
              Public gallery
            </div>
            <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Explore public models
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              Discover community diagrams, open instantly, and use the
              share-link flow to view or edit (when permitted).
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-md">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  className="bg-card/40 border-border/80 focus-visible:ring-ring/60 h-11 rounded-xl pr-10 pl-9 backdrop-blur focus-visible:ring-2"
                  placeholder="Search models or workspaces..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              className="h-9 px-4 shadow-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </PageHeaderBackground>
  );
}

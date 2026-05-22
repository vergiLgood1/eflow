"use client";

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function ActivityFilterTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "all";
  const timeframe = searchParams.get("time") || "7d";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), {
      scroll: false,
    });
  };

  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <Tabs
        value={category}
        onValueChange={(value) => handleFilterChange("category", value)}
        className="w-auto"
      >
        <TabsList className="bg-muted/30 border-border/50 h-9 border p-0.5">
          <TabsTrigger
            value="all"
            className="h-[30px] px-4 font-mono text-[10px] tracking-widest uppercase"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="create"
            className="h-[30px] px-4 font-mono text-[10px] tracking-widest uppercase"
          >
            Created
          </TabsTrigger>
          <TabsTrigger
            value="update"
            className="h-[30px] px-4 font-mono text-[10px] tracking-widest uppercase"
          >
            Updated
          </TabsTrigger>
          <TabsTrigger
            value="delete"
            className="h-[30px] px-4 font-mono text-[10px] tracking-widest uppercase"
          >
            Deleted
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex items-center gap-2">
        <Tabs
          value={timeframe}
          onValueChange={(value) => handleFilterChange("time", value)}
          className="w-auto"
        >
          <TabsList className="bg-muted/30 border-border/50 h-9 border p-0.5">
            <TabsTrigger
              value="24h"
              className="h-[30px] px-3 font-mono text-[10px] tracking-widest uppercase"
            >
              24h
            </TabsTrigger>
            <TabsTrigger
              value="7d"
              className="h-[30px] px-3 font-mono text-[10px] tracking-widest uppercase"
            >
              7d
            </TabsTrigger>
            <TabsTrigger
              value="30d"
              className="h-[30px] px-3 font-mono text-[10px] tracking-widest uppercase"
            >
              30d
            </TabsTrigger>
            <TabsTrigger
              value="max"
              className="h-[30px] px-3 font-mono text-[10px] tracking-widest uppercase"
            >
              Max
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

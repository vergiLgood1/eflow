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
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <Tabs
                value={category}
                onValueChange={(value) => handleFilterChange("category", value)}
                className="w-auto"
            >
                <TabsList className="bg-muted/30 border border-border/50 h-9 p-0.5">
                    <TabsTrigger value="all" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-4">
                        All
                    </TabsTrigger>
                    <TabsTrigger value="create" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-4">
                        Created
                    </TabsTrigger>
                    <TabsTrigger value="update" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-4">
                        Updated
                    </TabsTrigger>
                    <TabsTrigger value="delete" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-4">
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
                    <TabsList className="bg-muted/30 border border-border/50 h-9 p-0.5">
                        <TabsTrigger value="24h" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-3">
                            24h
                        </TabsTrigger>
                        <TabsTrigger value="7d" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-3">
                            7d
                        </TabsTrigger>
                        <TabsTrigger value="30d" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-3">
                            30d
                        </TabsTrigger>
                        <TabsTrigger value="max" className="h-[30px] text-[10px] uppercase font-mono tracking-widest px-3">
                            Max
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
}

"use client";

import { Button } from "@/shared/components/ui/button";
import { Activity, ArrowLeft, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

export function ActivityHeader() {
  const router = useRouter();

  return (
    <div className="border-border relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_20%_10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(700px_400px_at_70%_30%,rgba(34,197,94,0.1),transparent_60%),radial-gradient(800px_400px_at_40%_80%,rgba(244,63,94,0.12),transparent_60%)]" />
      <div className="bg-background absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.22)_1px,transparent_1px)] mask-[radial-gradient(60%_55%_at_50%_20%,black_55%,transparent_100%)] bg-size-[28px_28px] opacity-[0.35]" />
      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-muted-foreground inline-flex items-center gap-2 text-xs">
              <Activity className="h-4 w-4" />
              Activity log
            </div>
            <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Activity History
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              My Workspace — Change Log
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Sync
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

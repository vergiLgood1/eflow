import { ArrowLeft, Database, LayoutTemplate } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { TemplateSearchBar } from "../molecules/template-search-bar";

interface TemplateHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
}

export function TemplateHero({
  searchQuery,
  onSearchChange,
  totalCount,
}: TemplateHeroProps) {
  const router = useRouter();

  return (
    <div className="border-border relative overflow-hidden border-b">
      {/* Artistic background patterns using Tailwind arbitrary values */}
      <div className="absolute inset-0 bg-[radial-gradient(800px_450px_at_30%_20%,rgba(251,146,60,0.14),transparent_60%),radial-gradient(700px_400px_at_70%_40%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(600px_350px_at_50%_90%,rgba(34,197,94,0.08),transparent_60%)]" />

      <div className="bg-background absolute inset-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.18)_1px,transparent_1px),linear-gradient(rgba(63,63,70,0.18)_1px,transparent_1px)] mask-[radial-gradient(60%_55%_at_50%_20%,black_55%,transparent_100%)] bg-size-[32px_32px] opacity-[0.25]" />

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase">
              <LayoutTemplate className="text-primary h-4 w-4" />
              Curated collection
            </div>
            <h1 className="text-foreground mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Templates
            </h1>
            <p className="text-muted-foreground mt-3 max-w-xl text-base leading-relaxed font-medium">
              Curated database schemas to jumpstart your project. Clone any
              template into your workspace in one click.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <TemplateSearchBar
                value={searchQuery}
                onChange={onSearchChange}
              />

              <div className="text-muted-foreground bg-background/40 border-border/40 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold backdrop-blur-sm">
                <Database className="h-4 w-4 opacity-60" />
                <span className="tabular-nums">— {totalCount} Templates</span>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              className="border-border/60 hover:bg-background/80 hover:border-border h-10 gap-2 rounded-xl px-5 text-xs font-bold shadow-sm transition-all"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

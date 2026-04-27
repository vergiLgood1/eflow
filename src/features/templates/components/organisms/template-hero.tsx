import { ArrowLeft, Database, LayoutTemplate } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";
import { TemplateSearchBar } from "../molecules/template-search-bar";

interface TemplateHeroProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    totalCount: number;
}

export function TemplateHero({ searchQuery, onSearchChange, totalCount }: TemplateHeroProps) {
    const router = useRouter();

    return (
        <div className="relative overflow-hidden border-b border-border">
            {/* Artistic background patterns using Tailwind arbitrary values */}
            <div className="absolute inset-0 bg-[radial-gradient(800px_450px_at_30%_20%,rgba(251,146,60,0.14),transparent_60%),radial-gradient(700px_400px_at_70%_40%,rgba(99,102,241,0.12),transparent_60%),radial-gradient(600px_350px_at_50%_90%,rgba(34,197,94,0.08),transparent_60%)]" />
            
            <div className="absolute inset-0 opacity-[0.25] bg-background bg-[linear-gradient(to_right,rgba(63,63,70,0.18)_1px,transparent_1px),linear-gradient(rgba(63,63,70,0.18)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(60%_55%_at_50%_20%,black_55%,transparent_100%)]" />

            <div className="relative max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <LayoutTemplate className="h-4 w-4 text-primary" />
                            Curated collection
                        </div>
                        <h1 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-foreground">
                            Templates
                        </h1>
                        <p className="mt-3 text-base text-muted-foreground max-w-xl leading-relaxed font-medium">
                            Curated database schemas to jumpstart your project. Clone any
                            template into your workspace in one click.
                        </p>
                        
                        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                            <TemplateSearchBar value={searchQuery} onChange={onSearchChange} />
                            
                            <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold bg-background/40 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/40">
                                <Database className="h-4 w-4 opacity-60" />
                                <span className="tabular-nums">— {totalCount} Templates</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            className="h-10 px-5 gap-2 rounded-xl border-border/60 hover:bg-background/80 hover:border-border font-bold text-xs transition-all shadow-sm"
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

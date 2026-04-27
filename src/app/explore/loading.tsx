import { Globe, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { PageHeaderBackground } from "@/shared/components/page-header-background";
import { ExploreSkeleton } from "@/features/explore/components/atoms/explore-skeleton";

export default function ExploreLoading() {
    return (
        <div className="flex h-full w-full flex-col flex-1 overflow-hidden">
            <div className="h-full w-full overflow-auto">
                <div className="min-h-[calc(100vh-48px)] bg-background">
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
                                                disabled
                                                className="h-11 pl-9 pr-10 rounded-xl bg-card/40 border-border/80 backdrop-blur opacity-50"
                                                placeholder="Search models or workspaces..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PageHeaderBackground>
                    
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        <ExploreSkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Globe, Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { PageHeaderBackground } from "@/shared/components/page-header-background";
import { ExploreSkeleton } from "@/features/explore/components/atoms/explore-skeleton";

export default function ExploreLoading() {
  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden">
      <div className="h-full w-full overflow-auto">
        <div className="bg-background min-h-[calc(100vh-48px)]">
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
                        disabled
                        className="bg-card/40 border-border/80 h-11 rounded-xl pr-10 pl-9 opacity-50 backdrop-blur"
                        placeholder="Search models or workspaces..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PageHeaderBackground>

          <div className="mx-auto max-w-6xl px-6 py-8">
            <ExploreSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

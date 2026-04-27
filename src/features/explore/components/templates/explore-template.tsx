import { ExploreData } from "../../types/explore";
import { ExploreHeader } from "../organisms/explore-header";
import { ExploreGrid } from "../organisms/explore-grid";
import { ExplorePagination } from "../organisms/explore-pagination";

interface ExploreTemplateProps {
    data: ExploreData;
}

export function ExploreTemplate({ data }: ExploreTemplateProps) {
    return (
        <div className="flex h-full w-full flex-col flex-1 overflow-hidden">
            <div className="h-full w-full overflow-auto">
                <div className="min-h-[calc(100vh-48px)] bg-background">
                    <ExploreHeader />
                    
                    <div className="max-w-6xl mx-auto px-6 py-8">
                        <ExploreGrid models={data.models} />
                        
                        <ExplorePagination 
                            currentPage={data.page}
                            totalPages={data.totalPages}
                            totalItems={data.total}
                            itemsPerPage={20}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

import { ExploreTemplate } from "@/features/explore/components/templates/explore-template";
import { getPublicDataModels } from "@/features/explore/applications/explore.action";

export const metadata = {
    title: "Explore | eFlow",
    description: "Discover community diagrams and public models.",
};

interface ExplorePageProps {
    searchParams: Promise<{
        q?: string;
        page?: string;
    }>;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const params = await searchParams;
    const query = params.q || "";
    const page = Number(params.page) || 1;

    const data = await getPublicDataModels(query, page);

    return <ExploreTemplate data={data} />;
}
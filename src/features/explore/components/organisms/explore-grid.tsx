"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ExploreModel } from "../../types/explore";
import { ExploreCard } from "../molecules/explore-card";
import { ExploreEmptyState } from "../atoms/explore-empty-state";

interface ExploreGridProps {
  models: ExploreModel[];
}

export function ExploreGrid({ models }: ExploreGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleCardClick = (model: ExploreModel) => {
    router.push(`/workspaces/${model.workspaceSlug}/model/${model.id}`);
  };

  if (models.length === 0) {
    return (
      <ExploreEmptyState
        type={query ? "no-search" : "empty"}
        searchQuery={query}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {models.map((model) => (
        <ExploreCard
          key={model.id}
          model={model}
          onClick={() => handleCardClick(model)}
        />
      ))}
    </div>
  );
}

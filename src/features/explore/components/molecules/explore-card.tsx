"use client";

import { Star } from "lucide-react";
import { ExploreModel } from "../../types/explore";
import { ExploreCardBadge } from "../atoms/explore-card-badge";
import { ExploreCardStatus } from "../atoms/explore-card-status";
import { cn } from "@/shared/lib/utils";

interface ExploreCardProps {
  model: ExploreModel;
  onClick?: () => void;
}

export function ExploreCard({ model, onClick }: ExploreCardProps) {
  return (
    <div
      className="group bg-card/50 border-border hover:border-border/80 cursor-pointer overflow-hidden rounded-xl border text-left transition-all hover:shadow-lg hover:shadow-black/20"
      role="button"
      tabIndex={0}
      onClick={onClick}
    >
      <div className="bg-background relative h-28 bg-[linear-gradient(to_right,rgba(63,63,70,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.18)_1px,transparent_1px)] bg-size-[14px_14px]">
        <div className="absolute inset-4 flex items-center justify-center gap-2 opacity-60 transition-opacity group-hover:opacity-80">
          <div
            className="bg-muted border-border h-12 w-16 rounded border"
            style={{
              borderTopColor: model.previewColor,
              borderTopWidth: "3px",
            }}
          />
          <div
            className="bg-muted border-border h-10 w-16 rounded border"
            style={{
              borderTopColor: model.previewColor,
              borderTopWidth: "3px",
            }}
          />
        </div>

        <ExploreCardBadge />

        <button
          aria-label="Star"
          className="text-muted-foreground absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 hover:text-yellow-500"
          onClick={(e) => {
            e.stopPropagation();
            // handle star logic
          }}
        >
          <Star className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <ExploreCardStatus color={model.previewColor} />
          <span className="text-muted-foreground truncate text-xs">
            {model.owner}
          </span>
        </div>
        <h3 className="text-foreground mb-2 truncate font-medium">
          {model.name}
        </h3>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="truncate" />
          <span>{model.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}

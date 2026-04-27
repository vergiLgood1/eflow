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
            className="group bg-card/50 border border-border rounded-xl overflow-hidden text-left cursor-pointer transition-all hover:border-border/80 hover:shadow-lg hover:shadow-black/20"
            role="button"
            tabIndex={0}
            onClick={onClick}
        >
            <div
                className="h-28 relative bg-background bg-[linear-gradient(to_right,rgba(63,63,70,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.18)_1px,transparent_1px)] bg-size-[14px_14px]"
            >
                <div className="absolute inset-4 flex items-center justify-center gap-2 opacity-60 group-hover:opacity-80 transition-opacity">
                    <div
                        className="w-16 h-12 bg-muted border border-border rounded"
                        style={{
                            borderTopColor: model.previewColor,
                            borderTopWidth: "3px",
                        }}
                    />
                    <div
                        className="w-16 h-10 bg-muted border border-border rounded"
                        style={{
                            borderTopColor: model.previewColor,
                            borderTopWidth: "3px",
                        }}
                    />
                </div>
                
                <ExploreCardBadge />
                
                <button
                    aria-label="Star"
                    className="absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-yellow-500"
                    onClick={(e) => {
                        e.stopPropagation();
                        // handle star logic
                    }}
                >
                    <Star className="h-4 w-4" />
                </button>
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                    <ExploreCardStatus color={model.previewColor} />
                    <span className="text-xs text-muted-foreground truncate">
                        {model.owner}
                    </span>
                </div>
                <h3 className="font-medium text-foreground mb-2 truncate">
                    {model.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate" />
                    <span>{model.updatedAt}</span>
                </div>
            </div>
        </div>
    );
}

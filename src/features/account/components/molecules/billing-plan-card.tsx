import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface BillingPlanCardProps {
  name: string;
  description: string;
  price: string;
  isActive?: boolean;
  priceInterval?: string;
  actionLabel?: string;
  actionDisabled?: boolean;
  onAction?: () => void;
}

export function BillingPlanCard({
  name,
  description,
  price,
  isActive = false,
  priceInterval = "/mo",
  actionLabel = "View Features",
  actionDisabled = false,
  onAction,
}: BillingPlanCardProps) {
  return (
    <div className="border-border bg-card rounded-2xl border p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            {name}
            {isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            )}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
        <h2 className="text-3xl font-bold tracking-tighter">
          {price}
          <span className="text-muted-foreground text-sm font-normal">
            {priceInterval}
          </span>
        </h2>
      </div>

      <div className="mt-6">
        <Button
          className="w-full sm:w-auto"
          variant="outline"
          disabled={actionDisabled}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}

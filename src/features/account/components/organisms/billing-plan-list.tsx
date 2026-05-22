import React from "react";
import { CreditCard } from "lucide-react";
import { BillingPlanCard } from "../molecules/billing-plan-card";

export function BillingPlanList() {
  return (
    <div className="grid gap-6 pt-6">
      <BillingPlanCard
        name="Free Plan"
        description="You are currently on the free plan. Perfect for individuals."
        price="$0"
        isActive={true}
      />

      <div className="border-primary/20 bg-primary/5 relative overflow-hidden rounded-2xl border p-6">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <CreditCard className="h-24 w-24" />
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              Pro Plan
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Advanced features for professional developers and teams.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" /> Unlimited
                workspaces
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" /> Priority
                support
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" /> Advanced
                history
              </li>
            </ul>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">
            $19
            <span className="text-muted-foreground text-sm font-normal">
              /mo
            </span>
          </h2>
        </div>

        <div className="mt-6">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 w-full rounded-xl px-6 py-2.5 font-medium shadow-lg transition-colors sm:w-auto">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { BillingPlanList } from "../organisms/billing-plan-list";

export function BillingTemplate() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          Billing
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your billing information and subscription plan.
        </p>
      </div>
      <BillingPlanList />
    </div>
  );
}

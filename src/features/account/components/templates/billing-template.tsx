import React from "react";
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription.action";
import { BillingPlanList } from "../organisms/billing-plan-list";

export function BillingTemplate({
  subscriptionAccess,
}: {
  subscriptionAccess: SubscriptionAccess;
}) {
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
      <BillingPlanList subscriptionAccess={subscriptionAccess} />
    </div>
  );
}

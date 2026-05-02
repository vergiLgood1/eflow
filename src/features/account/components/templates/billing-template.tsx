import React from "react";
import { BillingPlanList } from "../organisms/billing-plan-list";

export function BillingTemplate() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Billing</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your billing information and subscription plan.
                </p>
            </div>
            <BillingPlanList />
        </div>
    );
}

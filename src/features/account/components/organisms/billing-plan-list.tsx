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

            <div className="p-6 border border-primary/20 rounded-2xl bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard className="h-24 w-24" />
                </div>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Pro Plan
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Advanced features for professional developers and teams.
                        </p>
                        <ul className="mt-4 space-y-2">
                            <li className="text-xs text-muted-foreground flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" /> Unlimited workspaces
                            </li>
                            <li className="text-xs text-muted-foreground flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" /> Priority support
                            </li>
                            <li className="text-xs text-muted-foreground flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-primary" /> Advanced history
                            </li>
                        </ul>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter">
                        $19<span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </h2>
                </div>

                <div className="mt-6">
                    <button className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Upgrade to Pro
                    </button>
                </div>
            </div>
        </div>
    );
}

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface BillingPlanCardProps {
    name: string;
    description: string;
    price: string;
    isActive?: boolean;
    priceInterval?: string;
}

export function BillingPlanCard({
    name,
    description,
    price,
    isActive = false,
    priceInterval = "/mo"
}: BillingPlanCardProps) {
    return (
        <div className="p-6 border border-border rounded-2xl bg-card">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        {name}
                        {isActive && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
                                <CheckCircle2 className="h-3 w-3" /> Active
                            </span>
                        )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        {description}
                    </p>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter">
                    {price}<span className="text-sm font-normal text-muted-foreground">{priceInterval}</span>
                </h2>
            </div>

            <div className="mt-6">
                <Button className="w-full sm:w-auto" variant="outline">View Features</Button>
            </div>
        </div>
    );
}

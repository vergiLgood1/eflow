"use client";

import React, { useTransition } from "react";
import { AlertTriangle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import type { SubscriptionAccess } from "@/features/subscription/applications/subscription-access";
import {
  activateDemoProSubscription,
  resetDemoFreeSubscription,
} from "@/features/subscription/applications/subscription.action";
import { BillingPlanCard } from "../molecules/billing-plan-card";

export function BillingPlanList({
  subscriptionAccess,
}: {
  subscriptionAccess: SubscriptionAccess;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { entitlements } = subscriptionAccess;
  const isDemoBilling = process.env.NODE_ENV !== "production";
  const isStripeBilling = subscriptionAccess.subscription?.provider === "stripe";
  const proPrice = isDemoBilling ? "$19" : "$9,999";

  const handleActivatePro = () => {
    startTransition(async () => {
      if (!isDemoBilling) {
        await redirectToBillingRoute("/api/billing/checkout");
        return;
      }

      const result = await activateDemoProSubscription();
      if (result.success) {
        toast.success(result.message ?? "Pro plan activated");
        router.refresh();
        return;
      }

      toast.error(result.error);
    });
  };

  const handleManageBilling = () => {
    startTransition(async () => {
      await redirectToBillingRoute("/api/billing/portal");
    });
  };

  const handleResetFree = () => {
    startTransition(async () => {
      const result = await resetDemoFreeSubscription();
      if (result.success) {
        toast.success(result.message ?? "Free plan restored");
        router.refresh();
        return;
      }

      toast.error(result.error);
    });
  };

  return (
    <div className="grid gap-6 pt-6">
      {!isDemoBilling && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Portfolio showcase billing</AlertTitle>
          <AlertDescription>
            Stripe is connected for production-readiness, but the Pro price is
            intentionally unrealistic to discourage real purchases. Do not
            upgrade unless this is a controlled test checkout.
          </AlertDescription>
        </Alert>
      )}

      <BillingPlanCard
        name="Free Plan"
        description="1 workspace, 3 public data models, and no private diagrams."
        price="$0"
        isActive={!entitlements.isPro}
        actionLabel={entitlements.isPro ? "Switch to Free" : "Current Plan"}
        actionDisabled={!entitlements.isPro || !isDemoBilling || isPending}
        onAction={handleResetFree}
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
              Pro unlocks unlimited workspace and data model creation. The
              production Stripe price is intentionally unrealistic for portfolio
              safety.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" /> Unlimited
                workspaces and data models
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" /> Private data
                models
              </li>
              <li className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" /> Stripe-ready
                production billing with anti-purchase pricing
              </li>
            </ul>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter">
            {proPrice}
            <span className="text-muted-foreground text-sm font-normal">
              /mo
            </span>
          </h2>
        </div>

        <div className="mt-6">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 disabled:bg-muted disabled:text-muted-foreground w-full rounded-xl px-6 py-2.5 font-medium shadow-lg transition-colors disabled:cursor-not-allowed disabled:shadow-none sm:w-auto"
            disabled={isPending}
            onClick={
              entitlements.isPro && isStripeBilling
                ? handleManageBilling
                : handleActivatePro
            }
          >
            {entitlements.isPro
              ? isStripeBilling
                ? "Manage Billing"
                : "Current Plan"
              : isDemoBilling
                ? "Activate Demo Pro"
                : "Test Stripe Checkout"}
          </button>
          {!isDemoBilling && !entitlements.isPro && (
            <p className="text-muted-foreground mt-3 max-w-md text-xs">
              This checkout uses an intentionally high Stripe price. It exists
              only to demonstrate production billing flow readiness.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

async function redirectToBillingRoute(path: string): Promise<void> {
  const response = await fetch(path, { method: "POST" });
  const result = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !result.url) {
    toast.error(result.error ?? "Unable to start billing session");
    return;
  }

  window.location.href = result.url;
}

"use server";

import { db } from "@/db/prisma";
import { requireUser } from "@/features/authentication/lib/auth-guard";
import { handleActionError, type ActionResponse } from "@/shared/lib/error";
import {
  getUserSubscriptionAccess,
  type SubscriptionAccess,
} from "./subscription-access";
import { ensureDemoBillingAllowed } from "./subscription-policy";

/**
 * The signed-in user's subscription state, for server components.
 *
 * Reads the id from the session so the caller cannot ask for someone else's
 * plan; the lookup itself lives in `subscription-access.ts`, away from the
 * network-reachable surface of this module.
 */
export async function getCurrentUserSubscriptionAccess(): Promise<SubscriptionAccess> {
  const user = await requireUser();
  return getUserSubscriptionAccess(user.id);
}

export async function activateDemoProSubscription(): Promise<ActionResponse> {
  try {
    ensureDemoBillingAllowed();

    const user = await requireUser();

    await db.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
        provider: "demo",
      },
      create: {
        userId: user.id,
        plan: "PRO",
        status: "ACTIVE",
        provider: "demo",
      },
    });

    return { success: true, message: "Demo Pro plan activated" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function resetDemoFreeSubscription(): Promise<ActionResponse> {
  try {
    ensureDemoBillingAllowed();

    const user = await requireUser();

    await db.subscription.upsert({
      where: { userId: user.id },
      update: {
        plan: "FREE",
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
        provider: "demo",
      },
      create: {
        userId: user.id,
        plan: "FREE",
        status: "ACTIVE",
        provider: "demo",
      },
    });

    return { success: true, message: "Demo Free plan restored" };
  } catch (error) {
    return handleActionError(error);
  }
}

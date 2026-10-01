import { db } from "@/db/prisma";
import { AppError } from "@/shared/lib/error";
import type { Subscription } from "../../../../prisma/generated";
import { getEntitlements } from "./subscription-policy";

/**
 * The caller's subscription row (trimmed to what the UI needs) plus the
 * entitlements derived from it.
 */
export type SubscriptionAccess = {
  subscription: Pick<
    Subscription,
    "plan" | "status" | "cancelAtPeriodEnd" | "currentPeriodEnd" | "provider"
  > | null;
  entitlements: ReturnType<typeof getEntitlements>;
};

/**
 * Read the subscription state for a user id.
 *
 * Server-only, not an action: the `userId` is a trusted argument resolved from
 * a session by the caller, and a `"use server"` export would let anyone query
 * any account's plan over the network. The session-derived wrapper lives in
 * `subscription.action.ts`.
 */
export async function getUserSubscriptionAccess(
  userId: string,
): Promise<SubscriptionAccess> {
  const subscription = await db.subscription.findUnique({
    where: { userId },
    select: {
      plan: true,
      status: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: true,
      provider: true,
    },
  });

  const plan = subscription?.plan ?? "FREE";
  const status = subscription?.status ?? "ACTIVE";

  return {
    subscription,
    entitlements: getEntitlements(plan, status),
  };
}

export async function requireCanCreateWorkspace(userId: string): Promise<void> {
  const { entitlements } = await getUserSubscriptionAccess(userId);
  if (entitlements.maxWorkspaces === null) return;

  const workspaceCount = await db.workspace.count({
    where: { members: { some: { userId } } },
  });

  if (workspaceCount >= entitlements.maxWorkspaces) {
    throw new AppError(
      "Free plan is limited to 1 workspace. Upgrade to Pro to create more workspaces.",
      403,
      "SUBSCRIPTION_LIMIT_REACHED",
      { limit: entitlements.maxWorkspaces, usage: workspaceCount },
    );
  }
}

export async function requireCanCreateDataModel(
  userId: string,
  workspaceId: string,
  isPublic: boolean,
): Promise<void> {
  const { entitlements } = await getUserSubscriptionAccess(userId);

  if (!isPublic && !entitlements.canCreatePrivateModels) {
    throw new AppError(
      "Free plan only supports public data models. Upgrade to Pro to create private models.",
      403,
      "SUBSCRIPTION_PRIVATE_MODEL_REQUIRED",
    );
  }

  if (entitlements.maxPublicModels === null) return;

  const publicModelCount = await db.dataModel.count({
    where: { workspaceId, isPublic: true },
  });

  if (publicModelCount >= entitlements.maxPublicModels) {
    throw new AppError(
      "Free plan is limited to 3 public data models. Upgrade to Pro to create more models.",
      403,
      "SUBSCRIPTION_LIMIT_REACHED",
      { limit: entitlements.maxPublicModels, usage: publicModelCount },
    );
  }
}

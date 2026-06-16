"use server";

import { db } from "@/db/prisma";
import { auth } from "@/features/authentication/lib/auth-server";
import {
  AppError,
  handleActionError,
  type ActionResponse,
} from "@/shared/lib/error";
import type { Subscription } from "../../../../prisma/generated";
import {
  getEntitlements,
  type SubscriptionEntitlements,
} from "./subscription-policy";

export type SubscriptionAccess = {
  subscription: Pick<
    Subscription,
    | "plan"
    | "status"
    | "cancelAtPeriodEnd"
    | "currentPeriodEnd"
    | "provider"
  > | null;
  entitlements: SubscriptionEntitlements;
};

export async function getCurrentUserSubscriptionAccess(): Promise<SubscriptionAccess> {
  const session = await auth.getSession();
  const userId = session.data?.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  return getUserSubscriptionAccess(userId);
}

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

export async function activateDemoProSubscription(): Promise<ActionResponse> {
  try {
    ensureDemoBillingAllowed();

    const session = await auth.getSession();
    const userId = session.data?.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    await db.subscription.upsert({
      where: { userId },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
        provider: "demo",
      },
      create: {
        userId,
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

    const session = await auth.getSession();
    const userId = session.data?.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    await db.subscription.upsert({
      where: { userId },
      update: {
        plan: "FREE",
        status: "ACTIVE",
        cancelAtPeriodEnd: false,
        provider: "demo",
      },
      create: {
        userId,
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

function ensureDemoBillingAllowed(): void {
  if (process.env.NODE_ENV === "production") {
    throw new AppError("Demo billing actions are disabled in production", 403);
  }
}

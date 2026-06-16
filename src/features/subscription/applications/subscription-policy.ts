import type {
  SubscriptionPlan,
  SubscriptionStatus,
} from "../../../../prisma/generated";

export const FREE_WORKSPACE_LIMIT = 1;
export const FREE_PUBLIC_MODEL_LIMIT = 3;

export type SubscriptionEntitlements = {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  isPro: boolean;
  maxWorkspaces: number | null;
  maxPublicModels: number | null;
  canCreatePrivateModels: boolean;
};

export function getEntitlements(
  plan: SubscriptionPlan,
  status: SubscriptionStatus,
): SubscriptionEntitlements {
  const isPro =
    plan === "PRO" && (status === "ACTIVE" || status === "TRIALING");

  return {
    plan,
    status,
    isPro,
    maxWorkspaces: isPro ? null : FREE_WORKSPACE_LIMIT,
    maxPublicModels: isPro ? null : FREE_PUBLIC_MODEL_LIMIT,
    canCreatePrivateModels: isPro,
  };
}

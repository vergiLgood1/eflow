import { db } from "@/db/prisma";
import { AppError } from "@/shared/lib/error";
import Stripe from "stripe";
import type { SubscriptionStatus } from "../../../../prisma/generated";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new AppError("Stripe secret key is not configured", 500);
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
}

export async function createCheckoutSession(input: {
  userId: string;
  email: string;
  name?: string | null;
}): Promise<string> {
  const appUrl = getAppUrl();
  const priceId = process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    throw new AppError("Stripe Pro price id is not configured", 500);
  }

  const stripe = getStripeClient();
  await assertProductionPriceIsIntentionallyHigh(stripe, priceId);

  const customerId = await getOrCreateStripeCustomer(input);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/account/billing?checkout=success`,
    cancel_url: `${appUrl}/account/billing?checkout=cancelled`,
    metadata: { userId: input.userId },
    subscription_data: { metadata: { userId: input.userId } },
  });

  if (!session.url) {
    throw new AppError("Stripe checkout session did not return a URL", 500);
  }

  return session.url;
}

export async function createBillingPortalSession(input: {
  userId: string;
}): Promise<string> {
  const subscription = await db.subscription.findUnique({
    where: { userId: input.userId },
    select: { providerCustomerId: true, provider: true },
  });

  if (!subscription?.providerCustomerId || subscription.provider !== "stripe") {
    throw new AppError("No Stripe billing account found for this user", 400);
  }

  const session = await getStripeClient().billingPortal.sessions.create({
    customer: subscription.providerCustomerId,
    return_url: `${getAppUrl()}/account/billing`,
  });

  return session.url;
}

export async function syncStripeSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId?: string,
): Promise<void> {
  const customerId = getStripeCustomerId(subscription.customer);
  const period = getSubscriptionPeriod(subscription);
  const userId =
    subscription.metadata.userId ||
    fallbackUserId ||
    (customerId ? await getUserIdByStripeCustomer(customerId) : null);

  if (!userId) {
    throw new AppError("Stripe subscription is missing user metadata", 422);
  }

  await db.subscription.upsert({
    where: { providerSubscriptionId: subscription.id },
    update: {
      userId,
      plan: "PRO",
      status: mapStripeSubscriptionStatus(subscription.status),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: toDate(period.currentPeriodStart),
      currentPeriodEnd: toDate(period.currentPeriodEnd),
      provider: "stripe",
      providerCustomerId: customerId,
      providerPriceId: subscription.items.data[0]?.price.id,
    },
    create: {
      userId,
      plan: "PRO",
      status: mapStripeSubscriptionStatus(subscription.status),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: toDate(period.currentPeriodStart),
      currentPeriodEnd: toDate(period.currentPeriodEnd),
      provider: "stripe",
      providerCustomerId: customerId,
      providerSubscriptionId: subscription.id,
      providerPriceId: subscription.items.data[0]?.price.id,
    },
  });
}

export async function markStripeSubscriptionCanceled(
  subscription: Stripe.Subscription,
): Promise<void> {
  const period = getSubscriptionPeriod(subscription);

  await db.subscription.updateMany({
    where: { providerSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
      cancelAtPeriodEnd: false,
      currentPeriodEnd: toDate(period.currentPeriodEnd),
    },
  });
}

export function constructStripeWebhookEvent(
  payload: string,
  signature: string | null,
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new AppError("Stripe webhook secret is not configured", 500);
  }
  if (!signature) {
    throw new AppError("Stripe webhook signature is missing", 400);
  }

  return getStripeClient().webhooks.constructEvent(
    payload,
    signature,
    webhookSecret,
  );
}

async function getOrCreateStripeCustomer(input: {
  userId: string;
  email: string;
  name?: string | null;
}): Promise<string> {
  const existing = await db.subscription.findUnique({
    where: { userId: input.userId },
    select: { providerCustomerId: true, provider: true },
  });

  if (existing?.provider === "stripe" && existing.providerCustomerId) {
    return existing.providerCustomerId;
  }

  const customer = await getStripeClient().customers.create({
    email: input.email,
    name: input.name ?? undefined,
    metadata: { userId: input.userId },
  });

  await db.subscription.upsert({
    where: { userId: input.userId },
    update: {
      provider: "stripe",
      providerCustomerId: customer.id,
    },
    create: {
      userId: input.userId,
      plan: "FREE",
      status: "ACTIVE",
      provider: "stripe",
      providerCustomerId: customer.id,
    },
  });

  return customer.id;
}

async function getUserIdByStripeCustomer(
  customerId: string,
): Promise<string | null> {
  const subscription = await db.subscription.findUnique({
    where: { providerCustomerId: customerId },
    select: { userId: true },
  });

  return subscription?.userId ?? null;
}

function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
): SubscriptionStatus {
  if (status === "active") return "ACTIVE";
  if (status === "trialing") return "TRIALING";
  if (status === "past_due") return "PAST_DUE";
  if (status === "canceled" || status === "unpaid") return "CANCELED";
  return "INCOMPLETE";
}

function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
): string | undefined {
  return typeof customer === "string" ? customer : customer.id;
}

function toDate(timestamp: number | null | undefined): Date | undefined {
  return typeof timestamp === "number" ? new Date(timestamp * 1000) : undefined;
}

function getSubscriptionPeriod(subscription: Stripe.Subscription): {
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
} {
  const item = subscription.items.data[0];

  return {
    currentPeriodStart: item?.current_period_start,
    currentPeriodEnd: item?.current_period_end,
  };
}

function getAppUrl(): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new AppError("NEXT_PUBLIC_APP_URL is not configured", 500);
  }

  return appUrl.replace(/\/$/, "");
}

async function assertProductionPriceIsIntentionallyHigh(
  stripe: Stripe,
  priceId: string,
): Promise<void> {
  if (process.env.NODE_ENV !== "production") return;

  const price = await stripe.prices.retrieve(priceId);
  const minimumShowcaseAmount = 999_900;

  if (price.unit_amount === null || price.unit_amount < minimumShowcaseAmount) {
    throw new AppError(
      "Production Stripe price must be intentionally high for this portfolio showcase",
      500,
      "STRIPE_PRICE_TOO_LOW_FOR_SHOWCASE",
      { minimumAmountInMinorUnits: minimumShowcaseAmount },
    );
  }
}

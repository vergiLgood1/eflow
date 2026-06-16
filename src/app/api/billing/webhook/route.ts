import {
  constructStripeWebhookEvent,
  getStripeClient,
  markStripeSubscriptionCanceled,
  syncStripeSubscription,
} from "@/features/subscription/applications/stripe-billing.service";
import { handleError } from "@/shared/lib/error";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");
    const event = constructStripeWebhookEvent(payload, signature);

    await handleStripeEvent(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    return handleError(error);
  }
}

async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.mode !== "subscription" || !session.subscription) return;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const subscription = await getStripeClient().subscriptions.retrieve(
        subscriptionId,
      );

      await syncStripeSubscription(subscription, session.metadata?.userId);
      return;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      await syncStripeSubscription(event.data.object);
      return;
    }
    case "customer.subscription.deleted": {
      await markStripeSubscriptionCanceled(event.data.object);
      return;
    }
    case "invoice.payment_failed":
    case "invoice.payment_succeeded":
      return;
    default:
      return;
  }
}

import { BillingTemplate } from "@/features/account/components/templates/billing-template";
import { getCurrentUserSubscriptionAccess } from "@/features/subscription/applications/subscription.action";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const subscriptionAccess = await getCurrentUserSubscriptionAccess();

  return <BillingTemplate subscriptionAccess={subscriptionAccess} />;
}

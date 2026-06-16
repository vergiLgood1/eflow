import { auth } from "@/features/authentication/lib/auth-server";
import { createBillingPortalSession } from "@/features/subscription/applications/stripe-billing.service";
import { handleError, AppError } from "@/shared/lib/error";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth.getSession();
    const user = session.data?.user;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const url = await createBillingPortalSession({ userId: user.id });

    return NextResponse.json({ url });
  } catch (error) {
    return handleError(error);
  }
}

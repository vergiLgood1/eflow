import { auth } from "@/features/authentication/lib/auth-server";
import { OnboardingTemplate } from "@/features/workspace/components/templates/onboarding-template";
import { redirect } from "next/navigation";

/**
 * Server Component for the Onboarding page.
 * Ensures the user is authenticated before allowing them to create their first workspace.
 */
export default async function OnboardingPage() {
  const session = await auth.getSession();

  // Protect the route - only logged in users can see onboarding
  if (!session.data) {
    redirect("/auth/sign-in");
  }

  // If the user already has workspaces, we might want to redirect them to the main page
  // But for now, we'll allow them to see the onboarding page if they landed here.

  return <OnboardingTemplate />;
}

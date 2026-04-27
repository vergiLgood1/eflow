import { auth } from "@/features/authentication/lib/auth-server";
import { OnboardingTemplate } from "@/features/workspace/components/templates/onboarding-template";


/**
 * Server Component for the Onboarding page.
 * Ensures the user is authenticated before allowing them to create their first workspace.
 */
export default async function OnboardingPage() {
  const session = await auth.getSession();

  if (!session?.data) {
    return null;
  }



  return <OnboardingTemplate />;
}

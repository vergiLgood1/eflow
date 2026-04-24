import { auth } from "@/features/authentication/lib/auth-server";
import { getWorkspaceCountByUserId } from "@/features/workspace/applications/workspace.action";
import { OnboardingTemplate } from "@/features/workspace/components/templates/onboarding-template";
import { redirect } from "next/navigation";

/**
 * Server Component for the Onboarding page.
 * Ensures the user is authenticated before allowing them to create their first workspace.
 */
export default async function OnboardingPage() {
  const session = await auth.getSession();

  // Protect the route - only logged in users can see onboarding
  if (!session || !session.data) {
    redirect("/auth/sign-in");
  }

  // If the user already has workspaces, we might want to redirect them to the main page
  const workspaceCount = await getWorkspaceCountByUserId(session.data.user.id)

  if (!workspaceCount.success) {
    throw new Error("Failed to fetch workspace count");
  }

  if (workspaceCount.data !== 0) {
    redirect("/workspaces");
  }


  return <OnboardingTemplate />;
}

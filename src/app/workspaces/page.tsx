import { auth } from "@/features/authentication/lib/auth-server";
import { getWorkspaceCountByUserId } from "@/features/workspace/applications/workspace.action";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function WorkspacesPage() {
  const session = await auth.getSession();

  if (!session || !session.data) {
    redirect("/auth/sign-in");
  }

  const workspaceCount = await getWorkspaceCountByUserId(session.data.user.id)

  if (!workspaceCount.success) {
    throw new Error("Failed to fetch workspace count");
  }

  if (workspaceCount.data === 0) {
    redirect("/workspaces/onboarding");
  }

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Workspaces</h1>
        <Button asChild variant="outline">
          <Link href="/workspaces/account">Account Settings</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <p className="text-muted-foreground">
          Welcome back, {session.data?.user.name}. You don't have any active workspaces yet.
        </p>
      </div>
    </div>
  );
}

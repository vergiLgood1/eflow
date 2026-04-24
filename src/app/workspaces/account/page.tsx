import { AccountSettingsTemplate } from "@/features/account/components/templates/account-settings-template";
import { auth } from "@/features/authentication/lib/auth-server";
import { redirect } from "next/navigation";

/**
 * Server Component for the Account Settings page.
 * Fetches the current session and renders the AccountSettingsTemplate.
 */
export default async function AccountSettingsPage() {
  const session = await auth.getSession();

  if (!session.data) {
    redirect("/auth/sign-in");
  }

  const userData = {
    name: session.data.user.name,
    email: session.data.user.email,
  };

  return <AccountSettingsTemplate user={userData} />;
}

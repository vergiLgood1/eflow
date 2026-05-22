import { auth } from "@/features/authentication/lib/auth-server";
import { ProfileTemplate } from "@/features/account/components/templates/profile-template";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.getSession();

  if (!session || !session.data) {
    return redirect("/auth/sign-in");
  }

  const user = session.data.user;

  return <ProfileTemplate user={user} />;
}

import { ProfileTemplate } from "@/features/account/components/templates/profile-template";
import { auth } from "@/features/authentication/lib/auth-server";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function ProfilePage() {
  await connection();

  const session = await auth.getSession();

  if (!session || !session.data) {
    return redirect("/auth/sign-in");
  }

  const user = session.data.user;

  return <ProfileTemplate user={user} />;
}

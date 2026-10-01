import { auth } from "./auth-server";

/**
 * Delete a user record from the Neon Auth provider store.
 *
 * Identity lives in two databases: the provider's own user store and the app's
 * `users` table. Whenever one side is mutated without the other — a sign-up
 * whose local row insert failed, an account deletion whose provider half
 * failed — the leftover record is cleaned up here. An orphaned provider user
 * claims the email forever, so every retry of the original flow dies on the
 * provider's duplicate check with no way for the user to recover.
 *
 * Failures are reported, never thrown: compensation runs while an original
 * error is already on its way to the caller, and a cleanup that goes wrong
 * (transport errors leave it unknown whether the record is actually gone) must
 * not mask the one message the user needs to see. The caller logs the orphaned
 * id so a human can finish the job.
 */
export async function removeProviderUser(
  userId: string,
): Promise<{ message?: string }> {
  try {
    const { error } = await auth.admin.removeUser({ userId });

    return error
      ? { message: error.message || "Provider rejected cleanup" }
      : {};
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "Unknown provider error",
    };
  }
}

/**
 * Sign the current browser out of the provider session.
 *
 * Best-effort counterpart to deleting the account record: a failed sign-out
 * must not undo the deletion the user asked for, so provider errors are
 * swallowed after being logged. Admin `removeUser` revokes the session
 * server-side but cannot clear the cookie already held by the browser —
 * only a real sign-out can do that.
 */
export async function endProviderSession(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(
      "Failed to end provider session after account deletion:",
      error,
    );
  }
}

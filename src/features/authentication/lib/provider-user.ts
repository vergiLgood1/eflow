import { auth } from "./auth-server";

/**
 * Delete the provider-side user that owns the current request's session.
 *
 * Neon Auth offers no server-to-server deletion path: its admin API requires
 * an authenticated *admin* session (see the Neon "Admin" plugin docs), which
 * this app can never present from a sign-up or account-deletion request.
 * Better Auth's session-scoped `delete-user` is therefore the only reachable
 * deletion, so both call sites arrange for the target's session cookie to be
 * present in the incoming request — account deletion runs before sign-out,
 * and sign-up compensation runs against whatever session state the request
 * carries (when none is present the provider answers Unauthorized and the
 * orphaned id is logged for manual cleanup instead).
 *
 * Failures are reported, never thrown: compensation runs while an original
 * error is already on its way to the caller, and a cleanup that goes wrong
 * must not mask the one message the user needs to see. The caller logs the
 * orphaned id so a human can finish the job.
 */
export async function removeProviderUser(): Promise<{ message?: string }> {
  try {
    const { error } = await auth.deleteUser();

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
 * swallowed after being logged. It runs last, after `removeProviderUser()`
 * already revoked the session server-side, so its real job is sweeping the
 * cookies the browser was left holding — an "unauthorized" answer here is
 * expected noise, not a failure of the deletion.
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

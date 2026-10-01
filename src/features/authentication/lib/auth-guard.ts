import { AppError } from "@/shared/lib/error";
import { auth } from "./auth-server";

/**
 * The user object attached to a verified Neon Auth session, derived from the
 * SDK itself so the type cannot drift from what `getSession()` actually
 * returns.
 */
type SessionData = Awaited<ReturnType<typeof auth.getSession>>["data"];
export type SessionUser = NonNullable<SessionData>["user"];

/**
 * Resolve the signed-in user or fail the current server action.
 *
 * Every Server Action that mutates or reads another principal's data must call
 * this first. The session is read from the request cookies, never from a
 * function argument, so a caller cannot forge an identity by passing a user id.
 *
 * @throws {AppError} 401 when the request carries no valid session.
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth.getSession();
  const user = session.data?.user;

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  return user;
}

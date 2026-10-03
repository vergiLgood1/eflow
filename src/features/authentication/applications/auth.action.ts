"use server";

import {
  assertEmailAvailable,
  registerUser,
} from "@/features/account/applications/user-record";
import {
  EmailSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from "@/features/authentication/types/auth.schema";
import {
  ActionResponse,
  AppError,
  handleActionError,
} from "@/shared/lib/error";
import { Validation } from "@/shared/lib/validation";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { auth } from "../lib/auth-server";
import { buildAppUrl } from "../lib/auth-urls";
import {
  CHECK_INBOX_PATH,
  RESET_PASSWORD_PATH,
  VERIFY_EMAIL_REDIRECT_PATH,
} from "../lib/auth-routes";
import { removeProviderUser } from "../lib/provider-user";
import {
  emailSchema,
  forgotPasswordSchema,
  ForgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../types/auth.schema";

/**
 * Neon Auth's error code for "identity exists but the email is unconfirmed".
 *
 * Only `signIn.email` returns it — `signUp.email` reports the same condition
 * through the success payload (`emailVerified: false`), which is what made a new
 * account fall through to onboarding and bounce back to sign-in. The code is
 * also not declared by Neon: better-call derives it from the error message
 * ("Email not verified" → "EMAIL_NOT_VERIFIED"), so compare `code` and not the
 * human-facing `message`.
 */
const EMAIL_NOT_VERIFIED_CODE = "EMAIL_NOT_VERIFIED";

/** Minimal shape of the `{ error }` branch returned by the auth client. */
type AuthClientError = { code?: string | undefined; message?: string | undefined };

export async function signInWithEmail(
  req: SignInSchema,
): Promise<ActionResponse> {
  try {
    const data = Validation.validate(signInSchema, req);

    const { error } = await auth.signIn.email({
      email: data.email,
      password: data.password,
    });

    // An unconfirmed account is a dead end, not a failure: send the user to the
    // resend screen instead of showing "invalid credentials", which would be
    // both confusing and an account-existence oracle.
    if (isEmailNotVerified(error)) {
      // Re-send on the way out rather than making the user ask again. Neon
      // re-sends on sign-in only if its own `sendOnSignIn` option is enabled,
      // which this app cannot observe, so it asks explicitly instead.
      await dispatchVerificationEmail(data.email);

      return {
        success: true,
        message: "Please verify your email address before signing in.",
        redirectTo: CHECK_INBOX_PATH,
      };
    }

    if (error) {
      throw new AppError(error.message || "Failed to sign in. Try again", 400);
    }

    return { success: true, redirectTo: "/workspaces/onboarding" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signUpWithEmail(
  req: SignUpSchema,
): Promise<ActionResponse> {
  try {
    const data = Validation.validate(signUpSchema, req);

    // Checked before the provider is involved. Neon Auth mints the identity
    // first and this app's row second, and the identity cannot be rolled back
    // (see `assertEmailAvailable`), so reaching the provider with an address we
    // already hold is what strands an orphan. Genuine races fall through to the
    // unique index and are compensated as before.
    await assertEmailAvailable(data.email);

    const { error: authError, data: authData } = await auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      // Absolute for the same reason as forgotPassword below. This is the
      // fallback used only when the `send.magic_link` webhook is not subscribed
      // and Neon falls back to its own delivery.
      callbackURL: buildAppUrl(VERIFY_EMAIL_REDIRECT_PATH),
    });

    const providerUser = authData?.user;

    if (authError || !providerUser) {
      throw new AppError(
        authError?.message || "Failed to sign up. Try again",
        400,
      );
    }

    // A pending confirmation arrives as a **success**, not as an error: Neon has
    // created the identity but mints no session and returns
    // `emailVerified: false` with a null token. `EMAIL_NOT_VERIFIED` only comes
    // back from `signIn.email` later, when the unverified user tries to return.
    // Skipping the local row here would orphan the identity at the provider and
    // make every retry of this email fail as "already exists" forever.
    const isPendingVerification = providerUser.emailVerified === false;

    await createLocalUserOrCompensate({
      id: providerUser.id,
      name: data.name,
      email: data.email,
    });

    if (isPendingVerification) {
      return {
        success: true,
        message: "Account created. Check your inbox to verify your email.",
        redirectTo: CHECK_INBOX_PATH,
      };
    }

    return { success: true, redirectTo: "/workspaces/onboarding" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signInWithGithub(): Promise<ActionResponse> {
  try {
    const { error } = await auth.signIn.social({
      provider: "github",
      callbackURL: "/workspaces/onboarding",
    });

    if (error) {
      throw new AppError(
        error.message || "Failed to sign in with GitHub. Try again",
        400,
      );
    }

    return { success: true, redirectTo: "/workspaces/onboarding" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    const { error } = await auth.signOut();

    if (error) {
      throw new AppError(error.message || "Failed to sign out. Try again", 400);
    }

    revalidatePath("/workspaces", "layout");
    revalidatePath("/account", "layout");

    return { success: true, redirectTo: "/auth/sign-in" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function forgotPassword(
  req: ForgotPasswordSchema,
): Promise<ActionResponse> {
  try {
    const data = Validation.validate(forgotPasswordSchema, req);

    const { error } = await auth.requestPasswordReset({
      email: data.email,
      // Must be absolute. Neon resolves a relative redirectTo against its own
      // hosted domain, which sends the user to a page that is not this app.
      redirectTo: buildAppUrl(RESET_PASSWORD_PATH),
    });

    if (error) {
      throw new AppError(
        error.message || "Failed to send password reset email",
        400,
      );
    }

    return {
      success: true,
      message: "If an account exists, a reset link has been sent.",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function resetPassword(
  req: ResetPasswordSchema,
): Promise<ActionResponse> {
  try {
    const data = Validation.validate(resetPasswordSchema, req);

    const { error } = await auth.resetPassword({
      newPassword: data.password,
      token: data.token,
    });

    if (error) {
      throw new AppError(error.message || "Failed to reset password", 400);
    }

    return {
      success: true,
      message: "Password reset successfully. You can now sign in.",
      redirectTo: "/auth/sign-in",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Re-sends the confirmation email for an unverified account.
 *
 * Always reports success even when the address is unknown: this action is
 * reachable pre-authentication, so distinguishing "no such user" from "sent"
 * would turn it into an account-enumeration endpoint.
 */
export async function resendVerificationEmail(
  req: EmailSchema,
): Promise<ActionResponse> {
  try {
    const data = Validation.validate(emailSchema, req);

    await dispatchVerificationEmail(data.email);

    return {
      success: true,
      message: "If that address needs verifying, a new link is on its way.",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Ask Neon to (re)send a confirmation link for an address.
 *
 * Best-effort by contract: a delivery failure must never become the caller's
 * error, because both call sites have already reached a conclusion the user
 * needs to hear (the redirect out of sign-in, or the resend confirmation).
 * Failures are logged and the check-inbox screen keeps its manual button for
 * exactly this case.
 */
async function dispatchVerificationEmail(email: string): Promise<boolean> {
  const { error } = await auth.sendVerificationEmail({
    email,
    // Absolute for the same reason as forgotPassword above. When the
    // `send.magic_link` webhook is active this is ignored in favour of the
    // branded link built from the raw token, but it is the fallback whenever
    // the webhook is not subscribed.
    callbackURL: buildAppUrl(VERIFY_EMAIL_REDIRECT_PATH),
  });

  if (error) {
    console.error(
      `Verification email dispatch failed for ${email}: ${error.message ?? "unknown error"}`,
    );
    return false;
  }

  return true;
}

function isEmailNotVerified(error: AuthClientError | null): boolean {
  return error?.code === EMAIL_NOT_VERIFIED_CODE;
}

/**
 * Creates the app-side row for an accepted identity, rolling the provider-side
 * identity back if that fails.
 *
 * Without compensation the email stays claimed at the provider with no local
 * row, and every retry of sign-up is rejected forever.
 */
async function createLocalUserOrCompensate(input: {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}): Promise<void> {
  const { id, name, email } = input;

  try {
    await registerUser({ id, name, email });
  } catch (registrationError) {
    const cleanup = await removeProviderUser();

    if (cleanup.message) {
      console.error(
        `Sign-up compensation failed: provider user ${id} is orphaned and must be removed manually (${cleanup.message}).`,
      );
    }

    // AppError and ZodError messages are written for users (the duplicate
    // email race among them); anything else is driver/network detail that
    // belongs in the server log, never in the response.
    if (
      registrationError instanceof AppError ||
      registrationError instanceof ZodError
    ) {
      throw registrationError;
    }

    console.error(
      "Sign-up failed while creating the local user row:",
      registrationError,
    );
    throw new AppError(
      "Failed to create your account. Please try again.",
      500,
    );
  }
}
"use server";

import { registerUser } from "@/features/account/applications/user-record";
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
 * Returned by both sign-up and sign-in once email verification is required.
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

    const { error: authError, data: authData } = await auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    // When email verification is required, Neon creates the user but withholds
    // the session and reports EMAIL_NOT_VERIFIED. Treating that as a failure
    // would skip the local row and orphan the identity at the provider, making
    // every retry of this email fail as "already exists" forever.
    const isPendingVerification = isEmailNotVerified(authError);
    const providerUser = authData?.user;

    if (!providerUser || (!isPendingVerification && authError)) {
      throw new AppError(
        authError?.message || "Failed to sign up. Try again",
        400,
      );
    }

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

    const { error } = await auth.sendVerificationEmail({
      email: data.email,
      // Absolute for the same reason as forgotPassword above. When the
      // `send.magic_link` webhook is active this is ignored in favour of the
      // branded link built from the raw token, but it is the fallback whenever
      // the webhook is not subscribed.
      callbackURL: buildAppUrl(VERIFY_EMAIL_REDIRECT_PATH),
    });

    if (error) {
      console.error(
        `Resend verification email failed for ${data.email}: ${error.message ?? "unknown error"}`,
      );
    }

    return {
      success: true,
      message: "If that address needs verifying, a new link is on its way.",
    };
  } catch (error) {
    return handleActionError(error);
  }
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
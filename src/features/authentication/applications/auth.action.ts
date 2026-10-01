"use server";

import { registerUser } from "@/features/account/applications/user-record";
import {
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
import { auth } from "../lib/auth-server";
import { removeProviderUser } from "../lib/provider-user";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../types/auth.schema";

export async function signInWithEmail(
  req: SignInSchema,
): Promise<ActionResponse> {
  try {
    const data = Validation.validate(signInSchema, req);

    const { error } = await auth.signIn.email({
      email: data.email,
      password: data.password,
    });

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

    if (authError || !authData) {
      throw new AppError(
        authError?.message || "Failed to sign up. Try again",
        400,
      );
    }

    // The provider accepted the identity; if the app-side half fails, roll it
    // back here. Without compensation the email stays claimed at the provider
    // with no local row, and every retry of sign-up is rejected forever.
    try {
      await registerUser({
        id: authData.user.id,
        name: data.name,
        email: data.email,
      });
    } catch (registrationError) {
      const cleanup = await removeProviderUser(authData.user.id);

      if (cleanup.message) {
        console.error(
          `Sign-up compensation failed: provider user ${authData.user.id} is orphaned and must be removed manually (${cleanup.message}).`,
        );
      }

      // Whatever the user needs to hear about is the original failure, not
      // the rollback; removeProviderUser never throws by design.
      throw registrationError;
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
      redirectTo: "/auth/reset-password",
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

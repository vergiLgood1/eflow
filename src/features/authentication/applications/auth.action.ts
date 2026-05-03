"use server";

import { registerUser } from "@/features/account/applications/account.action";
import { SignInSchema, SignUpSchema } from "@/features/authentication/types/auth.schema";
import { ActionResponse, AppError, handleActionError } from "@/shared/lib/error";
import { Validation } from "@/shared/lib/validation";
import { auth } from "../lib/auth-server";
import { forgotPasswordSchema, ForgotPasswordSchema, signInSchema, signUpSchema } from "../types/auth.schema";

export async function signInWithEmail(req: SignInSchema): Promise<ActionResponse> {
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

export async function signUpWithEmail(req: SignUpSchema): Promise<ActionResponse> {
  try {
    const data = Validation.validate(signUpSchema, req);

    const { error: authError, data: authData } = await auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (authError || !authData) {
      throw new AppError(authError?.message || "Failed to sign up. Try again", 400);
    }

    const userResult = await registerUser({
      id: authData.user.id,
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!userResult.success) {
      throw new AppError(userResult.error || "Failed to register user", 400);
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
      throw new AppError(error.message || "Failed to sign in with GitHub. Try again", 400);
    }

    return { success: true, redirectTo: "/workspaces/onboarding" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    await auth.signOut();
    return { success: true, redirectTo: "/" };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function forgotPassword(req: ForgotPasswordSchema): Promise<ActionResponse> {
  try {
    const data = Validation.validate(forgotPasswordSchema, req);

    // In a real scenario, this would call Neon Auth's forget password endpoint
    // If it's exposed on auth, it would be auth.api.forgetPassword or similar.
    // We simulate success here.
    const res = await fetch(`${process.env.NEON_AUTH_BASE_URL}/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, redirectTo: "/auth/reset-password" }),
    });

    if (!res.ok) {
      throw new AppError("Failed to send password reset email", 400);
    }

    return { success: true, message: "If an account exists, a reset link has been sent." };
  } catch (error) {
    return handleActionError(error);
  }
}

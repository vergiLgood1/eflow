"use server";

import { registerUser } from "@/features/account/applications/account.action";
import { SignInSchema, SignUpSchema } from "@/features/authentication/types/auth.schema";
import { Validation } from "@/shared/lib/validation";
import { redirect } from "next/navigation";
import { auth } from "../lib/auth-server";
import { ActionResponse, handleActionError, AppError } from "@/shared/lib/error";
import { signInSchema, signUpSchema } from "../types/auth.schema";

export async function signInWithEmail(req: SignInSchema): Promise<ActionResponse> {
  try {
    const data = Validation.validate(signInSchema, req);

    const { error } = await auth.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new AppError(error.message || 'Failed to sign in. Try again', 400);
    }

    redirect("/workspaces");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signUpWithEmail(req: SignUpSchema): Promise<ActionResponse> {
  try {
    const data = Validation.validate(signUpSchema, req);

    const { error: authError } = await auth.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (authError) {
      throw new AppError(authError.message || "Failed to sign up. Try again", 400);
    }

    const userResult = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!userResult.success) {
      throw new AppError(userResult.error || "Failed to register user", 400);
    }

    redirect("/workspaces");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signInWithGithub(): Promise<ActionResponse> {
  try {
    const { error } = await auth.signIn.social({
      provider: "github",
      callbackURL: "/workspaces",
    });

    if (error) {
      throw new AppError(error.message || "Failed to sign in with GitHub. Try again", 400);
    }

    redirect("/workspaces");
  } catch (error) {
    return handleActionError(error);
  }
}

export async function signOut(): Promise<ActionResponse> {
  try {
    await auth.signOut();
    redirect("/");
  } catch (error) {
    return handleActionError(error);
  }
}

"use client";

import { authClient } from "@/features/authentication/lib/auth-client";
import { SignInSchema, SignUpSchema } from "@/features/authentication/types/auth.schema";

export class AuthService {
  static async signIn(values: SignInSchema) {
    return await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/dashboard",
    });
  }

  static async signUp(values: SignUpSchema) {
    return await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: "/dashboard",
    });
  }

  static async signInWithGithub() {
    return await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
  }

  static async signOut() {
    return await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/auth/sign-in";
        },
      },
    });
  }
}

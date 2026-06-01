"use client";

import { resetPassword } from "@/features/authentication/applications/auth.action";
import { AuthField } from "@/features/authentication/components/molecules/auth-field";
import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/features/authentication/types/auth.schema";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  readonly token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordSchema) => {
    try {
      const result = await resetPassword(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Password reset successfully.");
      router.push(result.redirectTo || "/auth/sign-in");
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  if (!token) {
    return (
      <div className="grid gap-6 text-center">
        <p className="text-muted-foreground text-sm">
          This reset link is missing a valid token. Please request a new reset
          link.
        </p>
        <Link
          className="text-primary text-sm font-medium hover:underline"
          href="/auth/forgot-password"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <input type="hidden" {...register("token")} />
          <AuthField
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.password}
            id="password"
            label="New password"
            placeholder="Enter your new password"
            type="password"
            {...register("password")}
          />
          <AuthField
            autoComplete="new-password"
            disabled={isSubmitting}
            error={errors.confirmPassword}
            id="confirmPassword"
            label="Confirm password"
            placeholder="Confirm your new password"
            type="password"
            {...register("confirmPassword")}
          />
          <Button className="mt-2 w-full" disabled={isSubmitting} type="submit">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link className="hover:text-primary underline" href="/auth/sign-in">
          Sign In
        </Link>
      </div>
    </div>
  );
}

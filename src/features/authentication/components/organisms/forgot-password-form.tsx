"use client";

import { forgotPassword } from "@/features/authentication/applications/auth.action";
import { AuthField } from "@/features/authentication/components/molecules/auth-field";
import { forgotPasswordSchema, ForgotPasswordSchema } from "@/features/authentication/types/auth.schema";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordSchema) => {
    setIsLoading(true);
    try {
      const result = await forgotPassword(values);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Reset link sent!");
        setIsSubmitted(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center grid gap-6">
        <p className="text-muted-foreground text-sm">
          If an account exists with that email, we have sent a password reset link. Please check your inbox.
        </p>
        <Link href="/auth/sign-in" className="text-sm font-medium hover:underline text-primary">
          Return to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <AuthField
            id="email"
            label="Email"
            placeholder="name@example.com"
            type="email"
            disabled={isLoading}
            error={errors.email}
            {...register("email")}
          />
          <Button type="submit" disabled={isLoading} className="w-full mt-2">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </div>
      </form>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/auth/sign-in" className="underline hover:text-primary">
          Sign In
        </Link>
      </div>
    </div>
  );
}

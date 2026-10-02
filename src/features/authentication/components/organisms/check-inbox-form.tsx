"use client";

import { resendVerificationEmail } from "@/features/authentication/applications/auth.action";
import { AuthField } from "@/features/authentication/components/molecules/auth-field";
import { PENDING_VERIFICATION_EMAIL_KEY } from "@/features/authentication/lib/auth-client-storage";
import {
  emailSchema,
  type EmailSchema,
} from "@/features/authentication/types/auth.schema";
import { Button } from "@/shared/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CheckInboxForm() {
  const [hasSent, setHasSent] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    const pendingEmail = window.sessionStorage.getItem(
      PENDING_VERIFICATION_EMAIL_KEY,
    );
    if (pendingEmail) setValue("email", pendingEmail);
  }, [setValue]);

  const onSubmit = async (values: EmailSchema) => {
    try {
      const result = await resendVerificationEmail(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message || "Verification email sent.");
      setHasSent(true);
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="bg-muted/40 flex items-start gap-3 rounded-lg border p-4">
        <MailCheck className="text-primary mt-0.5 size-5 shrink-0" />
        <p className="text-muted-foreground text-sm">
          We sent a verification link to your email. Open it to finish creating
          your account. The link expires in 15 minutes.
        </p>
      </div>

      {hasSent ? (
        <Button asChild className="w-full">
          <a href="/auth/sign-in">Go to Sign In</a>
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <AuthField
              autoComplete="email"
              disabled={isSubmitting}
              error={errors.email}
              id="email"
              label="Resend to"
              placeholder="name@example.com"
              type="email"
              {...register("email")}
            />
            <Button
              className="mt-2 w-full"
              disabled={isSubmitting}
              type="submit"
              variant="outline"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Resend Verification Email
            </Button>
          </div>
        </form>
      )}

      <p className="text-muted-foreground text-center text-sm">
        Already verified?{" "}
        <a
          className="text-primary hover:underline"
          href="/auth/sign-in"
        >
          Sign In
        </a>
      </p>
    </div>
  );
}

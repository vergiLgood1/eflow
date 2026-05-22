import { ForgotPasswordForm } from "@/features/authentication/components/organisms/forgot-password-form";
import { Database } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="animate-in fade-in zoom-in-95 fill-mode-both w-full max-w-[400px] space-y-6 delay-150 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-primary/10 border-primary/20 flex h-12 w-12 items-center justify-center rounded-full border">
            <Database className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

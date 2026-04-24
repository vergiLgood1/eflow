import { ForgotPasswordForm } from "@/features/authentication/components/organisms/forgot-password-form";
import { Database } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[400px] space-y-6 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
            <Database className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}

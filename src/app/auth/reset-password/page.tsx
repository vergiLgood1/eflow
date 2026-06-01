import { ResetPasswordForm } from "@/features/authentication/components/organisms/reset-password-form";
import { KeyRound } from "lucide-react";

interface ResetPasswordPageProps {
  readonly searchParams: Promise<{
    readonly token?: string;
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token = "" } = await searchParams;

  return (
    <div className="animate-in fade-in zoom-in-95 fill-mode-both w-full max-w-[400px] space-y-6 delay-150 duration-500">
      <div className="flex flex-col space-y-2 text-center">
        <div className="mb-4 flex justify-center">
          <div className="bg-primary/10 border-primary/20 flex h-12 w-12 items-center justify-center rounded-full border">
            <KeyRound className="text-primary h-6 w-6" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter a new password for your account.
        </p>
      </div>
      <ResetPasswordForm token={token} />
    </div>
  );
}

import { SignInForm } from "@/features/authentication/components/organisms/sign-in-form";
import { AuthTemplate } from "@/features/authentication/components/templates/auth-template";
import { CircleCheck } from "lucide-react";
import Link from "next/link";

interface SignInPageProps {
  readonly searchParams: Promise<{
    /** Set by /auth/verify-email once Neon has confirmed the address. */
    readonly verified?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { verified } = await searchParams;

  return (
    <AuthTemplate
      title="Welcome back"
      description="Enter your credentials to access your workspace."
      banner={
        verified === "1" ? (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400">
            <CircleCheck className="mt-0.5 size-5 shrink-0" />
            <p className="text-sm">
              Your email is verified. Sign in to continue.
            </p>
          </div>
        ) : null
      }
      form={<SignInForm />}
      footer={
        <p className="text-muted-foreground px-8 text-sm">
          New to EFlow?{" "}
          <Link
            href="/auth/sign-up"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Sign Up
          </Link>
        </p>
      }
    />
  );
}
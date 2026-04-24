import { SignInForm } from "@/features/authentication/components/organisms/sign-in-form";
import { AuthTemplate } from "@/features/authentication/components/templates/auth-template";
import Link from "next/link";

export default function SignInPage() {
  return (
    <AuthTemplate
      title="Welcome back"
      description="Enter your credentials to access your workspace."
      form={<SignInForm />}
      footer={
        <p className="px-8 text-sm text-muted-foreground">
          New to EFlow?{" "}
          <Link
            href="/auth/sign-up"
            className="underline underline-offset-4 hover:text-primary transition-colors"
          >
            Sign Up
          </Link>
        </p>
      }
    />
  );
}

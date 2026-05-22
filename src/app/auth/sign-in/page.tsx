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

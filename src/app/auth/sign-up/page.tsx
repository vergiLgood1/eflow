import { SignUpForm } from "@/features/authentication/components/organisms/sign-up-form";
import { AuthTemplate } from "@/features/authentication/components/templates/auth-template";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <AuthTemplate
      title="Create an account"
      description="Get started with EFlow and build your data infrastructure today."
      form={<SignUpForm />}
      footer={
        <p className="px-8 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="underline underline-offset-4 hover:text-primary transition-colors"
          >
            Sign In
          </Link>
        </p>
      }
    />
  );
}

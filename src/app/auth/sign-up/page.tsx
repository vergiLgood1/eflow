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
        <p className="text-muted-foreground px-8 text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="hover:text-primary underline underline-offset-4 transition-colors"
          >
            Sign In
          </Link>
        </p>
      }
    />
  );
}

import { AuthTemplate } from "@/features/authentication/components/templates/auth-template";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface VerifyEmailPageProps {
  readonly searchParams: Promise<{
    /** Neon appends `?error=<CODE>` when it rejects a token. */
    readonly error?: string;
  }>;
}

/**
 * Landing page for the verification email's return trip.
 *
 * The token is never validated here. Neon Auth consumes it at its own hosted
 * `verify-email` endpoint and redirects to this page, so arriving without an
 * `error` parameter *is* the success signal.
 */
export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { error } = await searchParams;

  if (!error) {
    // Verification always re-authenticates rather than relying on
    // `auto_sign_in_after_verification`, whose session handoff happens on
    // Neon's domain and therefore never sets a cookie on this one.
    redirect("/auth/sign-in?verified=1");
  }

  return (
    <AuthTemplate
      title="That link did not work"
      description={describeVerificationError(error)}
      form={
        <div className="grid gap-4">
          <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-start gap-3 rounded-lg border p-4 text-sm">
            <TriangleAlert className="mt-0.5 size-5 shrink-0" />
            <span>
              Verification links expire after 15 minutes and can only be used
              once.
            </span>
          </div>
          <Link
            className="text-primary text-sm font-medium hover:underline"
            href="/auth/check-inbox"
          >
            Request a new verification link
          </Link>
        </div>
      }
    />
  );
}

/**
 * Maps the subset of Neon Auth error codes a user can actually trigger.
 * Unknown codes fall back to a generic message so a provider-side change
 * cannot leak internal vocabulary into the UI.
 */
function describeVerificationError(code: string): string {
  switch (code) {
    case "INVALID_TOKEN":
      return "This verification link is invalid or has expired.";
    case "TOKEN_EXPIRED":
      return "This verification link has expired.";
    default:
      return "We could not verify your email address.";
  }
}
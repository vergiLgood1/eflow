import { AuthTemplate } from "@/features/authentication/components/templates/auth-template";
import { EMAIL_VERIFIED_FLAG } from "@/features/authentication/lib/auth-routes";
import { Button } from "@/shared/components/ui/button";
import { CircleCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";

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
 *
 * Success stops on this page rather than bouncing straight to sign-in, so the
 * user gets an unambiguous "it worked" instead of landing on a sign-in form that
 * looks like every other visit apart from one line of text. Nothing waits for
 * them: the button is the whole next step. An auto-redirecting countdown was
 * the alternative and it earns nothing here, because verification always
 * re-authenticates rather than relying on `auto_sign_in_after_verification`
 * (whose session handoff happens on Neon's domain and so never sets a cookie on
 * this one) -- the user has no session, which leaves sign-in as the only
 * destination available and a timer nothing but a delay in front of it.
 */
export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { error } = await searchParams;

  if (!error) {
    return (
      <AuthTemplate
        title="Email verified"
        description="Your email address is confirmed. You can sign in now."
        form={
          <div className="grid gap-6">
            <div className="flex justify-center">
              <CircleCheck className="size-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Button asChild className="w-full">
              {/* The flag only paints the banner on sign-in. It is a forgeable
                  query param, so nothing may ever gate on it. */}
              <Link href={`/auth/sign-in?${EMAIL_VERIFIED_FLAG}=1`}>
                Continue to Sign In
              </Link>
            </Button>
          </div>
        }
      />
    );
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

"use client";

import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <AlertTriangle className="text-destructive/80 h-24 w-24" />
            <div className="bg-destructive absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full">
              <span className="text-xs font-bold text-white">!</span>
            </div>
          </div>
        </div>

        {/* Error Code */}
        {error?.digest && (
          <div className="text-muted-foreground font-mono text-sm">
            Error ID: {error.digest}
          </div>
        )}

        {/* Title */}
        <h1 className="text-foreground text-4xl font-bold md:text-5xl">
          Something went wrong!
        </h1>

        {/* Description */}
        <p className="text-muted-foreground mx-auto max-w-md text-lg">
          An unexpected error occurred. Don't worry, our team has been notified.
        </p>

        {/* Error Message (if available) */}
        {error?.message && (
          <div className="bg-muted/50 mx-auto max-w-lg rounded-lg border p-4">
            <p className="text-muted-foreground text-left font-mono text-sm">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
          <Button onClick={() => reset()} size="lg" className="px-8">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Back to home
          </Button>
        </div>

        {/* Footer */}
        <div className="text-muted-foreground pt-8 text-sm">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
}

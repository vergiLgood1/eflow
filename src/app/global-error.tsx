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
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <AlertTriangle className="h-24 w-24 text-destructive/80" />
            <div className="absolute -top-2 -right-2 h-6 w-6 bg-destructive rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Error Code */}
        {error?.digest && (
          <div className="text-sm text-muted-foreground font-mono">
            Error ID: {error.digest}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Something went wrong!
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          An unexpected error occurred. Don't worry, our team has been notified.
        </p>

        {/* Error Message (if available) */}
        {error?.message && (
          <div className="bg-muted/50 border rounded-lg p-4 max-w-lg mx-auto">
            <p className="text-sm text-left font-mono text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button onClick={() => reset()} size="lg" className="px-8">
            Try again
          </Button>
          <Button
            onClick={() => window.location.href = "/"}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Back to home
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-8 text-sm text-muted-foreground">
          <p>If the problem persists, please contact support.</p>
        </div>
      </div>
    </div>

  );
}

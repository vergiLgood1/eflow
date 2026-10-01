"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h1>Something went wrong!</h1>

          {error?.digest && <p>Error ID: {error.digest}</p>}

          {error?.message && <pre>{error.message}</pre>}

          <button type="button" onClick={() => reset()}>
            Try again
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Back to home
          </button>
        </main>
      </body>
    </html>
  );
}

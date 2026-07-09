import { ErrorComponentProps } from '@tanstack/react-router'

export function HomeError({ error, reset }: ErrorComponentProps) {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">
          Something went wrong
        </h1>

        <p className="mt-3 text-muted-foreground">
          We couldn't load the homepage. Please try again.
        </p>

        {import.meta.env.DEV && (
          <pre className="mt-6 rounded-lg border bg-muted p-4 text-left text-xs overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-5 py-2.5 hover:bg-secondary"
          >
            Reload Page
          </button>
        </div>
      </div>
    </section>
  )
}
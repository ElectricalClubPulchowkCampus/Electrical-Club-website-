function Skeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className ?? ""}`}
    />
  )
}

export function HomeSkeleton() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Skeleton className="h-4 w-32 mb-6" />
          <Skeleton className="h-12 w-96 max-w-full mb-5" />
          <Skeleton className="h-5 w-full max-w-xl mb-2" />
          <Skeleton className="h-5 w-4/5 max-w-lg mb-8" />

          <div className="flex gap-3">
            <Skeleton className="h-10 w-36 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Skeleton className="h-8 w-52 mb-5" />
        <Skeleton className="h-4 w-full max-w-2xl mb-2" />
        <Skeleton className="h-4 w-5/6 max-w-2xl" />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-5"
            >
              <Skeleton className="h-5 w-28 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>

      {/* Executive Committee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <Skeleton className="h-8 w-64 mb-3" />
        <Skeleton className="h-4 w-72 mb-10" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center"
            >
              <Skeleton className="h-20 w-20 rounded-full mb-3" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <Skeleton className="h-8 w-44 mb-3" />
        <Skeleton className="h-4 w-64 mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-5 min-h-[130px]"
            >
              <Skeleton className="h-5 w-28 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <Skeleton className="h-8 w-72 mb-8" />

        <div className="space-y-3 max-w-2xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-16 w-full rounded-lg"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
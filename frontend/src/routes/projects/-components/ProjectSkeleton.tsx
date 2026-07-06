export function ProjectsSkeleton() {
  const placeholders = Array.from({ length: 6 })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-8 sm:h-9 w-56 bg-muted rounded-md mb-2" />
      <div className="h-4 w-72 bg-muted/60 rounded-md mb-6 sm:mb-8" />
      <div className="h-11 w-full bg-muted/60 rounded-md mb-6 sm:mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {placeholders.map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-border">
            <div className="h-40 sm:h-48 w-full bg-muted" />
            <div className="p-4 sm:p-5 space-y-3">
              <div className="h-5 w-2/3 bg-muted rounded-sm" />
              <div className="h-3.5 w-1/2 bg-muted/60 rounded-sm" />
              <div className="h-9 w-full bg-muted/60 rounded-lg mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

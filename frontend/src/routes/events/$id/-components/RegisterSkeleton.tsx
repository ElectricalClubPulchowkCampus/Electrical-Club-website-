

function RegisterSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-24 bg-muted rounded-sm mb-6" />
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
        <div className="h-6 w-32 bg-muted rounded-md" />
        <div className="h-4 w-48 bg-muted rounded-sm" />
        <div className="h-10 bg-muted rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded-lg" />
            <div className="h-10 bg-muted rounded-lg" />
            <div className="h-10 bg-muted rounded-lg" />
            <div className="h-20 bg-muted rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-16 bg-muted rounded-lg" />
          </div>
          <div className="space-y-4">
            <div className="h-16 bg-muted rounded-lg" />
            <div className="h-40 bg-muted rounded-lg" />
          </div>
        </div>
        <div className="h-10 w-full bg-muted rounded-lg" />
      </div>
    </div>
  )
}

export default RegisterSkeleton;
export default function ProjectDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-28 bg-muted rounded-sm mb-6" />
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-56 sm:h-96 w-full bg-muted rounded-2xl" />
          <div className="h-5 w-24 bg-muted rounded-full" />
          <div className="h-8 w-2/3 bg-muted rounded-md" />
          <div className="h-24 bg-muted rounded-md" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-10 bg-muted rounded-md" />
          <div className="h-10 bg-muted rounded-md" />
          <div className="h-10 w-full bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  )
}

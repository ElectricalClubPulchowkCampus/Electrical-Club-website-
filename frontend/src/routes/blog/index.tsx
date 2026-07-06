// routes/blog.tsx
import { createFileRoute } from '@tanstack/react-router'
import { BlogService } from '../../lib/services/blogService'

export const Route = createFileRoute('/blog/')({
  component:RouteComponent,
  pendingComponent: BlogSkeleton,
  errorComponent: ErrorComponent,
  pendingMs: 200,
})

// 1. SUCCESS STATE
function RouteComponent() {
  const posts = Route.useLoaderData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Blog</h2>

      <h3> Feature Comming Sooonnnnnnn</h3>
    </div>
  )
}

// 2. LOADING STATE
function BlogSkeleton() {
  const placeholders = Array.from({ length: 3 })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 w-32 bg-muted rounded-md mb-6"></div>

      {/* List Skeletons */}
      <div className="divide-y border-t border-b border-border divide-border">
        {placeholders.map((_, index) => (
          <div key={index} className="py-5 flex justify-between items-center">
            <div className="space-y-2 w-2/3">
              <div className="h-5 w-3/4 bg-muted rounded-sm"></div>
              <div className="h-4 w-1/2 bg-muted/60 rounded-sm"></div>
            </div>
            <div className="h-6 w-24 bg-muted rounded-sm"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3. ERROR STATE
function ErrorComponent({ error }: { error: any }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-5 border rounded-lg max-w-2xl mx-auto bg-destructive/10 border-destructive/30 shadow-sm">
        <h3 className="font-bold text-xl text-destructive tracking-tight">
          Could not load blog posts
        </h3>
        <p className="text-sm mt-1 text-foreground/80">
          {error?.message || 'An unexpected error occurred.'}
        </p>

        <div className="mt-4">
          <code className="text-xs bg-muted px-2 py-1 rounded text-foreground font-mono">
            Error signature: {error?.status || '500_FETCH_FAILURE'}
          </code>
        </div>
      </div>
    </div>
  )
}
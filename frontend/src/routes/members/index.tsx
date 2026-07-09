import { createFileRoute } from '@tanstack/react-router'
import { MemberService } from '../../lib/services/memberService'
import type { Member } from '../../types/member'
import type { CategoryGroup } from '../../types/team'
import { groupAndSortByTeam } from '../../lib/grouphelper'
import MemberGrid from './-components/MemberGrid'
import type { ErrorComponentProps } from "@tanstack/react-router";

export const Route = createFileRoute('/members/')({
  loader: async () => {
    const data = await MemberService.getMembers()
    const grouped: CategoryGroup[] = groupAndSortByTeam(data as Member[])
    return grouped
  },
  component: RouteComponent,
  pendingComponent: MembersSkeleton,
  errorComponent: ErrorComponent,
  pendingMs: 200,
})

function RouteComponent() {
  const categoryGroups = Route.useLoaderData()
  const hasMembers = categoryGroups.some((c) =>
    c.teams.some((t) => t.members.length > 0)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Electrical Club</h1>
        <p className="text-muted-foreground max-w-3xl">
          Meet the Electrical Club Committtee and Sub-Committees. Our team is dedicated to fostering a vibrant community of electrical enthusiasts, providing opportunities for learning, collaboration, and innovation. Explore the profiles of our members and discover the diverse talents that drive our club forward.
        </p>
      </div>

      {hasMembers ? (
        categoryGroups.map((categoryGroup) => (
          <section key={categoryGroup.category} className="mb-14">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">{categoryGroup.category}</h2>
              <span className="text-xs uppercase tracking-wide text-muted-foreground border rounded-full px-2 py-0.5">
                {categoryGroup.teams.reduce((n, t) => n + t.members.length, 0)} members
              </span>
            </div>

            {categoryGroup.teams.map((teamGroup) => (
              <MemberGrid
                key={teamGroup.team?.id ?? 'unassigned'}
                group={teamGroup}
              />
            ))}
          </section>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No members found.</p>
      )}
    </div>
  )
}
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

function MemberCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="h-1 w-full rounded-none" />

      <div className="px-6 pt-5 flex items-center gap-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="px-6 pt-4 flex gap-4">
        <Skeleton className="h-16 w-16 rounded-md" />

        <div className="flex-1">
          <Skeleton className="h-5 w-36 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <div className="mx-6 my-5 border-t border-dashed border-border" />

      <div className="px-6 pb-5 space-y-3">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-52" />
      </div>

      <div className="mx-6 mb-6">
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  )
}

function MembersSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Page Header */}
      <Skeleton className="h-10 w-72 mb-4" />
      <Skeleton className="h-4 w-full max-w-4xl mb-2" />
      <Skeleton className="h-4 w-5/6 max-w-3xl mb-10" />

      {Array.from({ length: 2 }).map((_, category) => (
        <section key={category} className="mb-14">
          {/* Category */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {Array.from({ length: 2 }).map((_, team) => (
            <div key={team} className="mb-10">
              {/* Team */}
              <Skeleton className="h-7 w-40 mb-5" />

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, member) => (
                  <MemberCardSkeleton key={member} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-8 w-8 text-destructive"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18A2 2 0 003.53 21h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold mb-2">
          Failed to load members
        </h2>

        <p className="text-muted-foreground">
          We couldn't retrieve the committee members. Please try again.
        </p>

        {import.meta.env.DEV && (
          <pre className="mt-6 rounded-lg bg-muted p-4 text-left text-xs overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground"
          >
            Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-border px-5 py-2.5"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}
import { createFileRoute } from '@tanstack/react-router'
import { MemberService } from '../../lib/services/memberService'
import type { Member } from '../../types/member'
import type { CategoryGroup } from '../../types/team'
import { groupAndSortByTeam } from '../../lib/grouphelper'
import MemberGrid from './-components/MemberGrid'

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

// 2. LOADING STATE
function MembersSkeleton() {
  const placeholders = Array.from({ length: 3 })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-8 w-40 bg-muted rounded-md mb-6"></div>

      <div className="divide-y border-t border-b border-border divide-border">
        {placeholders.map((_, index) => (
          <div key={index} className="py-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex items-center gap-3 w-full sm:w-2/3">
              <div className="h-10 w-10 rounded-full bg-muted shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-5 w-3/4 bg-muted rounded-sm"></div>
                <div className="h-4 w-1/2 bg-muted/60 rounded-sm"></div>
              </div>
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
          Could not load members
        </h3>
        <p className="text-sm mt-1 text-foreground/80">
          {error?.message || 'An unexpected error occurred.'}
        </p>

        <div className="mt-4">
          <code className="text-xs bg-muted px-2 py-1 rounded text-foreground font-mono break-all">
            Error signature: {error?.status || '500_FETCH_FAILURE'}
          </code>
        </div>
      </div>
    </div>
  )
}
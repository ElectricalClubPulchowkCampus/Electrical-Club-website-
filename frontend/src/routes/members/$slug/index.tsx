  import { createFileRoute } from '@tanstack/react-router'
  import { MemberService } from '../../../lib/services/memberService'
  import type { Member } from '../../../types/member'
import ProfilePage from './-components/ProfileSection'
import ProjectSection from './-components/ProjectSection'

  export const Route = createFileRoute('/members/$slug/')({
     loader: async ({ params }) => {
    const member = await MemberService.getMemberBySlug(params.slug)
    return member as Member
  },
    pendingComponent: () => <CredentialSkeleton />,
    errorComponent: ({ error }) => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-5 border rounded-lg max-w-2xl mx-auto bg-destructive/10 border-destructive/30 shadow-sm">
          <h3 className="font-bold text-xl text-destructive tracking-tight">
            Couldn't load this member
          </h3>
          <p className="text-sm mt-1 text-foreground/80">{error.message}</p>
        </div>
      </div>
    ),
    component: RouteComponent,
  })

  function CredentialSkeleton() {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12 mt-6">
          <div className="w-64 h-80 bg-muted rounded-[--radius-lg] flex-shrink-0" />
          <div className="space-y-3 w-full">
            <div className="h-4 w-40 bg-muted rounded-sm" />
            <div className="h-9 w-64 bg-muted rounded-md" />
            <div className="h-6 w-32 bg-muted/60 rounded-sm" />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-48 bg-muted rounded-[--radius-lg]" />
          <div className="space-y-6">
            <div className="h-32 bg-muted rounded-[--radius-lg]" />
            <div className="h-24 bg-muted rounded-[--radius-lg]" />
          </div>
        </div>
      </div>
    )
  }

  function RouteComponent() {
    const member = Route.useLoaderData()
    
    return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfilePage member={member} />
      <ProjectSection member={member} />
    </div>
  )
  }
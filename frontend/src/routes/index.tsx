import { createFileRoute } from '@tanstack/react-router'
import { MemberService } from '../lib/services/memberService'
import { SettingsService } from '../lib/services/settingService'

import { Hero } from './-components/Hero'
import { About } from './-components/About'
import { ExecutiveCommittee } from './-components/ExecutiveCommittee'
import { QuickAccess } from './-components/QuickAccess'
import { FAQ } from './-components/FAQ'

import { HomeSkeleton } from './-components/HomeSkeleton.tsx'
import { HomeError } from './-components/HomeError.tsx'
export const Route = createFileRoute('/')({
  loader: async () => {
    const [members, details] = await Promise.all([
      MemberService.getFeaturedMembers(),
      SettingsService.getClubSettings(),
    ])

    return { members, details }
  },
  pendingComponent: HomeSkeleton,
  errorComponent: HomeError,
  component: Index,
})

function Index() {
  const { members, details } = Route.useLoaderData()

  return (
    <div className="bg-background text-foreground">
      <Hero heroTitle={details?.hero_title} />
      <About about={details?.about} pillars={details?.pillars} />
      <ExecutiveCommittee members={members} />
      <QuickAccess />
      <FAQ faqs={details?.faqs} />
    </div>
  )
}
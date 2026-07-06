import type { TeamGroup } from '../../../types/team'
import MemberCard from './MemberCard'

interface TeamSectionProps {
  group: TeamGroup
}

export default function MemberGrid({ group }: TeamSectionProps) {
  return (
    <section className="mb-10">
      <h3 className="text-xl font-semibold mb-4">
        {group.team?.name ?? 'Unassigned'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {group.members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  )
}
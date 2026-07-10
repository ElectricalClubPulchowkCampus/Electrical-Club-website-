import type { Member } from '../../types/member'
import { Link } from '@tanstack/react-router'
const baseUrl = import.meta.env.VITE_BACKEND_URL

type ExecutiveCommitteeProps = {
  members: Member[]
}

export function ExecutiveCommittee({ members }: ExecutiveCommitteeProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl sm:text-3xl">Executive Committee</h2>
        <Link
          to="/members"
          className="text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          View All Members &rarr;
        </Link>
      </div>
      <p className="text-muted-foreground mb-10">
        Meet the members leading the club this term
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {members.map((m) => (
          <div key={m.name} className="flex flex-col items-center text-center">
            {m.profile_pic ? (
              <img
                src={`${
                  m.profile_pic.formats?.thumbnail?.url ?? m.profile_pic.url
                }`}
                alt={m.name}
                className="h-20 w-20 rounded-full object-cover border border-border mb-3"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-secondary border border-border flex items-center justify-center text-lg font-medium text-primary mb-3">
                {m.name
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
            )}
            <h3 className="text-sm font-semibold">{m.name}</h3>
            <p className="text-xs text-muted-foreground">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
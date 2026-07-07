import { createFileRoute, Link } from '@tanstack/react-router'
import { MemberService } from '../lib/services/memberService'
import type { Member } from '../types/member'
import { SettingsService } from '../lib/services/settingService';
const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const Route = createFileRoute('/')({
  loader: async () => {
    const members = await MemberService.getFeaturedMembers()
    const details = await SettingsService.getClubSettings()
    return { members, details }
  },
  component: Index,
})




const quickAccess = [
  { to: '/events', label: 'Events', desc: 'Workshops, competitions, and what\u2019s coming up.' },
  { to: '/projects', label: 'Projects', desc: 'What members are building right now.' },
  { to: '/blog', label: 'Blog', desc: 'Write-ups and notes from around the club.' },
  { to: '/contact', label: 'Contact Us', desc: 'Questions, collaborations, sponsorships.' },
] as const

const faqs = [
  {
    q: 'How do I become a member?',
    a: 'Membership opens each semester through a short sign-up form shared on our notice board and Discord. Check Events for the next intake announcement.',
  },
  {
    q: 'Can I submit a project to be featured?',
    a: 'Yes \u2014 reach out through Contact Us with a short write-up and photos, and the team will help you get it listed on the Projects page.',
  },
  {
    q: 'How can I write for the blog?',
    a: 'Any member can pitch a post \u2014 tutorials, lab notes, or event recaps are all welcome. Send a draft or outline via Contact Us.',
  },
]

function Index() {
  const { members, details } = Route.useLoaderData()  
  console.log(members)
  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 50% at 80% 0%, rgb(var(--accent) / 0.08), transparent)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <p className="text-sm font-medium tracking-wide text-primary mb-4">
            Pulchowk Campus
          </p>
          <h1 className="text-4xl sm:text-6xl tracking-tight leading-[1.1] max-w-3xl">
            Electrical Club
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground text-base sm:text-lg">
            {details?.hero_title}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/events"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Latest Events
            </Link>
            <Link
              to="/projects"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl mb-4">About the Club</h2>
        <p className="max-w-2xl text-muted-foreground leading-relaxed">
          {details?.about}
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {details?.pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-border bg-card p-5 border-t-2 border-t-primary"
            >
              <h3 className="text-base font-semibold mb-1.5 font-sans">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured members */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <h2 className="text-2xl sm:text-3xl mb-1">Executive Committee</h2>
        <p className="text-muted-foreground mb-10">
          Meet the members leading the club this term
        </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
  {members.map((m) => (
    <div key={m.name} className="flex flex-col items-center text-center">
      {m.profile_pic ? (
        <img
          src={`${baseUrl}${
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
      <h3 className="text-sm font-semibold font-sans">{m.name}</h3>
      <p className="text-xs text-muted-foreground">{m.role}</p>
    </div>
  ))}
</div>
      
        <div className="mt-8">
          <Link
            to="/members"
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            View All Members &rarr;
          </Link>
        </div>
      </section>

      {/* Quick access */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <h2 className="text-2xl sm:text-3xl mb-1">Quick Access</h2>
        <p className="text-muted-foreground mb-10">Everything you need, just a click away</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickAccess.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-5 min-h-[130px] hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <h3 className="text-lg font-semibold mb-1.5 font-sans">{s.label}</h3>
              <p className="text-sm text-muted-foreground leading-snug">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border pb-24">
        <h2 className="text-2xl sm:text-3xl mb-8">Frequently Asked Questions</h2>

        <div className="max-w-2xl space-y-2">
          {details?.faqs.map((f) => (
            <details
              key={f.question}
              className="group rounded-lg border border-border bg-card px-5 py-4"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold font-sans">
                {f.question}
                <span className="text-primary transition-transform group-open:rotate-90">
                  &rsaquo;
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
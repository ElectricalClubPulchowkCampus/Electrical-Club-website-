import { Link } from "@tanstack/react-router"
const quickAccess = [
  { to: '/events', label: 'Events', desc: 'Workshops, competitions, and what\u2019s coming up.' },
  { to: '/projects', label: 'Projects', desc: 'What members are building right now.' },
  { to: '/blog', label: 'Blog', desc: 'Write-ups and notes from around the club.' },
  { to: '/contact', label: 'Contact Us', desc: 'Questions, collaborations, sponsorships.' },
] as const

export function QuickAccess() {
  return (
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
            <h3 className="text-lg font-semibold mb-1.5">{s.label}</h3>
            <p className="text-sm text-muted-foreground leading-snug">{s.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
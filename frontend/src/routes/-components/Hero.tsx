import { Link } from "@tanstack/react-router"
type HeroProps = {
  heroTitle?: string
}

export function Hero({ heroTitle }: HeroProps) {
  return (
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
          {heroTitle}
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
  )
}
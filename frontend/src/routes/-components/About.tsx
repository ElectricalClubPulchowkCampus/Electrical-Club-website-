type Pillar = {
  title: string
  description: string
}

type AboutProps = {
  about?: string
  pillars?: Pillar[]
}

export function About({ about, pillars }: AboutProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-2xl sm:text-3xl mb-4">About the Club</h2>
      <p className="max-w-2xl text-muted-foreground leading-relaxed">{about}</p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillars?.map((p) => (
          <div
            key={p.title}
            className="rounded-lg border border-border bg-card p-5 border-t-2 border-t-primary"
          >
            <h3 className="text-base font-semibold mb-1.5">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-snug">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
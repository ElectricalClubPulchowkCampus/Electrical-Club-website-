type FaqItem = {
  question: string
  answer: string
}

type FAQProps = {
  faqs?: FaqItem[]
}

export function FAQ({ faqs }: FAQProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border pb-24">
      <h2 className="text-2xl sm:text-3xl mb-8">Frequently Asked Questions</h2>

      <div className="max-w-2xl space-y-2">
        {faqs?.map((f) => (
          <details
            key={f.question}
            className="group rounded-lg border border-border bg-card px-5 py-4"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold">
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
  )
}
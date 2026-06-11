export function FaqAccordion({ b }: { b: { items: { question: string; answer: string }[] } }) {
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-3xl space-y-3">
        {(b.items ?? []).map((it) => (
          <details key={it.question} className="card-premium group p-5">
            <summary className="cursor-pointer font-display text-lg marker:content-none">{it.question}</summary>
            <p className="mt-3 text-muted">{it.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

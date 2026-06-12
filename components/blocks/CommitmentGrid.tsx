import { Link } from "next-view-transitions";

export function CommitmentGrid({ b }: { b: { items: { title: string; text: string; href: string }[] } }) {
  return (
    <section className="relative overflow-hidden px-6 py-24 max-md:py-16">
      <div
        aria-hidden
        className="motif left-[-90px] top-[-60px] h-[260px] w-[260px] max-md:hidden"
        style={{ "--motif": "url(/motifs/desen-2.svg)", opacity: 0.07 } as React.CSSProperties}
      />
      <h2 className="sr-only">Taahhütlerimiz</h2>
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-4 max-md:grid-cols-2">
        {(b.items ?? []).map((it) => (
          <Link key={it.title} href={it.href} className="card-premium block space-y-2 p-6 transition-transform duration-[var(--dur-micro)] hover:-translate-y-1 motion-reduce:hover:translate-y-0">
            <h3 className="font-display text-lg text-cream">{it.title}</h3>
            <p className="text-sm text-muted">{it.text}</p>
            <span className="text-sm text-gold">Detayı gör →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

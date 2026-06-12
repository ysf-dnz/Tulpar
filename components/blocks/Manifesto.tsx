import { PortableText, type PortableTextBlock } from "@portabletext/react";

export function Manifesto({ b }: { b: { heading?: string; body?: PortableTextBlock[] } }) {
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        {b.heading && (
          <div className="space-y-3">
            <h2 className="font-display text-3xl">{b.heading}</h2>
            <div className="gold-rule" aria-hidden />
          </div>
        )}
        {b.body && (
          <div className="space-y-4 text-lg leading-relaxed text-muted [&_strong]:text-cream">
            <PortableText value={b.body} />
          </div>
        )}
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/Button";

export function CtaBand({ b }: { b: { heading: string; ctaLabel: string; ctaHref: string } }) {
  return (
    <section className="px-6 py-16 [background:var(--grad-ember)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <h2 className="font-display text-3xl text-cream">{b.heading}</h2>
        <Button href={b.ctaHref} variant="secondary">{b.ctaLabel}</Button>
      </div>
    </section>
  );
}

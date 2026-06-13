import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/lib/image";

export function Hero({ b }: { b: { variant: string; heading: string; subheading?: string; image?: { alt?: string } & object; primaryCtaLabel?: string; primaryCtaHref?: string } }) {
  return (
    <section className="hero-surface relative overflow-hidden px-6 py-32 max-md:py-20">
      <div
        aria-hidden
        className="motif-reveal motif-float right-[-120px] top-16 h-[420px] w-[420px] max-md:hidden"
        style={{ "--motif-color": "url(/motifs/desen-color.svg)" } as React.CSSProperties}
      >
        <div
          className="motif absolute inset-0"
          style={{ "--motif": "url(/motifs/desen-clean.svg)", opacity: 0.1 } as React.CSSProperties}
        />
        <div className="motif-color" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="font-display text-5xl font-bold leading-tight max-md:text-3xl bg-clip-text text-transparent [background-image:var(--grad-gold)]">{b.heading}</h1>
          {b.subheading && <p className="text-lg text-muted">{b.subheading}</p>}
          <div className="flex gap-4">
            <Button href={b.primaryCtaHref ?? "/halilar/"}>{b.primaryCtaLabel ?? "Koleksiyonu Gör"}</Button>
            <Button href="#wa" variant="secondary">WhatsApp&apos;tan Sor</Button>
          </div>
        </div>
        {b.variant === "gorselli" && b.image && (
          <Image src={urlFor(b.image).width(900).url()} alt={b.image.alt ?? ""} width={900} height={700}
            priority className="rounded-xl object-cover" />
        )}
      </div>
    </section>
  );
}

import Image from "next/image";
import { Link } from "next-view-transitions";
import { urlFor } from "@/lib/image";
import { StainBadge } from "@/components/ui/StainBadge";
import { WaMicroCta } from "@/components/whatsapp/WaMicroCta";

export type ProductCardData = {
  title: string; slug: string; heroImage?: ({ alt?: string } & object) | null;
  sizeVariants: { size: string; priceTRY: number }[];
  honestLabel?: Parameters<typeof StainBadge>[0]["label"];
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const minPrice = Math.min(...p.sizeVariants.map((v) => v.priceTRY));
  return (
    <article className="card-premium group overflow-hidden">
      <Link href={`/halilar/${p.slug}/`} className="block">
        {p.heroImage ? (
          <Image src={urlFor(p.heroImage).width(640).height(480).url()} alt={p.heroImage.alt ?? p.title}
            width={640} height={480} className="aspect-[4/3] w-full object-cover transition-transform duration-[var(--dur-element)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
            style={{ viewTransitionName: `product-${p.slug}` }} placeholder="empty" />
        ) : (
          <div aria-hidden className="hero-surface grid aspect-[4/3] w-full place-items-center"
            style={{ viewTransitionName: `product-${p.slug}` }}>
            <span className="font-data text-xs text-muted">Fotoğraf yakında</span>
          </div>
        )}
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">{p.title}</h3>
            <StainBadge label={p.honestLabel} />
          </div>
          <p className="text-sm text-muted">{p.sizeVariants.map((v) => v.size).join(" · ")}</p>
          <p className="font-data bg-clip-text text-transparent [background-image:var(--grad-gold)]">{minPrice.toLocaleString("tr-TR")} ₺&apos;den</p>
        </div>
      </Link>
      <div className="px-4 pb-4"><WaMicroCta productTitle={p.title} slug={p.slug} /></div>
    </article>
  );
}

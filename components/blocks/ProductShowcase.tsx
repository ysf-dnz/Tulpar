import { ProductCard, type ProductCardData } from "@/components/ProductCard";

export function ProductShowcase({ b }: { b: { heading?: string; products?: ProductCardData[] } }) {
  const products = (b.products ?? []).filter((p) => p?.slug && p?.heroImage && p?.sizeVariants?.length);
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-3">
          <h2 className="font-display text-3xl">{b.heading ?? "Öne Çıkan Halılar"}</h2>
          <div className="gold-rule" aria-hidden />
        </div>
        <div className="grid gap-6 md:grid-cols-3 max-md:grid-cols-1">
          {products.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </div>
    </section>
  );
}

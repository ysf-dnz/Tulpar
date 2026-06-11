import { client } from "@/sanity/client";
import { PRODUCTS_QUERY } from "@/lib/queries";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { stainScore } from "@/components/ui/StainBadge";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;
const PER_PAGE = 12;

type Search = { boyut?: string; oda?: string; sirala?: string; sayfa?: string };
type ListProduct = ProductCardData & { roomTags?: string[] };

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Boolean(sp.boyut || sp.oda || sp.sirala);
  return {
    title: "Halılar — Dürüst Etiketli Koleksiyon",
    description: "Leke testi yapılmış, parti bazlı ölçülmüş halılar. Mağazada gördüğün, evine gelen halıdır.",
    alternates: { canonical: "/halilar/" },                       // UL-01: filtrelide canonical ana liste
    robots: filtered ? { index: false, follow: true } : undefined, // UL-01: noindex,follow
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  let products: ListProduct[] = [];
  try {
    products = await client.fetch(PRODUCTS_QUERY, {}, { next: { revalidate: 3600, tags: ["product"] } });
  } catch {
    // Sanity yapılandırılmadıysa boş listeyle render et
  }
  if (sp.boyut) products = products.filter((p) => p.sizeVariants.some((v) => v.size === sp.boyut));
  if (sp.oda) products = products.filter((p) => p.roomTags?.includes(sp.oda!));
  if (sp.sirala === "fiyat") products.sort((a, b) => Math.min(...a.sizeVariants.map((v) => v.priceTRY)) - Math.min(...b.sizeVariants.map((v) => v.priceTRY)));
  if (sp.sirala === "leke") products.sort((a, b) => stainScore(b.honestLabel) - stainScore(a.honestLabel));
  const page = Math.max(1, Number(sp.sayfa ?? 1));
  const slice = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-16">
      <h1 className="font-display text-4xl">Halılar</h1>
      <div className="flex flex-wrap gap-3 text-sm">
        {[["sirala", "fiyat", "Fiyata göre"], ["sirala", "leke", "Leke direncine göre"], ["oda", "salon", "Salon"], ["oda", "yatak-odasi", "Yatak Odası"]].map(([k, v, label]) => (
          <Link key={`${k}${v}`} href={`/halilar/?${k}=${v}`} className="rounded-full border border-stroke px-4 py-1.5 text-muted hover:border-gold hover:text-cream">{label}</Link>
        ))}
      </div>
      {slice.length === 0 ? (
        <p className="text-muted">Bu kritere uyan halı bulunamadı. <Link href="/halilar/" className="text-gold">Tüm koleksiyonu gör</Link></p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      )}
      {products.length > PER_PAGE && (
        <nav className="flex gap-2" aria-label="Sayfalama">
          {Array.from({ length: Math.ceil(products.length / PER_PAGE) }, (_, i) => (
            <Link key={i} href={i === 0 ? "/halilar/" : `/halilar/?sayfa=${i + 1}`}
              className={`rounded px-3 py-1.5 ${page === i + 1 ? "text-gold" : "text-muted"}`}>{i + 1}</Link>
          ))}
        </nav>
      )}
    </div>
  );
}

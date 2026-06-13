import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/client";
import { PRODUCT_QUERY, RELATED_QUERY, SLUGS_QUERY, SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/lib/image";
import { HonestLabelCard } from "@/components/HonestLabelCard";
import { MeasureSlip } from "@/components/MeasureSlip";
import { LiteYouTube } from "@/components/flow/LiteYouTube";
import { ProductCard } from "@/components/ProductCard";
import { WaMicroCta } from "@/components/whatsapp/WaMicroCta";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(SLUGS_QUERY("product"));
    return slugs.map((slug) => ({ slug }));
  } catch {
    return []; // Sanity yapılandırılmadıysa statik üretim yok, on-demand render
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let p = null;
  try {
    p = await client.fetch(PRODUCT_QUERY, { slug });
  } catch {
    // Sanity yapılandırılmadıysa boş metadata
  }
  if (!p) return {};
  return {
    title: p.seo?.metaTitle ?? p.title, description: p.seo?.metaDescription,
    alternates: { canonical: `/halilar/${slug}/` },
    openGraph: { images: [`/api/og?slug=${slug}`] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let p = null;
  let settings: { whatsappNumber?: string; waMessageProduct?: string } | null = null;
  try {
    [p, settings] = await Promise.all([
      client.fetch(PRODUCT_QUERY, { slug }, { next: { revalidate: 3600, tags: ["product"] } }),
      client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600 } }),
    ]);
  } catch {
    notFound(); // Sanity yapılandırılmadıysa da 404 — ürün gösterilemez
  }
  if (!p) notFound();
  let related: Parameters<typeof ProductCard>[0]["p"][] = [];
  try {
    related = await client.fetch(RELATED_QUERY, { slug, tea: p.honestLabel.tea.result });
  } catch {
    // çapraz satış bölümü opsiyonel
  }

  return (
    <div className="relative mx-auto max-w-6xl space-y-16 overflow-x-clip px-6 py-16">
      <div
        aria-hidden
        className="motif right-0 top-6 h-[200px] w-[200px] max-md:hidden"
        style={{ "--motif": "url(/motifs/desen-clean.svg)", opacity: 0.07 } as React.CSSProperties}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Ana sayfa", url: "https://tulparcarpet.com/" },
        { name: "Halılar", url: "https://tulparcarpet.com/halilar/" },
        { name: p.title, url: `https://tulparcarpet.com/halilar/${slug}/` },
      ])) }} />
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-4">
          {p.heroImage ? (
            <Image src={urlFor(p.heroImage).width(1200).url()} alt={p.heroImage.alt ?? p.title} width={1200} height={900}
              priority className="rounded-xl" style={{ viewTransitionName: `product-${slug}` }} />
          ) : (
            <div aria-hidden className="hero-surface grid aspect-[4/3] w-full place-items-center rounded-xl"
              style={{ viewTransitionName: `product-${slug}` }}>
              <span className="font-data text-sm text-muted">Ürün fotoğrafları yakında</span>
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {(p.images ?? []).map((img: { alt?: string } & object, i: number) => (
              <Image key={i} src={urlFor(img).width(300).height(300).url()} alt={(img as { alt?: string }).alt ?? p.title}
                width={300} height={300} className="rounded-lg object-cover" loading="lazy" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-4xl">{p.title}</h1>
          <div className="flex flex-wrap gap-2">
            {p.sizeVariants.map((v: { size: string; priceTRY: number }) => (
              <span key={v.size} className="font-data rounded border border-stroke px-3 py-1.5 text-sm">
                {v.size} — {v.priceTRY.toLocaleString("tr-TR")} ₺</span>
            ))}
          </div>
          <HonestLabelCard label={p.honestLabel} pileHeightMm={p.pileHeightMm} batchNo={p.batchNo}
            sheddingScore={p.sheddingScore} washingInstructions={p.washingInstructions} />
          <section className="rounded-lg border border-ember/40 bg-elevated p-5">
            <h2 className="font-display text-lg text-ember">Bu halı kimler için değil</h2>
            <p className="mt-2 text-muted">{p.notFor}</p>
          </section>
          <MeasureSlip batchNo={p.batchNo} pileHeightMm={p.pileHeightMm} />
          <WaMicroCta productTitle={p.title} slug={slug} number={settings?.whatsappNumber} template={settings?.waMessageProduct} />
        </div>
      </div>
      <article className="prose prose-invert max-w-3xl text-muted">{p.description}</article>
      {p.testVideoUrl && <LiteYouTube url={p.testVideoUrl} title={`${p.title} leke testi`} />}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-2xl">Aynı leke skorundaki diğer halılar</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}

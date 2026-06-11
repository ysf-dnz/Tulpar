import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import { faqJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";

export const revalidate = 3600;

type FaqBlock = { _type: string; items?: { question: string; answer: string }[] };

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("sss"), "Sıkça Sorulan Sorular — Tulpar Carpet", "/sss/");
}

export default async function SssPage() {
  const page = await fetchPage("sss");
  const faqItems = (page?.blocks ?? [])
    .filter((b): b is FaqBlock & { _key: string } => b._type === "faqAccordionBlock")
    .flatMap((b) => b.items ?? []);
  return (
    <>
      {faqItems.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }} />
      )}
      <BlockRenderer blocks={page?.blocks ?? []} />
    </>
  );
}

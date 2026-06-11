import { client } from "@/sanity/client";
import { PAGE_QUERY } from "@/lib/queries";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";

export const revalidate = 3600;

type Page = { seo?: { metaTitle?: string; metaDescription?: string }; blocks?: Parameters<typeof BlockRenderer>[0]["blocks"] } | null;

export async function generateMetadata(): Promise<Metadata> {
  let page: Page = null;
  try {
    page = await client.fetch(PAGE_QUERY, { slug: "ana-sayfa" });
  } catch {
    // Sanity yapılandırılmadıysa varsayılan metadata
  }
  return {
    title: page?.seo?.metaTitle ?? "Tulpar Carpet — Mağazada gördüğün, evine gelen halıdır",
    description: page?.seo?.metaDescription,
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  let page: Page = null;
  try {
    page = await client.fetch(PAGE_QUERY, { slug: "ana-sayfa" }, { next: { revalidate: 3600, tags: ["page"] } });
  } catch {
    // Sanity yapılandırılmadıysa boş blok listesiyle render et
  }
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

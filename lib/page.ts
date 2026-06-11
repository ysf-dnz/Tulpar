import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { PAGE_QUERY } from "@/lib/queries";
import type { BlockRenderer } from "@/components/blocks/BlockRenderer";

export type PageDoc = {
  title?: string;
  seo?: { metaTitle?: string; metaDescription?: string };
  blocks?: Parameters<typeof BlockRenderer>[0]["blocks"];
} | null;

/** Sanity `page` dokümanını getirir; proje yapılandırılmadıysa null döner (build yeşil kalır). */
export async function fetchPage(slug: string): Promise<PageDoc> {
  try {
    return await client.fetch(PAGE_QUERY, { slug }, { next: { revalidate: 3600, tags: ["page"] } });
  } catch {
    return null;
  }
}

export function pageMetadata(page: PageDoc, fallbackTitle: string, canonical: string): Metadata {
  return {
    title: page?.seo?.metaTitle ?? fallbackTitle,
    description: page?.seo?.metaDescription,
    alternates: { canonical },
  };
}

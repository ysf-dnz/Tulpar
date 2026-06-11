import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("durust-etiket"), "Dürüst Etiket Nedir? — Tulpar Carpet", "/durust-etiket/");
}

export default async function DurustEtiketPage() {
  const page = await fetchPage("durust-etiket");
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

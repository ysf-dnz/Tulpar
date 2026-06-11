import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("cerez-politikasi"), "Çerez Politikası — Tulpar Carpet", "/cerez-politikasi/");
}

export default async function CerezPolitikasiPage() {
  const page = await fetchPage("cerez-politikasi");
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

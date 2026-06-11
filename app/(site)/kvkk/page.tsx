import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("kvkk"), "KVKK Aydınlatma Metni — Tulpar Carpet", "/kvkk/");
}

export default async function KvkkPage() {
  const page = await fetchPage("kvkk");
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("hakkimizda"), "Hakkımızda — Tulpar Carpet", "/hakkimizda/");
}

export default async function HakkimizdaPage() {
  const page = await fetchPage("hakkimizda");
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

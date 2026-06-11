import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("taahhutler"), "Taahhütlerimiz — Tulpar Carpet", "/taahhutler/");
}

export default async function TaahhutlerPage() {
  const page = await fetchPage("taahhutler");
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

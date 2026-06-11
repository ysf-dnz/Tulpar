import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage, pageMetadata } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await fetchPage("iade-kosullari"), "İade Koşulları — Tulpar Carpet", "/iade-kosullari/");
}

export default async function IadeKosullariPage() {
  const page = await fetchPage("iade-kosullari");
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}

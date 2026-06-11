import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SLUGS_QUERY } from "@/lib/queries";

const BASE = "https://tulparcarpet.com";
const statics = ["", "halilar/", "durust-etiket/", "taahhutler/", "acik-pano/", "maliyet-hesaplayici/", "hakkimizda/", "blog/", "iletisim/", "sss/", "kvkk/", "cerez-politikasi/", "iade-kosullari/"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: string[] = [];
  let posts: string[] = [];
  try {
    [products, posts] = await Promise.all([
      client.fetch<string[]>(SLUGS_QUERY("product")),
      client.fetch<string[]>(SLUGS_QUERY("blogPost")),
    ]);
  } catch {
    // Sanity yapılandırılmadıysa yalnızca statik sayfalar
  }
  return [
    ...statics.map((p) => ({ url: `${BASE}/${p}`, changeFrequency: "weekly" as const })),
    ...products.map((s) => ({ url: `${BASE}/halilar/${s}/`, changeFrequency: "weekly" as const })),
    ...posts.map((s) => ({ url: `${BASE}/blog/${s}/`, changeFrequency: "monthly" as const })),
  ];
}

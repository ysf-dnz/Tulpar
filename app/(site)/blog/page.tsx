import { client } from "@/sanity/client";
import { POSTS_QUERY } from "@/lib/queries";
import { Link } from "next-view-transitions";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Halı Rehberi | Tulpar Carpet",
  description: "Leke testleri, halı bakımı, ölçü seçimi ve dürüst etiket üzerine rehber yazılar.",
  alternates: { canonical: "/blog/" },
};

type Post = { title: string; slug: string; excerpt?: string; category?: string; publishedAt?: string };

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await client.fetch(POSTS_QUERY, {}, { next: { revalidate: 3600, tags: ["blogPost"] } });
  } catch {
    // Sanity yapılandırılmadıysa boş listeyle render et
  }
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <h1 className="font-display text-4xl">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted">Yazılar yakında burada.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((p) => (
            <article key={p.slug} className="card-premium p-6">
              <Link href={`/blog/${p.slug}/`} className="block space-y-2">
                {p.category && <span className="font-data text-xs text-gold">{p.category}</span>}
                <h2 className="font-display text-xl">{p.title}</h2>
                {p.excerpt && <p className="text-sm text-muted">{p.excerpt}</p>}
                {p.publishedAt && (
                  <time dateTime={p.publishedAt} className="font-data block text-xs text-muted">
                    {new Date(p.publishedAt).toLocaleDateString("tr-TR")}
                  </time>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Link } from "next-view-transitions";
import { client } from "@/sanity/client";
import { POST_QUERY, POSTS_QUERY, SLUGS_QUERY } from "@/lib/queries";
import { LiteYouTube } from "@/components/flow/LiteYouTube";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, videoJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";

export const revalidate = 3600;

type Post = {
  title: string; excerpt?: string; category?: string; publishedAt?: string;
  body?: Parameters<typeof PortableText>[0]["value"]; videoUrl?: string;
  updatedAt?: string; author?: string; faqItems?: { question: string; answer: string }[];
  seo?: { metaTitle?: string; metaDescription?: string };
};
type PostSummary = { title: string; slug: string; excerpt?: string; category?: string; publishedAt?: string };

export async function generateStaticParams() {
  try {
    const slugs: string[] = await client.fetch(SLUGS_QUERY("blogPost"));
    return slugs.map((slug) => ({ slug }));
  } catch {
    return []; // Sanity yapılandırılmadıysa on-demand render
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let post: Post | null = null;
  try {
    post = await client.fetch(POST_QUERY, { slug });
  } catch {
    // Sanity yapılandırılmadıysa boş metadata
  }
  if (!post) return {};
  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    alternates: { canonical: `/blog/${slug}/` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: Post | null = null;
  try {
    post = await client.fetch(POST_QUERY, { slug }, { next: { revalidate: 3600, tags: ["blogPost"] } });
  } catch {
    notFound(); // Sanity yapılandırılmadıysa da 404 — yazı gösterilemez
  }
  if (!post) notFound();

  let related: PostSummary[] = [];
  try {
    const all: PostSummary[] = await client.fetch(POSTS_QUERY, {}, { next: { revalidate: 3600, tags: ["blogPost"] } });
    related = all.filter((p) => p.slug !== slug && p.category && p.category === post!.category).slice(0, 3); // SEO-14
  } catch {
    // ilgili yazılar opsiyonel
  }

  return (
    <article className="mx-auto max-w-3xl space-y-10 px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Ana sayfa", url: "https://tulparcarpet.com/" },
        { name: "Blog", url: "https://tulparcarpet.com/blog/" },
        { name: post.title, url: `https://tulparcarpet.com/blog/${slug}/` },
      ])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({
        title: post.title, slug, excerpt: post.excerpt, publishedAt: post.publishedAt,
        updatedAt: post.updatedAt, author: post.author,
      })) }} />
      {post.videoUrl && post.publishedAt && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd({
          title: post.title, url: post.videoUrl, uploadDate: post.publishedAt,
        })) }} />
      )}
      {(post.faqItems?.length ?? 0) > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(post.faqItems!)) }} />
      )}
      <header className="space-y-3">
        {post.category && <span className="font-data text-xs text-gold">{post.category}</span>}
        <h1 className="font-display text-4xl">{post.title}</h1>
        {post.publishedAt && (
          <time dateTime={post.publishedAt} className="font-data block text-xs text-muted">
            {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
          </time>
        )}
      </header>
      {post.videoUrl && <LiteYouTube url={post.videoUrl} title={post.title} />}
      <div className="prose prose-invert max-w-none text-muted">
        {post.body && <PortableText value={post.body} />}
      </div>
      {related.length > 0 && (
        <section className="space-y-4 border-t border-stroke pt-8">
          <h2 className="font-display text-2xl">İlgili yazılar</h2>
          <ul className="space-y-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}/`} className="text-gold underline-offset-4 hover:underline">{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

const BASE = "https://tulparcarpet.com";

export const organizationJsonLd = () => ({
  "@context": "https://schema.org", "@type": "Organization",
  name: "Tulpar Carpet", url: BASE, logo: `${BASE}/logo-light.svg`,
  sameAs: ["https://instagram.com/tulparcarpet"],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org", "@type": "WebSite", url: BASE, name: "Tulpar Carpet",
  potentialAction: { "@type": "SearchAction", target: `${BASE}/halilar/?q={search_term_string}`, "query-input": "required name=search_term_string" },
});

export const productJsonLd = (p: { title: string; slug: string; description?: string; sizeVariants: { priceTRY: number }[]; seo?: { metaDescription?: string } }) => ({
  "@context": "https://schema.org", "@type": "Product",
  name: p.title, description: p.seo?.metaDescription ?? p.description, url: `${BASE}/halilar/${p.slug}/`,
  image: `${BASE}/api/og?slug=${p.slug}`,
  offers: {
    "@type": "AggregateOffer", priceCurrency: "TRY",
    lowPrice: Math.min(...p.sizeVariants.map((v) => v.priceTRY)),
    highPrice: Math.max(...p.sizeVariants.map((v) => v.priceTRY)),
    availability: "https://schema.org/InStock",
  },
});

export const breadcrumbJsonLd = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
});

export const faqJsonLd = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: items.map((it) => ({ "@type": "Question", name: it.question, acceptedAnswer: { "@type": "Answer", text: it.answer } })),
});

export const articleJsonLd = (p: { title: string; slug: string; excerpt?: string; publishedAt?: string; updatedAt?: string; author?: string }) => ({
  "@context": "https://schema.org", "@type": "Article",
  headline: p.title, description: p.excerpt, datePublished: p.publishedAt, dateModified: p.updatedAt ?? p.publishedAt,
  author: { "@type": "Organization", name: p.author ?? "Tulpar Carpet" },
  mainEntityOfPage: `${BASE}/blog/${p.slug}/`,
});

export const localBusinessJsonLd = () => ({
  "@context": "https://schema.org", "@type": "HomeGoodsStore",
  name: "Tulpar Carpet", url: BASE,
  address: { "@type": "PostalAddress", addressLocality: "Kayseri", addressCountry: "TR" },
});

export const videoJsonLd = (v: { title: string; url: string; uploadDate: string }) => {
  const id = v.url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
  return {
    "@context": "https://schema.org", "@type": "VideoObject",
    name: v.title, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, uploadDate: v.uploadDate,
  };
};

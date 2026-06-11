# Tulpar Carpet Faz 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PRD v1.1 Faz 1 kapsamını (güven platformu sitesi + Sanity blok-tabanlı panel + WhatsApp dönüşüm sistemi + tam teknik SEO) çalışır, test edilmiş halde inşa etmek.

**Architecture:** Tek Next.js 15 App Router uygulaması; Sanity Studio `/studio`'da embed; tüm sayfalar SSG/ISR + webhook revalidate; tasarım/hareket token'ları `globals.css`'te kilitli; WA tıklaması birincil dönüşüm.

**Tech Stack:** Next.js 15 (TS), Tailwind CSS v4, Sanity v3 (`next-sanity`), `next-view-transitions`, Vitest, Playwright (QA fazı), `@vercel/og`.

**Spec:** `docs/superpowers/specs/2026-06-11-tulpar-carpet-design.md` — gereksinim kodları (TAS-, FLW-, UD-, AP-, …) PRD v1.1'e referans verir.

**Çalışma dizini:** `~/Downloads/tulpar-carpet` (repo kökü; Next uygulaması köke kurulur).

**İş paketleri (sub-agent dağılımı):** P1 Altyapı = Task 1–3 (sıralı, ön şart). Sonra paralel: P2 CMS = Task 4–6, P3 UI/FLW = Task 7–10, P4 lib = Task 11–12. Sonra P5 Sayfalar = Task 13–18 (P2–P4'e bağımlı), P6 SEO/Analitik = Task 19–21, P7 Operasyon = Task 22–23.

---

### Task 1: Next.js + Tailwind v4 iskeleti

**Files:**
- Create: tüm `create-next-app` çıktısı (repo köküne), `package.json`, `next.config.ts`

- [ ] **Step 1: Scaffold**

```bash
cd ~/Downloads/tulpar-carpet
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --no-turbopack --use-npm --yes
```

Not: dizin boş değil (docs/, assets/) — create-next-app reddederse geçici dizine kur, içeriği köke taşı:

```bash
npx create-next-app@latest /tmp/tulpar-scaffold --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --yes
rsync -a --ignore-existing /tmp/tulpar-scaffold/ ~/Downloads/tulpar-carpet/ && rm -rf /tmp/tulpar-scaffold
```

- [ ] **Step 2: Bağımlılıklar**

```bash
npm i next-sanity @sanity/image-url sanity next-view-transitions
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react
```

- [ ] **Step 3: next.config.ts — trailing slash (IA-01), güvenlik başlıkları (GV-02), görsel formatları**

```ts
import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy-Report-Only",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net; img-src 'self' data: https://cdn.sanity.io https://www.google-analytics.com https://i.ytimg.com; style-src 'self' 'unsafe-inline'; frame-src https://www.youtube-nocookie.com https://www.google.com; connect-src 'self' https://*.sanity.io https://www.google-analytics.com",
  },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};
export default nextConfig;
```

- [ ] **Step 4: Doğrula ve commit**

```bash
npm run build
git add -A && git commit -m "feat: Next.js 15 + Tailwind v4 iskeleti, güvenlik başlıkları, trailing slash"
```

---

### Task 2: Tasarım token'ları, fontlar, hareket sistemi temeli

**Files:**
- Modify: `app/globals.css` (tam değiştir)
- Modify: `app/layout.tsx`

- [ ] **Step 1: globals.css — renk (TAS), gradient (2.3), hareket token'ları (2.6), reduced-motion (FLW-09)**

```css
@import "tailwindcss";

:root {
  /* 2.2 Renk token'ları */
  --bg-base: #0E1322;
  --bg-elevated: #161F38;
  --bg-stroke: #27355C;
  --accent-ember: #C2452F;
  --accent-gold: #D9A441;
  --text-primary: #F1EAD9;
  --text-muted: #9AA6C4;
  --success: #5FA876;

  /* 2.3 Gradient sistemi — ad-hoc gradient yasak */
  --grad-hero: radial-gradient(120% 90% at 70% 10%, #27355C 0%, #161F38 45%, #0E1322 100%);
  --grad-ember: linear-gradient(135deg, #C2452F 0%, #8F2E1E 60%, #5C1F14 100%);
  --grad-gold: linear-gradient(120deg, #E8C06A 0%, #D9A441 40%, #A87B26 100%);
  --grad-card: linear-gradient(180deg, rgba(39,53,92,.55) 0%, rgba(22,31,56,.95) 100%);
  --grad-border: linear-gradient(135deg, #D9A441, #C2452F);

  /* 2.6 Hareket token'ları — ad-hoc süre/easing yasak */
  --ease-flow: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --dur-micro: 180ms;
  --dur-element: 320ms;
  --dur-page: 480ms;
}

@theme inline {
  --color-base: var(--bg-base);
  --color-elevated: var(--bg-elevated);
  --color-stroke: var(--bg-stroke);
  --color-ember: var(--accent-ember);
  --color-gold: var(--accent-gold);
  --color-cream: var(--text-primary);
  --color-muted: var(--text-muted);
  --color-success: var(--success);
  --font-display: var(--font-space-grotesk);
  --font-body: var(--font-figtree);
  --font-data: var(--font-plex-mono);
}

body {
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
}

/* TAS-02 gradient kenarlık yardımcı sınıfı */
.card-premium {
  border: 1px solid transparent;
  border-radius: 0.75rem;
  background: var(--grad-card) padding-box, var(--grad-border) border-box;
}

/* TAS-01 hero ışık animasyonu (≤12s) */
@keyframes hero-glow {
  0%, 100% { background-position: 70% 10%; }
  50% { background-position: 60% 25%; }
}
.hero-surface {
  background: var(--grad-hero);
  background-size: 160% 160%;
  animation: hero-glow 12s var(--ease-flow) infinite;
}

/* FLW-04 scroll reveal: animation-timeline tercih, JS fallback sınıfı */
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-up var(--dur-element) var(--ease-flow) both;
    animation-timeline: view();
    animation-range: entry 0% entry 40%;
  }
}
.reveal-js { opacity: 0; transform: translateY(16px); transition: opacity var(--dur-element) var(--ease-flow), transform var(--dur-element) var(--ease-flow); }
.reveal-js.is-visible { opacity: 1; transform: none; }
@keyframes reveal-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

/* FLW-09 / ER-03 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal-js { opacity: 1; transform: none; }
}

/* ER-02 görünür focus — altın oker */
:focus-visible { outline: 2px solid var(--accent-gold); outline-offset: 2px; }
```

- [ ] **Step 2: layout.tsx — self-host fontlar (TAS-05), ViewTransitions (FLW-01), TR dil**

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Figtree, IBM_Plex_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["500", "700"], variable: "--font-space-grotesk", display: "swap" });
const body = Figtree({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--font-figtree", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tulparcarpet.com"),
  title: { default: "Tulpar Carpet — Mağazada Gördüğün, Evine Gelen Halıdır", template: "%s | Tulpar Carpet" },
  description: "Dürüst Etiket, 30 Gün Serili Dene ve Açık Şikayet Panosu ile radikal şeffaf D2C halı markası.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <body>{children}</body>
      </html>
    </ViewTransitions>
  );
}
```

(`next/font/google` build-time indirir ve self-host eder; runtime'da Google CDN çağrısı yapılmaz — TAS-05 sağlanır.)

- [ ] **Step 3: Doğrula ve commit**

```bash
npm run build
git add -A && git commit -m "feat: tasarım/gradient/hareket token'ları, self-host fontlar, ViewTransitions"
```

---

### Task 3: Vitest kurulumu

**Files:**
- Create: `vitest.config.ts`, `lib/__tests__/smoke.test.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", include: ["lib/**/*.test.ts", "components/**/*.test.tsx"] },
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
});
```

- [ ] **Step 2: smoke test + script**

`lib/__tests__/smoke.test.ts`:
```ts
import { expect, test } from "vitest";
test("vitest çalışıyor", () => { expect(1 + 1).toBe(2); });
```

`package.json` scripts'e ekle: `"test": "vitest run"`.

- [ ] **Step 3: Çalıştır, commit**

```bash
npm test            # Beklenen: 1 passed
git add -A && git commit -m "chore: vitest kurulumu"
```

---

### Task 4: Sanity projesi, client ve embed Studio

**Files:**
- Create: `sanity/env.ts`, `sanity/client.ts`, `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`, `.env.local.example`

- [ ] **Step 1: Sanity projesi oluştur** (kullanıcı hesabı gerekir; yoksa env placeholder ile devam, kullanıcıya not düş)

```bash
npx sanity@latest init --env --create-project "tulpar-carpet" --dataset production --bare
```

`.env.local.example`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
NEXT_PUBLIC_WA_NUMBER=905000000000
```

- [ ] **Step 2: env + client**

`sanity/env.ts`:
```ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-06-01";
```

`sanity/client.ts`:
```ts
import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./env";

export const client = createClient({
  projectId, dataset, apiVersion,
  useCdn: true,
  perspective: "published",
});
```

- [ ] **Step 3: sanity.config.ts + embed Studio (ADM-14: tek URL, mobil tarayıcıda çalışır)**

`sanity.config.ts`:
```ts
"use client";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { projectId, dataset } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { documentActions } from "./sanity/actions";

export default defineConfig({
  name: "tulpar",
  title: "Tulpar Carpet Paneli",
  projectId, dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({ previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } } }),
  ],
  schema: { types: schemaTypes },
  document: { actions: documentActions },
});
```

`app/studio/[[...tool]]/page.tsx`:
```tsx
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

(`sanity/schemas`, `sanity/structure`, `sanity/actions` Task 5–6'da yazılır; bu task sonunda boş dizi export eden stub'lar koy: `export const schemaTypes = []`, `export const structure = (S)=>S.defaults()`, `export const documentActions = (prev)=>prev`.)

- [ ] **Step 4: Doğrula, commit**

```bash
npm run build
git add -A && git commit -m "feat: Sanity client + embed Studio (/studio)"
```

---

### Task 5: Sanity şemaları (içerik modeli)

**Files:**
- Create: `sanity/schemas/index.ts`, `sanity/schemas/product.ts`, `sanity/schemas/complaint.ts`, `sanity/schemas/blogPost.ts`, `sanity/schemas/siteSettings.ts`, `sanity/schemas/page.ts`, `sanity/schemas/blocks.ts`, `sanity/schemas/seo.ts`

- [ ] **Step 1: seo.ts — ortak SEO objesi (SEO-10 karakter validasyonları)**

```ts
import { defineType, defineField } from "sanity";

export const seoObject = defineType({
  name: "seo", title: "SEO", type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Meta Başlık", type: "string",
      validation: (r) => r.required().max(60) }),
    defineField({ name: "metaDescription", title: "Meta Açıklama", type: "text", rows: 3,
      validation: (r) => r.required().max(155) }),
    defineField({ name: "ogImage", title: "OG Görseli", type: "image" }),
  ],
});
```

- [ ] **Step 2: product.ts — Dürüst Etiket, zorunlu `notFor` (UD-03), zorunlu alt (SEO-06), Faz 2 rezerv alanları**

```ts
import { defineType, defineField, defineArrayMember } from "sanity";

const stainResult = { type: "object" as const, fields: [
  defineField({ name: "result", title: "Sonuç", type: "string",
    options: { list: [
      { title: "ÇIKAR", value: "PASS" }, { title: "KISMEN", value: "PARTIAL" }, { title: "ÇIKMAZ", value: "FAIL" },
    ], layout: "radio" }, validation: (r) => r.required() }),
  defineField({ name: "methodNote", title: "Yöntem Notu", type: "string" }),
]};

export const product = defineType({
  name: "product", title: "Ürün", type: "document",
  fields: [
    defineField({ name: "title", title: "Ürün Adı", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Açıklama (≥250 kelime, SEO-12)", type: "text",
      validation: (r) => r.required().custom((v) =>
        (v ?? "").trim().split(/\s+/).length >= 250 || "Açıklama en az 250 kelime olmalı (SEO-12)") }),
    defineField({ name: "roomTags", title: "Oda Etiketleri", type: "array", of: [{ type: "string" }],
      options: { list: ["salon", "yatak-odasi", "cocuk-odasi", "koridor", "mutfak"] } }),
    defineField({ name: "sizeVariants", title: "Ölçü Seçenekleri", type: "array", validation: (r) => r.required().min(1),
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "size", title: "Ölçü", type: "string", validation: (r) => r.required() }),
        defineField({ name: "priceTRY", title: "Fiyat (₺)", type: "number", validation: (r) => r.required() }),
        defineField({ name: "sku", title: "SKU (Faz 2)", type: "string" }),
        defineField({ name: "stockStatus", title: "Stok (Faz 2)", type: "string",
          options: { list: ["in_stock", "out_of_stock"] }, initialValue: "in_stock" }),
      ]})]}),
    defineField({ name: "heroImage", title: "Ana Görsel", type: "image", validation: (r) => r.required(),
      fields: [defineField({ name: "alt", title: "Alt Metin", type: "string", validation: (r) => r.required() })] }),
    defineField({ name: "images", title: "Galeri (≥5 görsel, UD-06)", type: "array", validation: (r) => r.required().min(5),
      of: [defineArrayMember({ type: "image",
        fields: [defineField({ name: "alt", title: "Alt Metin", type: "string", validation: (r) => r.required() })] })] }),
    defineField({ name: "pileHeightMm", title: "Hav Yüksekliği (mm, ölçülmüş)", type: "number", validation: (r) => r.required() }),
    defineField({ name: "batchNo", title: "Parti No", type: "string", validation: (r) => r.required() }),
    defineField({ name: "honestLabel", title: "Dürüst Etiket — Leke Testleri", type: "object", validation: (r) => r.required(),
      fields: [
        defineField({ name: "tea", title: "Çay", ...stainResult }),
        defineField({ name: "coffee", title: "Kahve", ...stainResult }),
        defineField({ name: "cherry", title: "Vişne", ...stainResult }),
        defineField({ name: "ink", title: "Mürekkep", ...stainResult }),
      ]}),
    defineField({ name: "sheddingScore", title: "Tüy Dökme Skoru", type: "string",
      options: { list: ["dusuk", "orta", "yuksek"] }, validation: (r) => r.required() }),
    defineField({ name: "washingInstructions", title: "Yıkama Talimatı", type: "text", validation: (r) => r.required() }),
    defineField({ name: "notFor", title: "Bu halı kimler için değil (UD-03 — zorunlu)", type: "text",
      validation: (r) => r.required().min(40) }),
    defineField({ name: "testVideoUrl", title: "Leke Testi Videosu (YouTube unlisted URL)", type: "url" }),
    defineField({ name: "seo", title: "SEO", type: "seo", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", media: "heroImage" } },
});
```

- [ ] **Step 3: complaint.ts (AP-01) + blogPost.ts + siteSettings.ts**

`sanity/schemas/complaint.ts`:
```ts
import { defineType, defineField } from "sanity";

export const complaint = defineType({
  name: "complaint", title: "Şikayet Kaydı", type: "document",
  fields: [
    defineField({ name: "ticketNo", title: "Ticket No", type: "number", validation: (r) => r.required(),
      description: "Otomatik artar; elle değiştirmeyin." }),
    defineField({ name: "date", title: "Tarih", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "status", title: "Durum", type: "string", validation: (r) => r.required(),
      options: { list: [
        { title: "AÇIK", value: "OPEN" }, { title: "ÇÖZÜLDÜ", value: "SOLVED" }, { title: "İADE", value: "REFUND" },
      ], layout: "radio" }, initialValue: "OPEN" }),
    defineField({ name: "customerText", title: "Müşteri Metni (anonim)", type: "text", validation: (r) => r.required() }),
    defineField({ name: "responseText", title: "Tulpar Cevabı", type: "text" }),
    defineField({ name: "responseAt", title: "Yanıt Tarihi", type: "datetime" }),
  ],
  preview: { select: { title: "customerText", subtitle: "status" } },
});
```

`sanity/schemas/blogPost.ts`:
```ts
import { defineType, defineField, defineArrayMember } from "sanity";

export const blogPost = defineType({
  name: "blogPost", title: "Blog Yazısı", type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "body", type: "array", of: [
      defineArrayMember({ type: "block" }),
      defineArrayMember({ type: "image", fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] }),
    ], validation: (r) => r.required() }),
    defineField({ name: "category", type: "string", options: { list: ["bakim", "test", "rehber", "marka"] } }),
    defineField({ name: "author", type: "string", initialValue: "Tulpar Carpet" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", type: "datetime" }),
    defineField({ name: "videoUrl", title: "Gömülü Test Videosu (SEO-15)", type: "url" }),
    defineField({ name: "faqItems", title: "FAQ Maddeleri (schema için)", type: "array",
      of: [defineArrayMember({ type: "object", fields: [
        defineField({ name: "question", type: "string", validation: (r) => r.required() }),
        defineField({ name: "answer", type: "text", validation: (r) => r.required() }),
      ]})]}),
    defineField({ name: "seo", type: "seo", validation: (r) => r.required() }),
  ],
});
```

`sanity/schemas/siteSettings.ts`:
```ts
import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings", title: "Site Ayarları", type: "document",
  fields: [
    defineField({ name: "whatsappNumber", title: "WhatsApp Numarası (90… formatında)", type: "string",
      validation: (r) => r.required().regex(/^90\d{10}$/) }),
    defineField({ name: "waMessageGeneral", title: "WA Mesajı — Genel", type: "text",
      initialValue: "Merhaba, tulparcarpet.com'dan yazıyorum. Halılarınız hakkında bilgi almak istiyorum." }),
    defineField({ name: "waMessageProduct", title: "WA Mesajı — Ürün ({urun}, {olcu}, {url})", type: "text",
      initialValue: "Merhaba, {urun} ({olcu}) hakkında bilgi almak istiyorum. {url}" }),
    defineField({ name: "waMessageCalculator", title: "WA Mesajı — Hesaplayıcı ({fark})", type: "text",
      initialValue: "Merhaba, maliyet hesaplayıcısında {fark} ₺ fark çıktı. Detay konuşabilir miyiz?" }),
    defineField({ name: "waMessagePano", title: "WA Mesajı — Pano", type: "text",
      initialValue: "Merhaba, bir konuda geri bildirimde bulunmak istiyorum." }),
    defineField({ name: "calcDefaultWashCount", title: "Hesaplayıcı: yıllık yıkatma (varsayılan)", type: "number", initialValue: 2 }),
    defineField({ name: "calcDefaultWashPrice", title: "Hesaplayıcı: sefer başı yıkama ₺ (varsayılan)", type: "number", initialValue: 900 }),
    defineField({ name: "instagramUrl", type: "url", initialValue: "https://instagram.com/tulparcarpet" }),
    defineField({ name: "announcement", title: "Duyuru Bandı", type: "string" }),
  ],
});
```

- [ ] **Step 4: page.ts + blocks.ts — blok tabanlı sayfa (ADM-01…04)**

`sanity/schemas/blocks.ts`:
```ts
import { defineType, defineField, defineArrayMember } from "sanity";

const base = [
  defineField({ name: "hidden", title: "Gizle (yayından kaldırmadan sakla)", type: "boolean", initialValue: false }),
];

export const heroBlock = defineType({
  name: "heroBlock", title: "Hero", type: "object",
  fields: [...base,
    defineField({ name: "variant", type: "string", options: { list: ["gorselli", "videolu", "minimal"] }, initialValue: "gorselli", validation: (r) => r.required() }),
    defineField({ name: "heading", type: "string", validation: (r) => r.required(), initialValue: "Mağazada gördüğün, evine gelen halıdır." }),
    defineField({ name: "subheading", type: "text" }),
    defineField({ name: "image", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "primaryCtaLabel", type: "string", initialValue: "Koleksiyonu Gör" }),
    defineField({ name: "primaryCtaHref", type: "string", initialValue: "/halilar/" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Hero — ${title}` }) },
});

export const commitmentGridBlock = defineType({
  name: "commitmentGridBlock", title: "Taahhüt Izgarası", type: "object",
  fields: [...base, defineField({ name: "items", type: "array", validation: (r) => r.required().min(4).max(4),
    of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "title", type: "string", validation: (r) => r.required() }),
      defineField({ name: "text", type: "text", validation: (r) => r.required() }),
      defineField({ name: "href", type: "string", validation: (r) => r.required() }),
    ]})]})],
  preview: { prepare: () => ({ title: "Taahhüt Izgarası" }) },
});

export const productShowcaseBlock = defineType({
  name: "productShowcaseBlock", title: "Ürün Vitrini", type: "object",
  fields: [...base,
    defineField({ name: "mode", type: "string", options: { list: ["elle", "son-eklenen"] }, initialValue: "elle" }),
    defineField({ name: "products", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })] }),
    defineField({ name: "heading", type: "string", initialValue: "Öne Çıkan Halılar" }),
  ],
  preview: { prepare: () => ({ title: "Ürün Vitrini" }) },
});

export const manifestoBlock = defineType({
  name: "manifestoBlock", title: "Manifesto / Metin", type: "object",
  fields: [...base,
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block" })] })],
  preview: { select: { title: "heading" } },
});

export const panoSummaryBlock = defineType({
  name: "panoSummaryBlock", title: "Açık Pano Özeti", type: "object",
  fields: [...base, defineField({ name: "heading", type: "string", initialValue: "Açık Şikayet Panosu" })],
  preview: { prepare: () => ({ title: "Açık Pano Özeti" }) },
});

export const calculatorCtaBlock = defineType({
  name: "calculatorCtaBlock", title: "Hesaplayıcı Çağrısı", type: "object",
  fields: [...base, defineField({ name: "heading", type: "string", initialValue: "5 yıllık gerçek maliyeti hesapla" })],
  preview: { prepare: () => ({ title: "Hesaplayıcı Çağrısı" }) },
});

export const videoBandBlock = defineType({
  name: "videoBandBlock", title: "Video Bandı", type: "object",
  fields: [...base,
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "videoUrl", type: "url", validation: (r) => r.required() })],
  preview: { prepare: () => ({ title: "Video Bandı" }) },
});

export const instagramStripBlock = defineType({
  name: "instagramStripBlock", title: "Instagram Şeridi", type: "object",
  fields: [...base, defineField({ name: "posts", title: "Gönderiler (manuel küratörlük, AS-05)", type: "array",
    of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "image", type: "image", validation: (r) => r.required(),
        fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })] }),
      defineField({ name: "permalink", type: "url", validation: (r) => r.required() }),
    ]})]})],
  preview: { prepare: () => ({ title: "Instagram Şeridi" }) },
});

export const faqAccordionBlock = defineType({
  name: "faqAccordionBlock", title: "SSS Akordeonu", type: "object",
  fields: [...base, defineField({ name: "items", type: "array", validation: (r) => r.required(),
    of: [defineArrayMember({ type: "object", fields: [
      defineField({ name: "question", type: "string", validation: (r) => r.required() }),
      defineField({ name: "answer", type: "text", validation: (r) => r.required() }),
    ]})]})],
  preview: { prepare: () => ({ title: "SSS Akordeonu" }) },
});

export const ctaBandBlock = defineType({
  name: "ctaBandBlock", title: "CTA Bandı", type: "object",
  fields: [...base,
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaLabel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaHref", type: "string", validation: (r) => r.required() })],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `CTA Bandı — ${title}` }) },
});

export const blockTypes = [heroBlock, commitmentGridBlock, productShowcaseBlock, manifestoBlock,
  panoSummaryBlock, calculatorCtaBlock, videoBandBlock, instagramStripBlock, faqAccordionBlock, ctaBandBlock];
```

`sanity/schemas/page.ts`:
```ts
import { defineType, defineField, defineArrayMember } from "sanity";
import { blockTypes } from "./blocks";

export const page = defineType({
  name: "page", title: "Sayfa", type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", validation: (r) => r.required(),
      description: "Ana sayfa için 'ana-sayfa' kullanın." }),
    defineField({ name: "blocks", title: "Bloklar (sürükle-bırak sırala, ADM-02)", type: "array",
      of: blockTypes.map((b) => defineArrayMember({ type: b.name })) }),
    defineField({ name: "seo", type: "seo", validation: (r) => r.required() }),
  ],
});
```

`sanity/schemas/index.ts`:
```ts
import { seoObject } from "./seo";
import { product } from "./product";
import { complaint } from "./complaint";
import { blogPost } from "./blogPost";
import { siteSettings } from "./siteSettings";
import { page } from "./page";
import { blockTypes } from "./blocks";

export const schemaTypes = [seoObject, product, complaint, blogPost, siteSettings, page, ...blockTypes];
```

- [ ] **Step 5: Build doğrula, commit**

```bash
npm run build
git add -A && git commit -m "feat: Sanity içerik modeli — ürün/Dürüst Etiket, pano, blog, ayarlar, blok tabanlı sayfa"
```

---

### Task 6: Studio özelleştirme — delete kilidi (AP-03), Türkçe desk, ticket no otomatiği

**Files:**
- Create: `sanity/actions.ts`, `sanity/structure.ts`
- Modify: `sanity.config.ts` (stub'ları gerçek import'larla değiştir — Task 4'te hazırlandı)

- [ ] **Step 1: actions.ts — complaint'te delete/duplicate/unpublish kaldır (AP-03, ADM-10)**

```ts
import type { DocumentActionsResolver } from "sanity";

export const documentActions: DocumentActionsResolver = (prev, ctx) => {
  if (ctx.schemaType === "complaint") {
    return prev.filter((a) => !["delete", "duplicate", "unpublish"].includes(a.action ?? ""));
  }
  return prev;
};
```

- [ ] **Step 2: structure.ts — Türkçe desk + singleton ayarlar**

```ts
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list().title("İçerik").items([
    S.listItem().title("Sayfalar").child(S.documentTypeList("page")),
    S.listItem().title("Ürünler").child(S.documentTypeList("product")),
    S.listItem().title("Açık Pano").child(S.documentTypeList("complaint").defaultOrdering([{ field: "ticketNo", direction: "desc" }])),
    S.listItem().title("Blog").child(S.documentTypeList("blogPost")),
    S.listItem().title("Site Ayarları").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
  ]);
```

- [ ] **Step 3: ticketNo otomatik artan — `initialValue` async**

`sanity/schemas/complaint.ts` içindeki `ticketNo` alanını şu şekilde güncelle (document-level `initialValue` yerine alan düzeyi async client kullanılamadığından document initialValue kullan):

```ts
// complaint defineType'a ekle:
initialValue: async (_params, { getClient }) => {
  const client = getClient({ apiVersion: "2026-06-01" });
  const last = await client.fetch<number | null>(`max(*[_type=="complaint"].ticketNo)`);
  return { ticketNo: (last ?? 1000) + 1, date: new Date().toISOString() };
},
```

(`ticketNo` alanından kendi `initialValue`'sunu kaldır; `readOnly: ({ document }) => Boolean(document?._createdAt)` ekle — yayın sonrası elle değişmez.)

- [ ] **Step 4: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: Studio — şikayet silme kilidi (AP-03), Türkçe desk, otomatik ticket no"
```

---

### Task 7: lib/wa.ts — WhatsApp link üreticisi (TDD)

**Files:**
- Create: `lib/wa.ts`, `lib/__tests__/wa.test.ts`

- [ ] **Step 1: Failing test yaz**

`lib/__tests__/wa.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { buildWaLink, fillTemplate } from "@/lib/wa";

describe("fillTemplate", () => {
  test("yer tutucuları doldurur", () => {
    expect(fillTemplate("Merhaba, {urun} ({olcu})", { urun: "Bozkır", olcu: "160x230" }))
      .toBe("Merhaba, Bozkır (160x230)");
  });
});

describe("buildWaLink", () => {
  test("wa.me linki + Ref kodu (WA-05, WA-06)", () => {
    const url = buildWaLink({ number: "905001112233", message: "Merhaba", refCode: "UD-bozkir" });
    expect(url).toBe("https://wa.me/905001112233?text=" + encodeURIComponent("Merhaba\n\nRef: UD-bozkir"));
  });
  test("ref kodu yoksa eklenmez", () => {
    const url = buildWaLink({ number: "905001112233", message: "Merhaba" });
    expect(url).toBe("https://wa.me/905001112233?text=" + encodeURIComponent("Merhaba"));
  });
});
```

- [ ] **Step 2: Çalıştır — FAIL bekle**

```bash
npm test  # Beklenen: FAIL — "@/lib/wa" bulunamadı
```

- [ ] **Step 3: Implementasyon**

`lib/wa.ts`:
```ts
export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}

export function buildWaLink(opts: { number: string; message: string; refCode?: string }): string {
  const text = opts.refCode ? `${opts.message}\n\nRef: ${opts.refCode}` : opts.message;
  return `https://wa.me/${opts.number}?text=${encodeURIComponent(text)}`;
}
```

- [ ] **Step 4: Test PASS doğrula, commit**

```bash
npm test  # Beklenen: PASS
git add -A && git commit -m "feat: WA link üreticisi (WA-05/06) — TDD"
```

---

### Task 8: lib/analytics.ts + lib/queries.ts (GROQ)

**Files:**
- Create: `lib/analytics.ts`, `lib/queries.ts`, `lib/image.ts`

- [ ] **Step 1: analytics.ts — whatsapp_click ve diğer olay sözlüğü (AN-04, WA-07)**

```ts
type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void; }
}

export function track(event: "whatsapp_click" | "calculator_used" | "label_video_play" | "pano_viewed", params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  if (event === "whatsapp_click") window.fbq?.("track", "Contact", params);
}
```

- [ ] **Step 2: queries.ts — tüm GROQ sorguları tek dosyada**

```ts
import { groq } from "next-sanity";

export const SETTINGS_QUERY = groq`*[_type=="siteSettings"][0]`;
export const PAGE_QUERY = groq`*[_type=="page" && slug.current==$slug][0]{
  ..., blocks[]{ ..., products[]->{title, "slug": slug.current, heroImage, sizeVariants, honestLabel} }
}`;
export const PRODUCTS_QUERY = groq`*[_type=="product"] | order(_createdAt desc){
  title, "slug": slug.current, heroImage, sizeVariants, honestLabel, roomTags
}`;
export const PRODUCT_QUERY = groq`*[_type=="product" && slug.current==$slug][0]{
  ..., "slug": slug.current
}`;
export const RELATED_QUERY = groq`*[_type=="product" && slug.current!=$slug
  && honestLabel.tea.result==$tea][0...4]{ title, "slug": slug.current, heroImage, sizeVariants, honestLabel }`;
export const COMPLAINTS_QUERY = groq`*[_type=="complaint"] | order(ticketNo desc){
  ticketNo, date, status, customerText, responseText, responseAt
}`;
export const PANO_STATS_QUERY = groq`{
  "total": count(*[_type=="complaint" && date > now() - 60*60*24*365]),
  "answered": count(*[_type=="complaint" && defined(responseText) && date > now() - 60*60*24*365]),
  "refunds": count(*[_type=="complaint" && status=="REFUND" && date > now() - 60*60*24*365]),
  "avgResponseHours": math::avg(*[_type=="complaint" && defined(responseAt)]{
    "h": (dateTime(responseAt) - dateTime(date)) / 3600 }.h)
}`;
export const POSTS_QUERY = groq`*[_type=="blogPost"] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, category, publishedAt
}`;
export const POST_QUERY = groq`*[_type=="blogPost" && slug.current==$slug][0]`;
export const SLUGS_QUERY = (type: string) => groq`*[_type=="${type}" && defined(slug.current)].slug.current`;
```

- [ ] **Step 3: image.ts — Sanity görsel URL + LQIP**

```ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const builder = imageUrlBuilder(client);
export const urlFor = (src: object) => builder.image(src).auto("format");
```

- [ ] **Step 4: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: analytics olay sözlüğü, GROQ sorguları, görsel yardımcıları"
```

---

### Task 9: UI çekirdeği + at figürü SVG + WhatsApp FAB

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/StainBadge.tsx`, `components/whatsapp/horse.svg` → `components/whatsapp/HorseIcon.tsx`, `components/whatsapp/WaFab.tsx`

- [ ] **Step 1: At figürünü izole et** — `assets/logo/tulparcarpet15.svg` içindeki `<g>` (satır 28–34, beş `<path class="cls-2">`) at figürüdür. Path'leri kopyalayıp `HorseIcon.tsx` yap; viewBox'ı at grubunun sınırına kırp (`0 0 165 153` yaklaşık — path koordinatları x≈0–160, y≈0–153):

```tsx
export function HorseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 165 153" className={className} aria-hidden="true" fill="currentColor">
      <path d="M61.4,51.46c-2.59,3.45-5.15,6.87-6.46,10.96,1.63,1.31,3.2,2.39,4.98,3.22,2.88-3,4.63-6.4,6.48-10.01,3.76-7.32,8.19-13.88,14.33-19.48,8.19-7.47,18.15-12.38,29.02-14.71,1.5-.32,2.95-.56,2.93-2.09-8.1-.53-15.53-.4-22.9,1.63,2.15.65,4.02.61,5.58,1.74l-8.4,1.6c-5.3,1.01-10.27,3.55-14.19,7.56,3.32-.61,6-1.85,9.05-.95-10.12,2.86-18.25,10.42-22.56,19.22,2.85-1.28,4.42-3.48,7.37-3.43-2.2,1.58-3.8,2.83-5.23,4.74Z"/>
      <path d="M133.27,26.83c3.43-4.35,5.43-9.58,5.01-15.32-2.56,2.79-5.23,4.95-8.35,6.88-1.56.96-2.56,2.58-2.74,4.32,2.57,1.09,4.14,2.37,6.08,4.13Z"/>
      <path d="M119.76,26.93l3.39-10.66c-1.72,3.54-7.1,6.81-3.39,10.66Z"/>
      <path d="M151.8,82.29c.22-.91.18-.94-.33-.14,0,.01-.01.02-.02.03-1.06,1.68-1.4,4.21-.32,5.95.49.79,1.91.45,2.06-.09.86-3.18-1.85-3.85-1.39-5.75Z"/>
      <path d="M158.76,78.91c-3.86-8.61-8.38-16.72-12.97-24.99-2.19-3.91-3.71-7.73-4.17-12.21l-7.34-10.89c-1.97-3.21-4.49-5.68-8.08-7.16-.72.6-3.13,4-4.5,3.7,3.35-4.98,6.56-12.83,6.51-18.62l-9.91,7.51c-3.03,2.3-5.22,5.3-6.94,8.52-.45-.76-.3-1.16-.4-1.95-5.21,1.52-10.26,2.63-15.25,5.1-12.16,6.03-21.86,15.98-27.89,28.12-1.91,3.85-3.8,7.1-6.67,10.51l8.54,5.49c11.56,7.44,23.01,18.05,27.62,31.35-4.16-6.83-8.61-12.8-14.65-17.94-6.28-5.33-12.76-9.65-19.84-13.91-13.42-8.07-28.52-18.09-37.51-30.8C16.8,28.54,12.99,14.15,18.53,0c-10.27,11.8-12.57,28.08-5.87,42.27,4.19,8.89,10.87,15.98,18.82,21.69l13.46,8.61,13.32,9.65c-5.72-3.31-11.6-5.88-17.35-9.05l-5.32-2.93C17.67,60.35,4.12,47.08,2.15,25.59c-5.32,18.74,2.08,37.02,17.41,48.13l11.3,6.83c11.85,5.88,25.77,8.65,37.07,15.89-7.75-2.62-14.86-5.37-22.68-7.26-5.64-1.37-10.81-3.4-16.2-5.37-11.96-4.35-22.4-13.22-29.05-24.44,3.37,19.9,16.7,32.78,35.69,38.01,8.15,2.25,16.11,3.45,24.4,4.97,5.49,1.01,10.87,2.06,15.72,4.77-6.01-1.26-11.34-2.5-17.26-2.69-15.33-.48-29.8-1.21-42.36-10.05-.06.03-.2-.02-.31-.21-.38-.08-.5.36-.19.51.12.06.21.2.36.41,5.36,7.24,12.52,13.02,21.27,15.68,19.08,5.81,43.87-2.73,59.72,14.76,6.89,7.61,8.63,17.87,4.86,27.67,14.65-10.59,22.82-26.15,17.3-43.84-5.3-16.98-20.24-27.99-13.61-41.96-5.18-5.14-6.04-12.37-3.76-19.12-8.75,8.84-9.21,22.31-5.13,33.55,4.03,11.12,10.67,18.51,12.11,32.69.2,2,.32,3.92-.23,5.74-.77-7.89-3.02-14.85-6.59-21.72-2.92-5.61-5.72-10.88-7.84-16.89-2.99-8.5-3.04-17.77.87-25.9,2.23-4.64,5.12-8.85,9.64-11.54-2.76,5.98-3.31,11.78-.74,17.4,3.12,6.84,10.26,10.7,17.67,9.37,2.3-.41,3.77-1.85,6.06-2.84-1.31,2.48-3.66,3.39-6.29,4.39,1.63,2.24,4.02,4.01,6.25,5.99l8.02,7.13c1.98,1.76-.68,6.63,4.27,8.68,2.04.84,4.14,1.89,6.32,1.37-.54-3.13-2.22-5.4-3.12-7.97,2.64,1.64,2.62,4.92,4.47,6.84,2.05,2.12,6.13.55,7.41-1.74l2.64-4.75c2.31-2.81,2.63-5.79,1.11-9.17ZM132.83,51.61c-1.7-2.63-4.84-.94-6.8-4.5-.58-1.06-1.39-1.51-2.39-2.02l4.89.02c2.64.01,4.29,1.42,4.81,3.85l8.54,16.68-9.05-14.04ZM153.19,88.04c-.15.55-1.57.88-2.06.09-1.08-1.74-.74-4.27.32-5.95,0-.01.01-.02.02-.03.5-.79.55-.77.33.14-.46,1.9,2.25,2.57,1.39,5.75Z"/>
    </svg>
  );
}
```

- [ ] **Step 2: Button.tsx + StainBadge.tsx**

`components/ui/Button.tsx`:
```tsx
import Link from "next/link";

const styles = {
  primary: "text-cream [background:var(--grad-ember)] hover:brightness-110",
  secondary: "border border-stroke text-cream hover:border-gold",
} as const;

export function Button({ href, variant = "primary", children, onClick, target }: {
  href?: string; variant?: keyof typeof styles; children: React.ReactNode;
  onClick?: () => void; target?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-[transform,filter] duration-[var(--dur-micro)] [transition-timing-function:var(--ease-flow)] hover:-translate-y-0.5 ${styles[variant]}`;
  if (href) return <Link href={href} target={target} className={cls} onClick={onClick}>{children}</Link>;
  return <button className={cls} onClick={onClick}>{children}</button>;
}
```

`components/ui/StainBadge.tsx` (leke skoru rozeti — UL-03/AS-03; skor = 4 testten PASS sayısı):
```tsx
type HonestLabel = { tea?: { result: string }; coffee?: { result: string }; cherry?: { result: string }; ink?: { result: string } };

export function stainScore(label: HonestLabel | undefined): number {
  if (!label) return 0;
  return (["tea", "coffee", "cherry", "ink"] as const).filter((k) => label[k]?.result === "PASS").length;
}

export function StainBadge({ label }: { label?: HonestLabel }) {
  const score = stainScore(label);
  return (
    <span className="font-data inline-flex items-center gap-1 rounded-full border border-stroke bg-elevated px-2.5 py-1 text-xs text-cream"
      title={`Leke direnci: ${score}/4 test ÇIKAR sonuçlu`}>
      <span className="text-gold">●</span> LEKE {score}/4
    </span>
  );
}
```

- [ ] **Step 3: WaFab.tsx (WA-01…05, FLW-07 istisna tooltip)**

```tsx
"use client";
import { useEffect, useState } from "react";
import { HorseIcon } from "./HorseIcon";
import { buildWaLink } from "@/lib/wa";
import { track } from "@/lib/analytics";

export function WaFab({ number, message }: { number: string; message: string }) {
  const [tooltip, setTooltip] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("wa-tooltip-seen")) return;
    const t = setTimeout(() => setTooltip(true), 5000);
    return () => clearTimeout(t);
  }, []);
  const dismiss = () => { setTooltip(false); localStorage.setItem("wa-tooltip-seen", "1"); };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-md:bottom-4 max-md:right-4" style={{ bottom: "calc(1.5rem + var(--consent-offset, 0px))" }}>
      {tooltip && (
        <div role="status" className="card-premium absolute bottom-full right-0 mb-3 w-64 p-3 text-sm text-cream">
          Halı hakkında soru sor — 24 saatte yanıt sözü.
          <button onClick={dismiss} aria-label="Kapat" className="absolute right-2 top-1 text-muted hover:text-cream">×</button>
        </div>
      )}
      <a
        href={buildWaLink({ number, message, refCode: "FAB" })}
        target="_blank" rel="noopener noreferrer"
        aria-label="WhatsApp ile konuşma başlat"
        onClick={() => { dismiss(); track("whatsapp_click", { context: "fab" }); }}
        className="group flex size-14 items-center justify-center rounded-full border border-transparent max-md:size-13 [background:var(--grad-ember)_padding-box,var(--grad-border)_border-box] shadow-lg transition-transform duration-[var(--dur-micro)] [transition-timing-function:var(--ease-flow)] hover:-translate-y-1 motion-reduce:hover:translate-y-0"
      >
        <HorseIcon className="size-8 text-cream transition-transform duration-200 group-hover:rotate-[-6deg] motion-reduce:group-hover:rotate-0" />
      </a>
    </div>
  );
}
```

- [ ] **Step 4: stainScore birim testi** — `lib/__tests__` yerine `components/ui/StainBadge.test.tsx`:

```tsx
import { expect, test } from "vitest";
import { stainScore } from "./StainBadge";

test("4 PASS = 4", () => {
  const l = { tea: { result: "PASS" }, coffee: { result: "PASS" }, cherry: { result: "PASS" }, ink: { result: "PASS" } };
  expect(stainScore(l)).toBe(4);
});
test("PARTIAL/FAIL sayılmaz, undefined = 0", () => {
  expect(stainScore({ tea: { result: "PARTIAL" }, ink: { result: "FAIL" } })).toBe(0);
  expect(stainScore(undefined)).toBe(0);
});
```

```bash
npm test  # Beklenen: hepsi PASS
git add -A && git commit -m "feat: UI çekirdeği — Button, leke rozeti, at figürlü WA FAB"
```

---

### Task 10: Flow bileşenleri — ScrollReveal fallback, KilimProgress, lite YouTube

**Files:**
- Create: `components/flow/ScrollReveal.tsx`, `components/flow/KilimProgress.tsx`, `components/flow/CountUp.tsx`, `components/flow/LiteYouTube.tsx`

- [ ] **Step 1: ScrollReveal (FLW-04 IO fallback) + CountUp (FLW-03)**

`components/flow/ScrollReveal.tsx`:
```tsx
"use client";
import { useEffect, useRef } from "react";

export function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) { ref.current?.classList.add("reveal"); return; }
    ref.current?.classList.add("reveal-js");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
```

`components/flow/CountUp.tsx`:
```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(to); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1200, 1);
        setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="font-data tabular-nums">{val}{suffix}</span>;
}
```

- [ ] **Step 2: KilimProgress (FLW-05) — scroll progress, transform-only (FLW-06)**

```tsx
"use client";
import { useEffect, useRef } from "react";

export function KilimProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden">
      <div ref={ref} className="h-full w-full origin-left scale-x-0 will-change-transform"
        style={{
          background: "var(--grad-gold)",
          maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='4'%3E%3Cpath d='M0 4 L4 0 L8 4 L12 0 L16 4 Z' fill='black'/%3E%3C/svg%3E\")",
          maskRepeat: "repeat-x", maskSize: "16px 4px",
        }} />
    </div>
  );
}
```

- [ ] **Step 3: LiteYouTube (UD-02 facade — LCP'yi etkilemez)**

```tsx
"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";

export function LiteYouTube({ url, title }: { url: string; title: string }) {
  const [play, setPlay] = useState(false);
  const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
  if (!id) return null;
  if (play) return (
    <iframe className="aspect-video w-full rounded-xl" title={title} allow="autoplay; encrypted-media" allowFullScreen
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} />
  );
  return (
    <button onClick={() => { setPlay(true); track("label_video_play"); }}
      className="relative block aspect-video w-full overflow-hidden rounded-xl" aria-label={`${title} videosunu oynat`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} className="size-full object-cover" loading="lazy" />
      <span className="absolute inset-0 grid place-items-center bg-black/40">
        <span className="grid size-16 place-items-center rounded-full text-2xl text-cream [background:var(--grad-ember)]">▶</span>
      </span>
    </button>
  );
}
```

- [ ] **Step 4: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: flow bileşenleri — reveal, count-up, kilim progress, lite YouTube"
```

---

### Task 11: Blok render registry + blok komponentleri

**Files:**
- Create: `components/blocks/BlockRenderer.tsx`, `components/blocks/Hero.tsx`, `components/blocks/CommitmentGrid.tsx`, `components/blocks/ProductShowcase.tsx`, `components/blocks/Manifesto.tsx`, `components/blocks/PanoSummary.tsx`, `components/blocks/CalculatorCta.tsx`, `components/blocks/VideoBand.tsx`, `components/blocks/InstagramStrip.tsx`, `components/blocks/FaqAccordion.tsx`, `components/blocks/CtaBand.tsx`, `components/ProductCard.tsx`

- [ ] **Step 1: ProductCard (UL-03: görsel, ad, ölçüler, fiyat, rozet, mikro-CTA; FLW-01 view-transition-name)**

```tsx
import Image from "next/image";
import { Link } from "next-view-transitions";
import { urlFor } from "@/lib/image";
import { StainBadge } from "@/components/ui/StainBadge";
import { WaMicroCta } from "@/components/whatsapp/WaMicroCta";

export type ProductCardData = {
  title: string; slug: string; heroImage: { alt?: string } & object;
  sizeVariants: { size: string; priceTRY: number }[];
  honestLabel?: Parameters<typeof StainBadge>[0]["label"];
};

export function ProductCard({ p }: { p: ProductCardData }) {
  const minPrice = Math.min(...p.sizeVariants.map((v) => v.priceTRY));
  return (
    <article className="card-premium group overflow-hidden">
      <Link href={`/halilar/${p.slug}/`} className="block">
        <Image src={urlFor(p.heroImage).width(640).height(480).url()} alt={p.heroImage.alt ?? p.title}
          width={640} height={480} className="aspect-[4/3] w-full object-cover transition-transform duration-[var(--dur-element)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
          style={{ viewTransitionName: `product-${p.slug}` }} placeholder="empty" />
        <div className="space-y-2 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">{p.title}</h3>
            <StainBadge label={p.honestLabel} />
          </div>
          <p className="text-sm text-muted">{p.sizeVariants.map((v) => v.size).join(" · ")}</p>
          <p className="font-data bg-clip-text text-transparent [background-image:var(--grad-gold)]">{minPrice.toLocaleString("tr-TR")} ₺'den</p>
        </div>
      </Link>
      <div className="px-4 pb-4"><WaMicroCta productTitle={p.title} slug={p.slug} /></div>
    </article>
  );
}
```

`components/whatsapp/WaMicroCta.tsx`:
```tsx
"use client";
import { buildWaLink, fillTemplate } from "@/lib/wa";
import { track } from "@/lib/analytics";

export function WaMicroCta({ productTitle, slug, size, number, template }: {
  productTitle: string; slug: string; size?: string; number?: string; template?: string;
}) {
  const num = number ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? "";
  const msg = fillTemplate(template ?? "Merhaba, {urun} ({olcu}) hakkında bilgi almak istiyorum. {url}", {
    urun: productTitle, olcu: size ?? "ölçü seçilmedi", url: `https://tulparcarpet.com/halilar/${slug}/`,
  });
  return (
    <a href={buildWaLink({ number: num, message: msg, refCode: `UD-${slug}` })} target="_blank" rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { context: "product", product_slug: slug })}
      className="text-sm text-gold underline-offset-4 hover:underline">WhatsApp'tan Sor →</a>
  );
}
```

- [ ] **Step 2: Blok komponentleri** — her biri kendi dosyasında, `hidden` kontrolü registry'de. Temsili üçü (kalanları aynı kalıpla — section + ScrollReveal + token sınıfları — yaz):

`components/blocks/Hero.tsx`:
```tsx
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/lib/image";

export function Hero({ b }: { b: { variant: string; heading: string; subheading?: string; image?: { alt?: string } & object; primaryCtaLabel?: string; primaryCtaHref?: string } }) {
  return (
    <section className="hero-surface relative overflow-hidden px-6 py-32 max-md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="font-display text-5xl font-bold leading-tight max-md:text-3xl bg-clip-text text-transparent [background-image:var(--grad-gold)]">{b.heading}</h1>
          {b.subheading && <p className="text-lg text-muted">{b.subheading}</p>}
          <div className="flex gap-4">
            <Button href={b.primaryCtaHref ?? "/halilar/"}>{b.primaryCtaLabel ?? "Koleksiyonu Gör"}</Button>
            <Button href="#wa" variant="secondary">WhatsApp'tan Sor</Button>
          </div>
        </div>
        {b.variant === "gorselli" && b.image && (
          <Image src={urlFor(b.image).width(900).url()} alt={b.image.alt ?? ""} width={900} height={700}
            priority className="rounded-xl object-cover" />
        )}
      </div>
    </section>
  );
}
```

`components/blocks/PanoSummary.tsx` (AS-04 — sayaçlar GROQ'tan, CountUp ile):
```tsx
import { client } from "@/sanity/client";
import { PANO_STATS_QUERY } from "@/lib/queries";
import { CountUp } from "@/components/flow/CountUp";
import { Button } from "@/components/ui/Button";

export async function PanoSummary({ b }: { b: { heading: string } }) {
  const s = await client.fetch(PANO_STATS_QUERY, {}, { next: { revalidate: 3600, tags: ["complaint"] } });
  const items = [
    { label: "Son 12 ay şikayet", value: s.total },
    { label: "Cevaplanan", value: s.answered },
    { label: "Ort. yanıt (saat)", value: Math.round(s.avgResponseHours ?? 0) },
    { label: "İade", value: s.refunds },
  ];
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-6xl space-y-8 text-center">
        <h2 className="font-display text-3xl">{b.heading}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((i) => (
            <div key={i.label} className="card-premium p-6">
              <div className="text-4xl text-gold"><CountUp to={i.value} /></div>
              <div className="mt-2 text-sm text-muted">{i.label}</div>
            </div>
          ))}
        </div>
        <Button href="/acik-pano/" variant="secondary">Panonun tamamını gör — filtresiz</Button>
      </div>
    </section>
  );
}
```

`components/blocks/FaqAccordion.tsx` (DG-02 — native details, klavye erişilebilir):
```tsx
export function FaqAccordion({ b }: { b: { items: { question: string; answer: string }[] } }) {
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-3xl space-y-3">
        {b.items.map((it) => (
          <details key={it.question} className="card-premium group p-5">
            <summary className="cursor-pointer font-display text-lg marker:content-none">{it.question}</summary>
            <p className="mt-3 text-muted">{it.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

Aynı kalıpla yaz: `CommitmentGrid` (4 kart, her biri `href`'e link — AS-02), `ProductShowcase` (`products[]` → `ProductCard` ızgarası, AS-03), `Manifesto` (`@portabletext/react` ile body; `npm i @portabletext/react`), `CalculatorCta` (heading + Button `/maliyet-hesaplayici/`), `VideoBand` (`LiteYouTube`), `InstagramStrip` (posts ızgarası, her görsel permalink'e dış link), `CtaBand` (heading + Button, `--grad-ember` zemin şerit).

- [ ] **Step 3: BlockRenderer.tsx — registry + hidden filtresi (ADM-02)**

```tsx
import { Hero } from "./Hero";
import { CommitmentGrid } from "./CommitmentGrid";
import { ProductShowcase } from "./ProductShowcase";
import { Manifesto } from "./Manifesto";
import { PanoSummary } from "./PanoSummary";
import { CalculatorCta } from "./CalculatorCta";
import { VideoBand } from "./VideoBand";
import { InstagramStrip } from "./InstagramStrip";
import { FaqAccordion } from "./FaqAccordion";
import { CtaBand } from "./CtaBand";
import { ScrollReveal } from "@/components/flow/ScrollReveal";

const registry: Record<string, React.ComponentType<{ b: never }>> = {
  heroBlock: Hero, commitmentGridBlock: CommitmentGrid, productShowcaseBlock: ProductShowcase,
  manifestoBlock: Manifesto, panoSummaryBlock: PanoSummary, calculatorCtaBlock: CalculatorCta,
  videoBandBlock: VideoBand, instagramStripBlock: InstagramStrip, faqAccordionBlock: FaqAccordion,
  ctaBandBlock: CtaBand,
};

export function BlockRenderer({ blocks }: { blocks: ({ _type: string; _key: string; hidden?: boolean } & object)[] }) {
  return (
    <>
      {(blocks ?? []).filter((b) => !b.hidden).map((b, i) => {
        const Cmp = registry[b._type];
        if (!Cmp) return null;
        const node = <Cmp key={b._key} b={b as never} />;
        return i === 0 ? node : <ScrollReveal key={b._key}>{node}</ScrollReveal>;
      })}
    </>
  );
}
```

- [ ] **Step 4: Build, test, commit**

```bash
npm test && npm run build
git add -A && git commit -m "feat: 10 blok komponenti + registry + ürün kartı"
```

---

### Task 12: Site layout — header, footer (FLW-08 bağlamsal yönlendirme), FAB montajı

**Files:**
- Create: `app/(site)/layout.tsx`, `components/SiteHeader.tsx`, `components/SiteFooter.tsx`
- Modify: mevcut `app/page.tsx`'i `app/(site)/page.tsx`'e taşı (Task 13'te yeniden yazılacak)

- [ ] **Step 1: SiteHeader + SiteFooter**

`components/SiteHeader.tsx`:
```tsx
import { Link } from "next-view-transitions";
import Image from "next/image";

const nav = [
  { href: "/halilar/", label: "Halılar" },
  { href: "/durust-etiket/", label: "Dürüst Etiket" },
  { href: "/taahhutler/", label: "Taahhütler" },
  { href: "/acik-pano/", label: "Açık Pano" },
  { href: "/maliyet-hesaplayici/", label: "Hesaplayıcı" },
  { href: "/blog/", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stroke bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Tulpar Carpet ana sayfa">
          <Image src="/logo-light.svg" alt="Tulpar Carpet" width={160} height={27} priority />
        </Link>
        <nav className="flex gap-6 text-sm text-muted max-md:hidden">
          {nav.map((n) => <Link key={n.href} href={n.href} className="transition-colors duration-[var(--dur-micro)] hover:text-cream">{n.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
```

(`assets/logo/tulparcarpet15.svg` → `public/logo-light.svg` olarak kopyala; koyu zemin için beyaz varyant zaten bu. Mobil menü: aynı nav'ı `<details>` tabanlı açılır panelde tekrarla — JS'siz, erişilebilir.)

`components/SiteFooter.tsx` (FLW-08: ölü uç yok — footer her sayfada hesaplayıcı + WA yönlendirmesi taşır):
```tsx
import { Link } from "next-view-transitions";

export function SiteFooter() {
  return (
    <footer className="border-t border-stroke px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-lg">Tulpar Carpet</p>
          <p className="mt-2 text-sm text-muted">Mağazada gördüğün, evine gelen halıdır. Kayseri'de üretilir.</p>
        </div>
        <nav className="space-y-2 text-sm text-muted">
          {["/halilar/", "/durust-etiket/", "/acik-pano/", "/sss/", "/iletisim/"].map((h) => (
            <Link key={h} href={h} className="block hover:text-cream">{h.replaceAll("/", "").replaceAll("-", " ") || "Ana sayfa"}</Link>
          ))}
        </nav>
        <nav className="space-y-2 text-sm text-muted">
          {["/kvkk/", "/cerez-politikasi/", "/iade-kosullari/", "/hakkimizda/"].map((h) => (
            <Link key={h} href={h} className="block hover:text-cream">{h.replaceAll("/", "").replaceAll("-", " ")}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: (site) layout — header, footer, KilimProgress, FAB (ayarlardan numara)**

`app/(site)/layout.tsx`:
```tsx
import { client } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/lib/queries";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WaFab } from "@/components/whatsapp/WaFab";
import { KilimProgress } from "@/components/flow/KilimProgress";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600, tags: ["siteSettings"] } });
  return (
    <>
      <KilimProgress />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WaFab number={settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? ""}
        message={settings?.waMessageGeneral ?? "Merhaba, tulparcarpet.com'dan yazıyorum."} />
    </>
  );
}
```

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: site layout — header/footer, kilim progress, WA FAB montajı"
```

---

### Task 13: Ana sayfa + page-builder sayfaları

**Files:**
- Create: `app/(site)/page.tsx`, `app/(site)/taahhutler/page.tsx`

- [ ] **Step 1: Ana sayfa — `page` dokümanından bloklar (ADM-01)**

`app/(site)/page.tsx`:
```tsx
import { client } from "@/sanity/client";
import { PAGE_QUERY } from "@/lib/queries";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.fetch(PAGE_QUERY, { slug: "ana-sayfa" });
  return { title: page?.seo?.metaTitle, description: page?.seo?.metaDescription, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  const page = await client.fetch(PAGE_QUERY, { slug: "ana-sayfa" }, { next: { revalidate: 3600, tags: ["page"] } });
  return <BlockRenderer blocks={page?.blocks ?? []} />;
}
```

- [ ] **Step 2: /taahhutler/ aynı kalıpla** (`slug: "taahhutler"`); dosyayı kopyala, slug ve canonical değiştir.

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: ana sayfa ve taahhütler — blok tabanlı render"
```

---

### Task 14: Ürün listesi /halilar/ (UL-01…04)

**Files:**
- Create: `app/(site)/halilar/page.tsx`

- [ ] **Step 1: Liste sayfası — filtre query'leri, noindex kuralı, sayfalama**

```tsx
import { client } from "@/sanity/client";
import { PRODUCTS_QUERY } from "@/lib/queries";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { stainScore } from "@/components/ui/StainBadge";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;
const PER_PAGE = 12;

type Search = { boyut?: string; oda?: string; sirala?: string; sayfa?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = Boolean(sp.boyut || sp.oda || sp.sirala);
  return {
    title: "Halılar — Dürüst Etiketli Koleksiyon",
    description: "Leke testi yapılmış, parti bazlı ölçülmüş halılar. Mağazada gördüğün, evine gelen halıdır.",
    alternates: { canonical: "/halilar/" },                       // UL-01: filtrelide canonical ana liste
    robots: filtered ? { index: false, follow: true } : undefined, // UL-01: noindex,follow
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  let products: ProductCardData[] = await client.fetch(PRODUCTS_QUERY, {}, { next: { revalidate: 3600, tags: ["product"] } });
  if (sp.boyut) products = products.filter((p) => p.sizeVariants.some((v) => v.size === sp.boyut));
  if (sp.oda) products = products.filter((p) => (p as ProductCardData & { roomTags?: string[] }).roomTags?.includes(sp.oda!));
  if (sp.sirala === "fiyat") products.sort((a, b) => Math.min(...a.sizeVariants.map((v) => v.priceTRY)) - Math.min(...b.sizeVariants.map((v) => v.priceTRY)));
  if (sp.sirala === "leke") products.sort((a, b) => stainScore(b.honestLabel) - stainScore(a.honestLabel));
  const page = Math.max(1, Number(sp.sayfa ?? 1));
  const slice = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-16">
      <h1 className="font-display text-4xl">Halılar</h1>
      <div className="flex flex-wrap gap-3 text-sm">
        {[["sirala", "fiyat", "Fiyata göre"], ["sirala", "leke", "Leke direncine göre"], ["oda", "salon", "Salon"], ["oda", "yatak-odasi", "Yatak Odası"]].map(([k, v, label]) => (
          <Link key={`${k}${v}`} href={`/halilar/?${k}=${v}`} className="rounded-full border border-stroke px-4 py-1.5 text-muted hover:border-gold hover:text-cream">{label}</Link>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {slice.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
      {products.length > PER_PAGE && (
        <nav className="flex gap-2" aria-label="Sayfalama">
          {Array.from({ length: Math.ceil(products.length / PER_PAGE) }, (_, i) => (
            <Link key={i} href={i === 0 ? "/halilar/" : `/halilar/?sayfa=${i + 1}`}
              className={`rounded px-3 py-1.5 ${page === i + 1 ? "text-gold" : "text-muted"}`}>{i + 1}</Link>
          ))}
        </nav>
      )}
    </div>
  );
}
```

(UL-04: sonsuz kaydırma yok, `?sayfa=N` linkleri. Ürün sayısı Faz 1'de küçük olduğundan client-side filtre yerine fetch-sonrası filtre kabul edilebilir; ISR cache tek sorguyu paylaşır.)

- [ ] **Step 2: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: /halilar/ — filtre, sıralama, SEO-dostu sayfalama"
```

---

### Task 15: Ürün detay sayfası (UD-01…07)

**Files:**
- Create: `app/(site)/halilar/[slug]/page.tsx`, `components/HonestLabelCard.tsx`, `components/MeasureSlip.tsx`

- [ ] **Step 1: HonestLabelCard (UD-01 — mono font, TAS-06)**

```tsx
const RESULT_TR = { PASS: "ÇIKAR", PARTIAL: "KISMEN", FAIL: "ÇIKMAZ" } as const;
const RESULT_CLS = { PASS: "text-success", PARTIAL: "text-gold", FAIL: "text-ember" } as const;
const TEST_TR = { tea: "Çay", coffee: "Kahve", cherry: "Vişne", ink: "Mürekkep" } as const;

type Entry = { result: keyof typeof RESULT_TR; methodNote?: string };

export function HonestLabelCard({ label, pileHeightMm, batchNo, sheddingScore, washingInstructions }: {
  label: Record<keyof typeof TEST_TR, Entry>; pileHeightMm: number; batchNo: string;
  sheddingScore: string; washingInstructions: string;
}) {
  return (
    <section aria-labelledby="durust-etiket" className="card-premium font-data p-6 text-sm">
      <h2 id="durust-etiket" className="font-display mb-4 text-xl">DÜRÜST ETİKET <span className="text-muted">— Parti {batchNo}</span></h2>
      <dl className="space-y-2">
        <div className="flex justify-between"><dt className="text-muted">Hav yüksekliği (ölçülmüş)</dt><dd>{pileHeightMm} mm</dd></div>
        {(Object.keys(TEST_TR) as (keyof typeof TEST_TR)[]).map((k) => (
          <div key={k} className="flex justify-between">
            <dt className="text-muted">{TEST_TR[k]} lekesi</dt>
            <dd className={RESULT_CLS[label[k].result]} title={label[k].methodNote}>{RESULT_TR[label[k].result]}</dd>
          </div>
        ))}
        <div className="flex justify-between"><dt className="text-muted">Tüy dökme</dt><dd>{sheddingScore}</dd></div>
      </dl>
      <p className="mt-4 border-t border-stroke pt-3 text-muted">Yıkama: {washingInstructions}</p>
    </section>
  );
}
```

`components/MeasureSlip.tsx` (UD-05):
```tsx
export function MeasureSlip({ batchNo, pileHeightMm }: { batchNo: string; pileHeightMm: number }) {
  return (
    <figure className="font-data rounded-lg border border-dashed border-stroke bg-elevated p-4 text-xs text-muted">
      <figcaption className="mb-2 text-cream">Sevkiyat öncesi size gönderilecek ölçüm fişi örneği:</figcaption>
      <pre>{`TULPAR CARPET / ÖLÇÜM FİŞİ
Parti: ${batchNo}   Hav: ${pileHeightMm} mm
Ölçen: ____   Tarih: __/__/____
Fotoğraf: sevkiyat e-postasına eklenir`}</pre>
    </figure>
  );
}
```

- [ ] **Step 2: Detay sayfası**

`app/(site)/halilar/[slug]/page.tsx`:
```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/client";
import { PRODUCT_QUERY, RELATED_QUERY, SLUGS_QUERY, SETTINGS_QUERY } from "@/lib/queries";
import { urlFor } from "@/lib/image";
import { HonestLabelCard } from "@/components/HonestLabelCard";
import { MeasureSlip } from "@/components/MeasureSlip";
import { LiteYouTube } from "@/components/flow/LiteYouTube";
import { ProductCard } from "@/components/ProductCard";
import { WaMicroCta } from "@/components/whatsapp/WaMicroCta";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(SLUGS_QUERY("product"));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await client.fetch(PRODUCT_QUERY, { slug });
  if (!p) return {};
  return {
    title: p.seo.metaTitle, description: p.seo.metaDescription,
    alternates: { canonical: `/halilar/${slug}/` },
    openGraph: { images: [`/api/og?slug=${slug}`] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([
    client.fetch(PRODUCT_QUERY, { slug }, { next: { revalidate: 3600, tags: ["product"] } }),
    client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600 } }),
  ]);
  if (!p) notFound();
  const related = await client.fetch(RELATED_QUERY, { slug, tea: p.honestLabel.tea.result });

  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Ana sayfa", url: "https://tulparcarpet.com/" },
        { name: "Halılar", url: "https://tulparcarpet.com/halilar/" },
        { name: p.title, url: `https://tulparcarpet.com/halilar/${slug}/` },
      ])) }} />
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-4">
          <Image src={urlFor(p.heroImage).width(1200).url()} alt={p.heroImage.alt} width={1200} height={900}
            priority className="rounded-xl" style={{ viewTransitionName: `product-${slug}` }} />
          <div className="grid grid-cols-4 gap-2">
            {p.images.map((img: { alt: string } & object, i: number) => (
              <Image key={i} src={urlFor(img).width(300).height(300).url()} alt={(img as { alt: string }).alt}
                width={300} height={300} className="rounded-lg object-cover" loading="lazy" />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h1 className="font-display text-4xl">{p.title}</h1>
          <div className="flex flex-wrap gap-2">
            {p.sizeVariants.map((v: { size: string; priceTRY: number }) => (
              <span key={v.size} className="font-data rounded border border-stroke px-3 py-1.5 text-sm">
                {v.size} — {v.priceTRY.toLocaleString("tr-TR")} ₺</span>
            ))}
          </div>
          <HonestLabelCard label={p.honestLabel} pileHeightMm={p.pileHeightMm} batchNo={p.batchNo}
            sheddingScore={p.sheddingScore} washingInstructions={p.washingInstructions} />
          <section className="rounded-lg border border-ember/40 bg-elevated p-5">
            <h2 className="font-display text-lg text-ember">Bu halı kimler için değil</h2>
            <p className="mt-2 text-muted">{p.notFor}</p>
          </section>
          <MeasureSlip batchNo={p.batchNo} pileHeightMm={p.pileHeightMm} />
          <WaMicroCta productTitle={p.title} slug={slug} number={settings?.whatsappNumber} template={settings?.waMessageProduct} />
        </div>
      </div>
      <article className="prose prose-invert max-w-3xl text-muted">{p.description}</article>
      {p.testVideoUrl && <LiteYouTube url={p.testVideoUrl} title={`${p.title} leke testi`} />}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-display text-2xl">Aynı leke skorundaki diğer halılar</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r: Parameters<typeof ProductCard>[0]["p"]) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
```

(`lib/jsonld.ts` Task 19'da yazılır — bu task ile aynı sub-agent paketinde değilse geçici stub: `export const productJsonLd = (p:unknown)=>({}); export const breadcrumbJsonLd = (i:unknown)=>({});` koyup Task 19'da değiştir.)

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: ürün detay — Dürüst Etiket, notFor, galeri, ölçüm fişi, video, çapraz satış"
```

---

### Task 16: Açık Pano sayfası (AP-01…04)

**Files:**
- Create: `app/(site)/acik-pano/page.tsx`, `components/PanoViewTracker.tsx`

- [ ] **Step 1: Sayfa**

```tsx
import { client } from "@/sanity/client";
import { COMPLAINTS_QUERY, PANO_STATS_QUERY } from "@/lib/queries";
import { CountUp } from "@/components/flow/CountUp";
import { PanoViewTracker } from "@/components/PanoViewTracker";
import type { Metadata } from "next";

export const revalidate = 3600; // AP-04

export const metadata: Metadata = {
  title: "Açık Şikayet Panosu — Filtresiz, Silinmez",
  description: "Tulpar Carpet'e gelen her şikayet, cevabı ve çözüm süresiyle burada. Silme yok, filtre yok.",
  alternates: { canonical: "/acik-pano/" },
};

const STATUS_TR = { OPEN: "AÇIK", SOLVED: "ÇÖZÜLDÜ", REFUND: "İADE" } as const;
const STATUS_CLS = { OPEN: "text-gold", SOLVED: "text-success", REFUND: "text-ember" } as const;

export default async function PanoPage() {
  const [complaints, s] = await Promise.all([
    client.fetch(COMPLAINTS_QUERY, {}, { next: { revalidate: 3600, tags: ["complaint"] } }),
    client.fetch(PANO_STATS_QUERY, {}, { next: { revalidate: 3600, tags: ["complaint"] } }),
  ]);
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <PanoViewTracker />
      <header className="space-y-3">
        <h1 className="font-display text-4xl">Açık Şikayet Panosu</h1>
        <p className="text-muted">Bu panoda silme yoktur, filtre yoktur. Her kayıt cevabı ve süresiyle durur.</p>
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Son 12 ay", s.total], ["Cevaplanan", s.answered], ["Ort. yanıt (saat)", Math.round(s.avgResponseHours ?? 0)], ["İade", s.refunds]].map(([l, v]) => (
          <div key={l as string} className="card-premium p-5 text-center">
            <div className="text-3xl text-gold"><CountUp to={v as number} /></div>
            <div className="mt-1 text-xs text-muted">{l}</div>
          </div>
        ))}
      </div>
      <ol className="space-y-4">
        {complaints.map((c: { ticketNo: number; date: string; status: keyof typeof STATUS_TR; customerText: string; responseText?: string; responseAt?: string }) => (
          <li key={c.ticketNo} className="card-premium p-5">
            <div className="font-data flex justify-between text-xs text-muted">
              <span>#{c.ticketNo} · {new Date(c.date).toLocaleDateString("tr-TR")}</span>
              <span className={STATUS_CLS[c.status]}>{STATUS_TR[c.status]}</span>
            </div>
            <p className="mt-3">{c.customerText}</p>
            {c.responseText && (
              <div className="mt-3 border-l-2 border-gold pl-4 text-sm text-muted">
                <p className="font-data text-xs text-gold">TULPAR CEVABI{c.responseAt && ` — ${Math.round((+new Date(c.responseAt) - +new Date(c.date)) / 36e5)} saat içinde`}</p>
                <p className="mt-1">{c.responseText}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
```

`components/PanoViewTracker.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
export function PanoViewTracker() { useEffect(() => track("pano_viewed"), []); return null; }
```

- [ ] **Step 2: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: Açık Pano — sayaçlar, kayıt listesi, schema'sız (PRD 7.2)"
```

---

### Task 17: Maliyet Hesaplayıcısı (MH-01…04) — TDD

**Files:**
- Create: `lib/calc.ts`, `lib/__tests__/calc.test.ts`, `app/(site)/maliyet-hesaplayici/page.tsx`, `components/CostCalculator.tsx`

- [ ] **Step 1: Failing test**

`lib/__tests__/calc.test.ts`:
```ts
import { expect, test } from "vitest";
import { fiveYearCost } from "@/lib/calc";

test("5 yıllık maliyet: fiyat + yıl×yıkama×bedel", () => {
  // rakip: 5000₺ halı, yılda 2 yıkama × 900₺ → 5000 + 5*2*900 = 14000
  // tulpar: 8000₺ halı, evde yıkanabilir → 8000
  const r = fiveYearCost({ rivalPrice: 5000, tulparPrice: 8000, washesPerYear: 2, washPrice: 900 });
  expect(r).toEqual({ rivalTotal: 14000, tulparTotal: 8000, savings: 6000 });
});
```

- [ ] **Step 2: FAIL doğrula** — `npm test` → "fiveYearCost is not defined".

- [ ] **Step 3: Implementasyon**

`lib/calc.ts`:
```ts
export function fiveYearCost(i: { rivalPrice: number; tulparPrice: number; washesPerYear: number; washPrice: number }) {
  const rivalTotal = i.rivalPrice + 5 * i.washesPerYear * i.washPrice;
  const tulparTotal = i.tulparPrice;
  return { rivalTotal, tulparTotal, savings: rivalTotal - tulparTotal };
}
```

`npm test` → PASS.

- [ ] **Step 4: CostCalculator.tsx (client, ≤15KB ek JS — bağımlılık yok) + sayfa**

```tsx
"use client";
import { useState } from "react";
import { fiveYearCost } from "@/lib/calc";
import { buildWaLink, fillTemplate } from "@/lib/wa";
import { track } from "@/lib/analytics";

export function CostCalculator({ defaults, waNumber, waTemplate }: {
  defaults: { washesPerYear: number; washPrice: number }; waNumber: string; waTemplate: string;
}) {
  const [rivalPrice, setRivalPrice] = useState(5000);
  const [tulparPrice, setTulparPrice] = useState(8000);
  const [washes, setWashes] = useState(defaults.washesPerYear);
  const [washPrice, setWashPrice] = useState(defaults.washPrice);
  const r = fiveYearCost({ rivalPrice, tulparPrice, washesPerYear: washes, washPrice });
  const fields = [
    ["Rakip halı fiyatı (₺)", rivalPrice, setRivalPrice],
    ["Tulpar halı fiyatı (₺)", tulparPrice, setTulparPrice],
    ["Yıllık yıkatma sayısı", washes, setWashes],
    ["Sefer başı yıkama bedeli (₺)", washPrice, setWashPrice],
  ] as const;
  return (
    <div className="card-premium space-y-6 p-6">
      {fields.map(([label, val, set]) => (
        <label key={label} className="block text-sm">
          <span className="text-muted">{label}</span>
          <input type="number" value={val} min={0}
            onChange={(e) => { set(Number(e.target.value)); track("calculator_used"); }}
            className="font-data mt-1 w-full rounded border border-stroke bg-base px-3 py-2 text-cream" />
        </label>
      ))}
      <div className="font-data space-y-1 border-t border-stroke pt-4">
        <p className="flex justify-between text-muted"><span>Rakip 5 yıllık toplam</span><span>{r.rivalTotal.toLocaleString("tr-TR")} ₺</span></p>
        <p className="flex justify-between text-muted"><span>Tulpar 5 yıllık toplam</span><span>{r.tulparTotal.toLocaleString("tr-TR")} ₺</span></p>
        <p className="flex justify-between text-xl text-gold"><span>Fark</span><span>{r.savings.toLocaleString("tr-TR")} ₺</span></p>
      </div>
      <a href={buildWaLink({ number: waNumber, message: fillTemplate(waTemplate, { fark: r.savings.toLocaleString("tr-TR") }), refCode: "MH" })}
        target="_blank" rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { context: "calculator" })}
        className="block rounded-lg px-6 py-3 text-center font-semibold text-cream [background:var(--grad-ember)]">
        Sonucu WhatsApp'ta paylaş
      </a>
    </div>
  );
}
```

`app/(site)/maliyet-hesaplayici/page.tsx` — statik kabuk; `SETTINGS_QUERY`'den `calcDefaultWashCount/Price` + `waMessageCalculator` çek, `<CostCalculator …/>` render et; altına MH-04 gereği ≥800 kelimelik SEO metnini Sanity `page` dokümanından (`slug: "maliyet-hesaplayici"`) `manifestoBlock` olarak `BlockRenderer` ile bas. Metadata: title "Halı Yıkama Maliyeti Hesaplayıcı — 5 Yıllık Gerçek Maliyet", canonical `/maliyet-hesaplayici/`.

- [ ] **Step 5: Test + build, commit**

```bash
npm test && npm run build
git add -A && git commit -m "feat: 5 yıllık maliyet hesaplayıcısı (TDD) + WA paylaşımı"
```

---

### Task 18: Statik içerik sayfaları + Blog

**Files:**
- Create: `app/(site)/durust-etiket/page.tsx`, `app/(site)/hakkimizda/page.tsx`, `app/(site)/sss/page.tsx`, `app/(site)/iletisim/page.tsx`, `app/(site)/kvkk/page.tsx`, `app/(site)/cerez-politikasi/page.tsx`, `app/(site)/iade-kosullari/page.tsx`, `app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx`

- [ ] **Step 1: Page-builder tabanlı sayfalar** — `/durust-etiket/`, `/hakkimizda/`, `/kvkk/`, `/cerez-politikasi/`, `/iade-kosullari/` Task 13'teki ana sayfa kalıbının kopyasıdır (slug değişir; her biri Sanity `page` dokümanından beslenir; hukuk metinleri CMS'den — AN-01). `/hakkimizda/` ayrıca `localBusinessJsonLd()` (Task 19) script'i basar.

- [ ] **Step 2: /sss/** — `page` dokümanındaki `faqAccordionBlock`'u render eder + `faqJsonLd(items)` script (DG-02). `/iletisim/` — WA linki, e-posta, Kayseri adresi + lazy Google Maps iframe (`loading="lazy"`).

- [ ] **Step 3: Blog liste + detay**

`app/(site)/blog/[slug]/page.tsx` ürün detay kalıbıyla: `POST_QUERY`, `@portabletext/react` body, `articleJsonLd(post)` + `breadcrumbJsonLd`, `post.videoUrl` varsa `LiteYouTube` + `videoJsonLd` (SEO-15), `faqItems` varsa `faqJsonLd`, altda "ilgili yazılar" (`POSTS_QUERY`'den aynı kategori, 3 adet — SEO-14). Liste sayfası `POSTS_QUERY` ızgarası.

- [ ] **Step 4: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: statik sayfalar (durust-etiket, sss, iletisim, hukuk) + blog"
```

---

### Task 19: SEO katmanı — JSON-LD, sitemap, robots, OG görseli

**Files:**
- Create: `lib/jsonld.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/api/og/route.tsx`
- Modify: `app/(site)/halilar/[slug]/page.tsx` (Task 15 stub'ı gerçek import'la değişir)

- [ ] **Step 1: jsonld.ts (PRD 7.2 tablosu)**

```ts
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

export const productJsonLd = (p: { title: string; slug: string; description: string; sizeVariants: { priceTRY: number }[]; seo: { metaDescription: string } }) => ({
  "@context": "https://schema.org", "@type": "Product",
  name: p.title, description: p.seo.metaDescription, url: `${BASE}/halilar/${p.slug}/`,
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

export const articleJsonLd = (p: { title: string; slug: string; excerpt: string; publishedAt: string; updatedAt?: string; author?: string }) => ({
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
```

`organizationJsonLd` + `websiteJsonLd` script'lerini `app/(site)/layout.tsx`'e ekle (tüm site — PRD 7.2).

- [ ] **Step 2: sitemap.ts + robots.ts (SEO-02)**

`app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SLUGS_QUERY } from "@/lib/queries";

const BASE = "https://tulparcarpet.com";
const statics = ["", "halilar/", "durust-etiket/", "taahhutler/", "acik-pano/", "maliyet-hesaplayici/", "hakkimizda/", "blog/", "iletisim/", "sss/", "kvkk/", "cerez-politikasi/", "iade-kosullari/"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    client.fetch<string[]>(SLUGS_QUERY("product")),
    client.fetch<string[]>(SLUGS_QUERY("blogPost")),
  ]);
  return [
    ...statics.map((p) => ({ url: `${BASE}/${p}`, changeFrequency: "weekly" as const })),
    ...products.map((s) => ({ url: `${BASE}/halilar/${s}/`, changeFrequency: "weekly" as const })),
    ...posts.map((s) => ({ url: `${BASE}/blog/${s}/`, changeFrequency: "monthly" as const })),
  ];
}
```

`app/robots.ts`:
```ts
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] }],
    sitemap: "https://tulparcarpet.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Dinamik OG (SEO-07)**

`app/api/og/route.tsx`:
```tsx
import { ImageResponse } from "next/og";
import { client } from "@/sanity/client";
import { PRODUCT_QUERY } from "@/lib/queries";
import { urlFor } from "@/lib/image";
import { stainScore } from "@/components/ui/StainBadge";

export const runtime = "edge";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  const p = slug ? await client.fetch(PRODUCT_QUERY, { slug }) : null;
  const minPrice = p ? Math.min(...p.sizeVariants.map((v: { priceTRY: number }) => v.priceTRY)) : null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0E1322", color: "#F1EAD9", padding: 60 }}>
        {p && <img src={urlFor(p.heroImage).width(500).height(510).url()} width={500} height={510} style={{ borderRadius: 16, objectFit: "cover" }} />}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 48, gap: 16 }}>
          <div style={{ fontSize: 28, color: "#D9A441" }}>TULPAR CARPET</div>
          <div style={{ fontSize: 52, fontWeight: 700 }}>{p?.title ?? "Mağazada gördüğün, evine gelen halıdır."}</div>
          {p && <div style={{ fontSize: 32, color: "#D9A441" }}>{minPrice?.toLocaleString("tr-TR")} ₺'den · LEKE {stainScore(p.honestLabel)}/4</div>}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

- [ ] **Step 4: Task 15'teki jsonld stub'ını sil, gerçek import'u bağla. Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: SEO katmanı — JSON-LD, sitemap, robots, dinamik OG görseli"
```

---

### Task 20: Consent + GA4 + Meta Pixel (AN-01…02, KVKK)

**Files:**
- Create: `components/ConsentBanner.tsx`, `components/AnalyticsScripts.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: ConsentBanner — Consent Mode v2; onaysız pazarlama çerezi düşmez**

```tsx
"use client";
import { useEffect, useState } from "react";

export function ConsentBanner({ onConsent }: { onConsent: (granted: boolean) => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("consent");
    if (saved === null) { setVisible(true); document.documentElement.style.setProperty("--consent-offset", "88px"); }
    else onConsent(saved === "granted");
  }, [onConsent]);
  const decide = (granted: boolean) => {
    localStorage.setItem("consent", granted ? "granted" : "denied");
    document.documentElement.style.setProperty("--consent-offset", "0px"); // WA-01 FAB ofseti
    setVisible(false);
    onConsent(granted);
  };
  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Çerez tercihi" className="card-premium fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl p-5 text-sm">
      <p className="text-muted">Deneyimi ölçmek için çerez kullanıyoruz. Pazarlama çerezleri yalnızca onayınızla çalışır.
        Ayrıntı: <a href="/cerez-politikasi/" className="text-gold underline">Çerez Politikası</a></p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => decide(true)} className="rounded px-5 py-2 font-semibold text-cream [background:var(--grad-ember)]">Kabul et</button>
        <button onClick={() => decide(false)} className="rounded border border-stroke px-5 py-2 text-muted">Reddet</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: AnalyticsScripts — consent sonrası yükleme (5.4: ≤2 üçüncü parti, afterInteractive)**

```tsx
"use client";
import Script from "next/script";
import { useCallback, useState } from "react";
import { ConsentBanner } from "./ConsentBanner";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function AnalyticsScripts() {
  const [granted, setGranted] = useState(false);
  const onConsent = useCallback((g: boolean) => setGranted(g), []);
  return (
    <>
      <ConsentBanner onConsent={onConsent} />
      {granted && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}
      {granted && PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
          s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}'); fbq('track', 'PageView');
        `}</Script>
      )}
    </>
  );
}
```

`app/layout.tsx` body sonuna `<AnalyticsScripts />` ekle. `.env.local.example`'a `NEXT_PUBLIC_GA_ID=`, `NEXT_PUBLIC_META_PIXEL_ID=` ekle.

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: KVKK consent banner + consent-gated GA4 ve Meta Pixel"
```

---

### Task 21: Revalidate webhook + draft mode (ADM-05/08)

**Files:**
- Create: `app/api/revalidate/route.ts`, `app/api/draft-mode/enable/route.ts`

- [ ] **Step 1: Webhook — tag bazlı revalidate**

`app/api/revalidate/route.ts`:
```ts
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<{ _type: string }>(req, process.env.SANITY_REVALIDATE_SECRET);
  if (!isValidSignature) return NextResponse.json({ ok: false }, { status: 401 });
  if (body?._type) revalidateTag(body._type);
  return NextResponse.json({ ok: true, revalidated: body?._type });
}
```

(Sanity yönetiminde webhook: URL `https://tulparcarpet.com/api/revalidate`, secret env ile aynı, projection `{_type}` — README'ye not düş.)

- [ ] **Step 2: Draft mode (Presentation canlı önizleme ön şartı)**

`app/api/draft-mode/enable/route.ts`:
```ts
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
```

- [ ] **Step 3: Build, commit**

```bash
npm run build
git add -A && git commit -m "feat: Sanity webhook revalidate + draft mode (canlı önizleme)"
```

---

### Task 22: Hata sayfaları + tohum içerik + README

**Files:**
- Create: `app/not-found.tsx`, `app/(site)/error.tsx`, `scripts/seed.ts`, `README.md`

- [ ] **Step 1: Markalı 404/500**

`app/not-found.tsx`:
```tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="hero-surface grid min-h-screen place-items-center px-6 text-center">
      <div className="space-y-4">
        <p className="font-data text-gold">404</p>
        <h1 className="font-display text-3xl text-cream">Bu halının deseni burada yok.</h1>
        <Link href="/halilar/" className="inline-block rounded-lg px-6 py-3 font-semibold text-cream [background:var(--grad-ember)]">Koleksiyona dön</Link>
      </div>
    </div>
  );
}
```

`app/(site)/error.tsx` aynı kalıp, `"use client"` + `reset` butonu ile ("Tekrar dene").

- [ ] **Step 2: seed.ts — 2 örnek ürün, 6 şikayet, ana sayfa blokları, ayarlar, 15 SSS'li sss sayfası** (Sanity write token ile `client.createIfNotExists`; örnek ürün: "Bozkır", slug `bozkir-160x230`, 250+ kelime açıklama, 4 leke testi, `notFor` dolu). Çalıştırma: `npx tsx scripts/seed.ts`. Görseller placeholder olarak `assets/`ten yüklenir; gerçek çekimler marka sahibi bağımlılığıdır (PRD 11.3).

- [ ] **Step 3: README — kurulum, env değişkenleri, webhook kurulumu, içerik girişi el kitabı iskeleti (ürün ekleme, pano kaydı, blok düzenleme adımları)**

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: hata sayfaları, tohum içerik scripti, README/el kitabı"
```

---

### Task 23: CI — lint, test, build, Lighthouse eşikleri (5.4, FLW-10)

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`

- [ ] **Step 1: lighthouserc.json**

```json
{
  "ci": {
    "collect": { "startServerCommand": "npm start", "url": ["http://localhost:3000/"], "numberOfRuns": 1 },
    "assert": { "assertions": {
      "categories:performance": ["error", { "minScore": 0.9 }],
      "categories:seo": ["error", { "minScore": 0.95 }],
      "categories:accessibility": ["error", { "minScore": 0.95 }],
      "categories:best-practices": ["error", { "minScore": 0.95 }]
    }}
  }
}
```

- [ ] **Step 2: ci.yml**

```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
      - run: npx @lhci/cli autorun
        env:
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
```

- [ ] **Step 3: Yerelde doğrula, commit**

```bash
npm run lint && npm test && npm run build
git add -A && git commit -m "chore: CI — lint/test/build + Lighthouse eşikleri (Perf≥90 SEO≥95 A11y≥95 BP≥95)"
```

---

## Faz 1 sonrası manuel adımlar (kod dışı — README'ye taşınır)

- Sanity projesi oluşturma + token'lar + webhook + rol/grant'lar (Editör ve Pano Yöneticisi'ne `complaint` delete izni YOK — AP-03'ün ikinci katmanı; Sanity Growth plan rolleri veya dataset ACL ile)
- Vercel deploy + domain (apex kanonik, www → 301), GA4/Pixel ID'leri, Search Console + Bing doğrulama (AN-03)
- Gerçek içerik girişi: ürün foto/video, Dürüst Etiket verileri, 8 blog yazısı (SEO-13), hukukçu onaylı KVKK metinleri (PRD 11.3)
- ADM-17 kabul senaryosu marka sahibiyle canlı test

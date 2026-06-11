# Tulpar Carpet — Web Sitesi Tasarım Spesifikasyonu

**Tarih:** 2026-06-11 · **Durum:** Onaya sunuldu
**Kaynak:** PRD v1.1 (11 Haziran 2026) — bu doküman PRD'nin uygulama tasarımıdır; gereksinim kodları (TAS-, FLW-, AS-, UL-, UD-, AP-, MH-, DG-, SEO-, WA-, ER-, AN-, GV-, ADM-, IA-) PRD'ye referans verir ve aynen geçerlidir.

## 1. Kickoff Kararları (PRD Bölüm 13 — karara bağlandı)

| Soru | Karar |
|---|---|
| CMS | **Sanity** (Visual Editing + Presentation modu) |
| Test videoları | **YouTube unlisted** + facade/lazy embed (lite-youtube yaklaşımı) |
| Kanonik domain | **apex** (`tulparcarpet.com`); www → 301 |
| Faz 2 ödeme | **iyzico varsayımı** — veri modelinde alan adlandırması buna göre rezerve |
| Açık Pano girişi | **Ekip girer** (WA/e-posta'dan gelen şikayet CMS'e işlenir; public form yok) |
| Proje konumu | `~/Downloads/tulpar-carpet`, bağımsız git repo |

## 2. Mimari Genel Bakış

- **Tek Next.js 15+ (App Router, TypeScript) uygulaması.** Sanity Studio aynı repoda `/studio` route'una embed edilir (tek deploy, tek URL; ADM-14 mobil panel kullanımı dahil).
- **Stil:** Tailwind CSS v4 + `globals.css` içinde CSS custom property token'ları (PRD 2.2 renk, 2.3 gradient, 2.6 hareket token'ları). Ad-hoc renk/gradient/süre kullanımı lint/review maddesi.
- **Render:** SSG + ISR. Ürün/pano sayfaları ISR ≤ 1 saat + Sanity webhook → `revalidateTag` ile anında tazeleme (ADM-08, AP-04). Hesaplayıcı statik kabuk + client hesap (≤ 15 KB ek JS).
- **Hosting hedefi:** Vercel (edge cache, `next/image`, `@vercel/og`).
- **Analitik:** GA4 + Meta Pixel, Consent Mode v2 arkasında; `whatsapp_click` birincil dönüşüm (AN-01…05, WA-07).

## 3. Dizin Yapısı (özet)

```
tulpar-carpet/
├── app/
│   ├── (site)/            → tüm public sayfalar (PRD Bölüm 3 URL haritası)
│   │   ├── page.tsx                     (ana sayfa — blok render)
│   │   ├── halilar/ [+ [slug]/]
│   │   ├── durust-etiket/ taahhutler/ acik-pano/ maliyet-hesaplayici/
│   │   ├── hakkimizda/ blog/ [+ [slug]/] iletisim/ sss/
│   │   └── kvkk/ cerez-politikasi/ iade-kosullari/
│   ├── studio/[[...tool]]/ → embed Sanity Studio
│   ├── api/og/             → dinamik OG görsel (SEO-07)
│   ├── api/revalidate/     → Sanity webhook
│   ├── sitemap.ts robots.ts not-found.tsx
├── components/
│   ├── blocks/             → 10 blok komponenti (ADM-01 seti, 1:1 şema eşlemesi)
│   ├── ui/                 → buton, kart (gradient border), rozet, akordeon…
│   ├── flow/               → ViewTransition sarmalayıcı, ScrollReveal, KilimProgress, sayaç
│   └── whatsapp/           → FAB (at SVG), bağlamsal CTA'lar
├── sanity/                 → şemalar, desk yapısı, document actions, roller
├── lib/                    → queries (GROQ), wa-link builder, analytics, seo/jsonld
├── assets/logo/            → teslim edilen SVG'ler + izole at figürü
└── docs/                   → bu spec, plan, içerik el kitabı
```

## 4. İçerik Modeli (Sanity şemaları)

PRD 5.2 birebir uygulanır; ek uygulama kararları:

- **`page` (blok tabanlı):** `title, slug, blocks[], seo{}` — `blocks[]` union: `heroBlock, commitmentGridBlock, productShowcaseBlock, manifestoBlock, panoSummaryBlock, calculatorCtaBlock, videoBandBlock, instagramStripBlock, faqAccordionBlock, ctaBandBlock`. Her blokta `variant` (enum), `hidden` (ADM-02 gizleme). Renk/stil alanı YOK — varyantlar token sistemine kilitli (ADM-03). Özel HTML bloğu yok (ADM-04).
- **`product`:** PRD şeması aynen; `sizeVariants[].priceTRY/sku/stockStatus` Faz 1'de girilir, UI'da fiyat gösterimi var, sepet yok. `notFor` **required** (UD-03), `images[].alt` **required** (SEO-06), `seo.metaTitle ≤ 60` / `metaDescription ≤ 155` karakter validasyonu (SEO-10). `honestLabel` parti bazlı (`batchNo` ile).
- **`complaint`:** `ticketNo` otomatik artan; **delete engeli iki katmanlı:** (a) Studio'da delete/duplicate document action'ları `complaint` için kaldırılır, (b) Sanity rol/grant'larında Editör ve Pano Yöneticisi'ne delete izni verilmez (AP-03, ADM-10). Sayaçlar (AP-02) GROQ aggregate ile hesaplanır, elle girilmez.
- **`blogPost`, `siteSettings`:** PRD 5.2 aynen (`whatsappNumber`, `defaultWaMessages{}`, `calculatorDefaults{}`, `announcement`).
- **Faz 2 rezervi:** ürün şemasında `price/stock/sku` alanları mevcut ve pasif; iyzico adlandırma konvansiyonu dokümante edilir.

## 5. Flow & Hareket Sistemi (FLW-01…10)

- **Sayfa geçişleri:** `next-view-transitions` (veya Next native desteği) ile çapraz-solma + yukarı kayma; ürün kart → detay'da görsel `view-transition-name: product-{slug}` ile shared-element morph. Desteklemeyen tarayıcıda anlık geçiş (FLW-01).
- **Prefetch:** Next `<Link>` varsayılan + detay hero görseli için viewport'ta `<link rel=prefetch>` (FLW-02).
- **Placeholder:** tüm görsellerde Sanity LQIP `blurDataURL`; pano sayaçlarında count-up animasyonu (FLW-03).
- **Scroll:** `animation-timeline: view()` + `@supports` fallback'i IntersectionObserver'lı tek seferlik reveal; max 2 parallax katmanı, hız farkı ≤ %15 (FLW-04). Kilim şeridi progress bar: `scroll-timeline` tabanlı, koçboynuzu SVG pattern maskesi (FLW-05).
- **Disiplin:** yalnız `transform`/`opacity`; passive listeners; ESLint kuralı + review maddesi (FLW-06). Popup/modal yok, tek istisna WA-03 tooltip (FLW-07). Her sayfa sonunda bağlamsal yönlendirme bloğu (FLW-08). Tüm hareketler `prefers-reduced-motion` medya sorgusuyla kapanır (FLW-09). Lighthouse CI bütçesi animasyonlara karşı hard gate (FLW-10).

## 6. WhatsApp Sistemi (WA-01…07)

- FAB: at figürü (tulparcarpet15.svg'deki at `<g>` grubundan izole edilecek `horse.svg`), `--grad-ember` zemin, gradient kenarlık, 56/52px; tooltip bir kez, localStorage; aria-label + focus ring; çerez bandı açıkken bottom ofset.
- `lib/wa.ts`: bağlam → şablon + `Ref:` kısa kodu + URL-encode → `wa.me` linki. Şablonlar `siteSettings.defaultWaMessages`'tan.
- Her tıklama `whatsapp_click` (context, product_slug) GA4 event'i + Meta Pixel `Contact`.

## 7. SEO Uygulaması (SEO-01…15)

- Tüm sayfalar SSR/SSG tam HTML; `generateMetadata` her şablonda; JSON-LD SSR (`Organization`, `WebSite+SearchAction`, `Product+Offer`, `FAQPage`, `Article+BreadcrumbList`, `LocalBusiness`; Açık Pano schema'sız).
- `sitemap.ts`/`robots.ts` otomatik; trailing slash policy `next.config` `trailingSlash: true` + 301 (IA-01); filtreli listeler `noindex,follow` + canonical (UL-01); sayfalama `?sayfa=N` self-canonical (UL-04); 404/410 ve ürün kaldırma 301 stratejisi middleware + CMS `redirect` dokümanı (SEO-04).
- Dinamik OG: `@vercel/og` ile ürün foto + fiyat + leke rozeti (SEO-07).
- CI: Lighthouse CI (Perf ≥ 90, SEO ≥ 95, A11y ≥ 95, BP ≥ 95) + schema doğrulama adımı — eşik altı merge edilemez (5.4, SEO-08).

## 8. Yönetim Paneli (ADM-01…17)

Sanity Studio özelleştirmesi: Presentation modu (canlı önizleme + cihaz anahtarı, ADM-05), drag-drop blok sıralama (array editörü, ADM-02), scheduled publishing (ADM-06), revizyon geçmişi (Sanity history, ADM-07), webhook revalidate (ADM-08). Desk yapısı Türkçe: Sayfalar / Ürünler / Açık Pano / Blog / Site Ayarları / SEO uyarı listesi (eksik meta sorgusu, ADM-12). Gösterge ekranı (ADM-13): Studio dashboard widget'ı — açık şikayet sayısı + eksik içerik uyarıları Faz 1'de; GA4 API kartı Faz 1.5 (API anahtarı bağımlılığı). Roller: Sahip/Editör/Pano Yöneticisi, 2FA (Sanity SSO/2FA, GV-03). ADM-17 kabul senaryosu QA planında.

## 9. Hata Yönetimi ve Operasyon

- Markalı `not-found`, `error`, offline durumları; Sentry (GV-05); güvenlik başlıkları `next.config` headers (CSP report-only → enforce, GV-02); HSTS + www→apex 301 (GV-01); haftalık `sanity dataset export` cron dokümante (GV-04).
- KVKK: çerez bandı (consent state → GA4 Consent Mode v2 + Pixel gating); hukuk metinleri CMS'den, hukukçu onayı marka sahibi bağımlılığı.

## 10. Test Stratejisi

- **Birim:** `lib/` (wa-link builder, hesaplayıcı matematiği, jsonld üreticileri) — Vitest.
- **Şema validasyonu:** UD-03/SEO-10 zorunlu alan testleri.
- **E2E (Playwright):** kritik akışlar — ana sayfa → ürün → WA linki doğru encode; hesaplayıcı → WA paylaşımı; pano sayaçları; consent öncesi pazarlama çerezi düşmüyor; reduced-motion'da animasyon yok.
- **CI:** lint + typecheck + test + Lighthouse CI bütçeleri (5.4) her PR'da.
- **Kabul:** PRD 11.2 Definition of Done listesi + ADM-17 senaryosu.

## 11. Geliştirme Fazlaması ve Sub-Agent Dağılımı

Uygulama planı (writing-plans çıktısı) görevleri şu bağımsız iş paketlerine böler; paralel sub-agent'larla yürütülür:

1. **Altyapı:** repo, Next+Tailwind+Sanity kurulum, token'lar, CI/Lighthouse — (diğer her şeyin ön şartı, tek agent)
2. **Sanity şemaları + Studio özelleştirme** (ADM paketi)
3. **UI çekirdeği + blok kütüphanesi + FLW sistemi**
4. **Sayfa şablonları** (ana, halilar, ürün detay, pano, hesaplayıcı, statik sayfalar, blog)
5. **WA + analitik + consent**
6. **SEO katmanı** (metadata, jsonld, sitemap, OG)
7. **QA + içerik tohum verisi** (örnek ürünler, 15 SSS, pano kayıtları)

## 12. Kapsam Dışı (Faz 2 — mimari hazır)

Online ödeme/sepet, kullanıcı hesapları, `/en/`, AR görselleştirme, Instagram API (Faz 1 manuel küratörlük), GA4 dashboard kartı (Faz 1.5).

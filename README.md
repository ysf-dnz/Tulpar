# Tulpar Carpet

Tulpar Carpet'in güven platformu sitesi: dürüst etiketli halı koleksiyonu, açık şikayet panosu, 5 yıllık gerçek maliyet hesaplayıcısı ve WhatsApp odaklı dönüşüm sistemi.

**Stack:** Next.js 16 (App Router, TS), Tailwind CSS v4, Sanity v5 (`/studio`'da embed Studio), `next-view-transitions`, Vitest (birim) + Playwright (e2e). Tüm sayfalar SSG/ISR + webhook revalidate.

**Canlı:** https://tulpar-carpet.vercel.app · **Studio:** https://tulpar-carpet.vercel.app/studio

## Kurulum

```bash
npm ci
# .env.local oluşturup aşağıdaki tabloya göre doldurun
npm run dev                  # http://localhost:3000 — Studio: /studio
```

### Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Evet | Sanity proje ID'si |
| `NEXT_PUBLIC_SANITY_DATASET` | Hayır | Varsayılan `production` |
| `SANITY_API_READ_TOKEN` | Evet (draft mode) | Viewer token — taslak önizleme için |
| `SANITY_API_WRITE_TOKEN` | Seed için | Editor token — yalnızca `scripts/seed.ts` çalıştırırken |
| `SANITY_REVALIDATE_SECRET` | Evet (prod) | Webhook imza doğrulama sırrı (`/api/revalidate`) |
| `NEXT_PUBLIC_GA_ID` | Hayır | GA4 ölçüm ID'si (`G-…`) — consent sonrası yüklenir |
| `NEXT_PUBLIC_META_PIXEL_ID` | Hayır | Meta Pixel ID — consent sonrası yüklenir |
| `NEXT_PUBLIC_SITE_URL` | Evet (prod) | Kanonik origin, ör. `https://tulparcarpet.com` |

Not: WhatsApp numarası env değil, CMS'te tutulur (`Site Ayarları → whatsappNumber`, `90…` formatında 12 hane).

## Sanity projesi kurulumu

1. [sanity.io/manage](https://www.sanity.io/manage) → yeni proje oluşturun, `production` dataset'i ekleyin.
2. Proje ID'sini `NEXT_PUBLIC_SANITY_PROJECT_ID` olarak girin.
3. **API → Tokens:** bir *Viewer* token (`SANITY_API_READ_TOKEN`) ve seed için bir *Editor* token (`SANITY_API_WRITE_TOKEN`) üretin.
4. **API → CORS origins:** `http://localhost:3000` ve prod domain'i (credentials açık) ekleyin.
5. **Webhook (revalidate):** API → Webhooks → Create:
   - URL: `https://<site>/api/revalidate`
   - Dataset: `production`, Trigger: create/update/delete
   - Projection: `{_type}`
   - Secret: `SANITY_REVALIDATE_SECRET` ile aynı değer
6. **Roller (AP-03 ikinci katman):** Editör ve Pano Yöneticisi rollerine `complaint` dokümanı için **delete izni VERMEYİN** (Growth plan custom roles veya dataset ACL). Pano kayıtları silinemez — bu kuralın teknik güvencesi budur.

## Tohum içerik (seed)

```bash
SANITY_API_WRITE_TOKEN=sk... npx tsx scripts/seed.ts          # ana içerik
SANITY_API_WRITE_TOKEN=sk... npx tsx scripts/seed-pages.ts    # statik sayfalar
SANITY_API_WRITE_TOKEN=sk... npx tsx scripts/seed-blog.ts     # 8 köşe taşı blog yazısı (SEO-13)
```

Hepsi `createIfNotExists` kullanır, mevcut içeriğe dokunmaz.

- `seed.ts` → site ayarları (placeholder WA numarası — **değiştirin**), 2 örnek ürün (Bozkır, Kervan), 6 pano kaydı, `ana-sayfa` / `sss` (15 soru) / `maliyet-hesaplayici` sayfaları.
- `seed-pages.ts` → `durust-etiket`, `taahhutler`, `hakkimizda`, `kvkk`, `cerez-politikasi`, `iade-kosullari` statik sayfa içerikleri (KVKK metni taslaktır; hukuk onayı gerekir).
- `seed-blog.ts` → 8 SEO köşe taşı blog yazısı.

**Ürün görselleri seed'e dahil değildir** — heroImage ve ≥5 galeri görselini Studio'dan ekleyin; eklenene kadar ürünler Studio doğrulamasında uyarı verir.

## İçerik girişi el kitabı (özet)

### Ürün ekleme (Studio → Ürün → New)

1. Ürün adı + URL (slug) girin; slug yayın sonrası değiştirilmez.
2. Açıklama **en az 250 kelime** olmalı (SEO-12) — Studio kısa metni kabul etmez.
3. Ölçü seçenekleri: her ölçü için fiyat (₺) zorunlu.
4. Ana görsel + **en az 5 galeri görseli** (UD-06); her görsele alt metin yazın.
5. Dürüst Etiket: hav yüksekliğini **kendi ölçümünüzle** girin, parti numarasını yazın, 4 leke testinin (çay, kahve, vişne, mürekkep) sonucunu yöntem notuyla doldurun. ÇIKMAZ sonuçları da olduğu gibi yazılır.
6. **UD-03 kuralı:** "Bu halı kimler için değil" alanı zorunludur (≥40 karakter) ve gerçek bir sınırlama anlatmalıdır — pazarlama cümlesi değil.
7. SEO: meta başlık ≤60, meta açıklama ≤155 karakter.

### Pano kaydı girme (Studio → Şikayet Kaydı → New)

1. Ticket no ve tarih otomatik gelir; **elle değiştirmeyin**.
2. Müşteri metnini kişisel veri içermeyecek şekilde (anonim) girin.
3. Durum: AÇIK ile başlar; cevap verince Tulpar Cevabı + Yanıt Tarihi doldurup ÇÖZÜLDÜ veya İADE yapın.
4. **AP-03 kuralı: pano kaydı asla silinmez.** Çözülen kayıt cevabıyla yayında kalır. (Editör rollerinde silme yetkisi zaten kapalıdır.)

### Blok düzenleme / gizleme (Studio → Sayfa)

- Sayfa içeriği bloklardan oluşur (Hero, Taahhüt Izgarası, Ürün Vitrini, SSS Akordeonu, CTA Bandı…). Sürükle-bırak ile sıralanır (ADM-02).
- Bir bloğu yayından kaldırmadan saklamak için bloktaki **"Gizle"** anahtarını açın — içerik kaybolmaz, sadece sitede görünmez.
- Ana sayfanın slug'ı `ana-sayfa`'dır; değiştirmeyin.

## Test ve CI

```bash
npm run lint && npm test && npm run build
```

CI (`.github/workflows/ci.yml`): her push/PR'da lint + test + build + Lighthouse eşikleri (Perf ≥ 90, SEO ≥ 95, A11y ≥ 95, Best Practices ≥ 95 — `lighthouserc.json`). Repo secret'ı: `SANITY_PROJECT_ID`.

## Deploy (Vercel)

1. Repoyu Vercel'e bağlayın; yukarıdaki env değişkenlerini Production'a girin.
2. Domain: **apex kanoniktir** (`tulparcarpet.com`); `www` → apex'e **301** yönlendirme kurun (Vercel domain ayarlarından redirect).
3. Sanity webhook URL'ini prod domain ile güncelleyin.

## Yayın sonrası manuel adımlar

- **Google Search Console** + Bing Webmaster doğrulaması (AN-03); `sitemap.xml` gönderin.
- **Google Business Profile** (GBP) kaydı oluşturun/güncelleyin.
- GA4 ve Meta Pixel ID'lerini girip consent sonrası event akışını doğrulayın.
- Gerçek içerik: ürün foto/video çekimleri, Dürüst Etiket verileri, hukukçu onaylı KVKK metinleri (PRD 11.3). (8 blog yazısı seed ile yüklendi.)
- ADM-17 kabul senaryosunu marka sahibiyle canlı test edin.

import { defineType, defineField, defineArrayMember } from "sanity";

const stainResult = {
  type: "object" as const,
  fields: [
    defineField({
      name: "result",
      title: "Sonuç",
      type: "string",
      options: {
        list: [
          { title: "ÇIKAR", value: "PASS" },
          { title: "KISMEN", value: "PARTIAL" },
          { title: "ÇIKMAZ", value: "FAIL" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "methodNote", title: "Yöntem Notu", type: "string" }),
  ],
};

export const product = defineType({
  name: "product",
  title: "Ürün",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Ürün Adı", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "description",
      title: "Açıklama (≥250 kelime, SEO-12)",
      type: "text",
      validation: (r) =>
        r.required().custom((v) =>
          (v ?? "").trim().split(/\s+/).length >= 250 || "Açıklama en az 250 kelime olmalı (SEO-12)"
        ),
    }),
    defineField({
      name: "roomTags",
      title: "Oda Etiketleri",
      type: "array",
      of: [{ type: "string" }],
      options: { list: ["salon", "yatak-odasi", "cocuk-odasi", "koridor", "mutfak"] },
    }),
    defineField({
      name: "sizeVariants",
      title: "Ölçü Seçenekleri",
      type: "array",
      validation: (r) => r.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "size", title: "Ölçü", type: "string", validation: (r) => r.required() }),
            defineField({ name: "priceTRY", title: "Fiyat (₺)", type: "number", validation: (r) => r.required() }),
            defineField({ name: "sku", title: "SKU (Faz 2)", type: "string" }),
            defineField({
              name: "stockStatus",
              title: "Stok (Faz 2)",
              type: "string",
              options: { list: ["in_stock", "out_of_stock"] },
              initialValue: "in_stock",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Ana Görsel",
      type: "image",
      validation: (r) => r.required(),
      fields: [defineField({ name: "alt", title: "Alt Metin", type: "string", validation: (r) => r.required() })],
    }),
    defineField({
      name: "images",
      title: "Galeri (≥5 görsel, UD-06)",
      type: "array",
      validation: (r) => r.required().min(5),
      of: [
        defineArrayMember({
          type: "image",
          fields: [defineField({ name: "alt", title: "Alt Metin", type: "string", validation: (r) => r.required() })],
        }),
      ],
    }),
    defineField({ name: "pileHeightMm", title: "Hav Yüksekliği (mm, ölçülmüş)", type: "number", validation: (r) => r.required() }),
    defineField({ name: "batchNo", title: "Parti No", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "honestLabel",
      title: "Dürüst Etiket — Leke Testleri",
      type: "object",
      validation: (r) => r.required(),
      fields: [
        defineField({ name: "tea", title: "Çay", ...stainResult }),
        defineField({ name: "coffee", title: "Kahve", ...stainResult }),
        defineField({ name: "cherry", title: "Vişne", ...stainResult }),
        defineField({ name: "ink", title: "Mürekkep", ...stainResult }),
      ],
    }),
    defineField({
      name: "sheddingScore",
      title: "Tüy Dökme Skoru",
      type: "string",
      options: { list: ["dusuk", "orta", "yuksek"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "washingInstructions", title: "Yıkama Talimatı", type: "text", validation: (r) => r.required() }),
    defineField({
      name: "notFor",
      title: "Bu halı kimler için değil (UD-03 — zorunlu)",
      type: "text",
      validation: (r) => r.required().min(40),
    }),
    defineField({ name: "testVideoUrl", title: "Leke Testi Videosu (YouTube unlisted URL)", type: "url" }),
    defineField({ name: "seo", title: "SEO", type: "seo", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", media: "heroImage" } },
});

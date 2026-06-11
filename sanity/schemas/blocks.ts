import { defineType, defineField, defineArrayMember } from "sanity";

const base = [
  defineField({ name: "hidden", title: "Gizle (yayından kaldırmadan sakla)", type: "boolean", initialValue: false }),
];

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    ...base,
    defineField({
      name: "variant",
      type: "string",
      options: { list: ["gorselli", "videolu", "minimal"] },
      initialValue: "gorselli",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      type: "string",
      validation: (r) => r.required(),
      initialValue: "Mağazada gördüğün, evine gelen halıdır.",
    }),
    defineField({ name: "subheading", type: "text" }),
    defineField({ name: "image", type: "image", fields: [defineField({ name: "alt", type: "string" })] }),
    defineField({ name: "primaryCtaLabel", type: "string", initialValue: "Koleksiyonu Gör" }),
    defineField({ name: "primaryCtaHref", type: "string", initialValue: "/halilar/" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `Hero — ${title}` }) },
});

export const commitmentGridBlock = defineType({
  name: "commitmentGridBlock",
  title: "Taahhüt Izgarası",
  type: "object",
  fields: [
    ...base,
    defineField({
      name: "items",
      type: "array",
      validation: (r) => r.required().min(4).max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", validation: (r) => r.required() }),
            defineField({ name: "href", type: "string", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Taahhüt Izgarası" }) },
});

export const productShowcaseBlock = defineType({
  name: "productShowcaseBlock",
  title: "Ürün Vitrini",
  type: "object",
  fields: [
    ...base,
    defineField({ name: "mode", type: "string", options: { list: ["elle", "son-eklenen"] }, initialValue: "elle" }),
    defineField({ name: "products", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })] }),
    defineField({ name: "heading", type: "string", initialValue: "Öne Çıkan Halılar" }),
  ],
  preview: { prepare: () => ({ title: "Ürün Vitrini" }) },
});

export const manifestoBlock = defineType({
  name: "manifestoBlock",
  title: "Manifesto / Metin",
  type: "object",
  fields: [
    ...base,
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "body", type: "array", of: [defineArrayMember({ type: "block" })] }),
  ],
  preview: { select: { title: "heading" } },
});

export const panoSummaryBlock = defineType({
  name: "panoSummaryBlock",
  title: "Açık Pano Özeti",
  type: "object",
  fields: [...base, defineField({ name: "heading", type: "string", initialValue: "Açık Şikayet Panosu" })],
  preview: { prepare: () => ({ title: "Açık Pano Özeti" }) },
});

export const calculatorCtaBlock = defineType({
  name: "calculatorCtaBlock",
  title: "Hesaplayıcı Çağrısı",
  type: "object",
  fields: [...base, defineField({ name: "heading", type: "string", initialValue: "5 yıllık gerçek maliyeti hesapla" })],
  preview: { prepare: () => ({ title: "Hesaplayıcı Çağrısı" }) },
});

export const videoBandBlock = defineType({
  name: "videoBandBlock",
  title: "Video Bandı",
  type: "object",
  fields: [
    ...base,
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "videoUrl", type: "url", validation: (r) => r.required() }),
  ],
  preview: { prepare: () => ({ title: "Video Bandı" }) },
});

export const instagramStripBlock = defineType({
  name: "instagramStripBlock",
  title: "Instagram Şeridi",
  type: "object",
  fields: [
    ...base,
    defineField({
      name: "posts",
      title: "Gönderiler (manuel küratörlük, AS-05)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "image",
              type: "image",
              validation: (r) => r.required(),
              fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
            }),
            defineField({ name: "permalink", type: "url", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Instagram Şeridi" }) },
});

export const faqAccordionBlock = defineType({
  name: "faqAccordionBlock",
  title: "SSS Akordeonu",
  type: "object",
  fields: [
    ...base,
    defineField({
      name: "items",
      type: "array",
      validation: (r) => r.required(),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "answer", type: "text", validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "SSS Akordeonu" }) },
});

export const ctaBandBlock = defineType({
  name: "ctaBandBlock",
  title: "CTA Bandı",
  type: "object",
  fields: [
    ...base,
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaLabel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ctaHref", type: "string", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: `CTA Bandı — ${title}` }) },
});

export const blockTypes = [
  heroBlock,
  commitmentGridBlock,
  productShowcaseBlock,
  manifestoBlock,
  panoSummaryBlock,
  calculatorCtaBlock,
  videoBandBlock,
  instagramStripBlock,
  faqAccordionBlock,
  ctaBandBlock,
];

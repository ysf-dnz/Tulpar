import { defineType, defineField } from "sanity";

export const seoObject = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Başlık",
      type: "string",
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Açıklama",
      type: "text",
      rows: 3,
      validation: (r) => r.required().max(155),
    }),
    defineField({ name: "ogImage", title: "OG Görseli", type: "image" }),
  ],
});

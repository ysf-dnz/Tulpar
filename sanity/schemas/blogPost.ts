import { defineType, defineField, defineArrayMember } from "sanity";

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Yazısı",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          fields: [defineField({ name: "alt", type: "string", validation: (r) => r.required() })],
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({ name: "category", type: "string", options: { list: ["bakim", "test", "rehber", "marka"] } }),
    defineField({ name: "author", type: "string", initialValue: "Tulpar Carpet" }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", type: "datetime" }),
    defineField({ name: "videoUrl", title: "Gömülü Test Videosu (SEO-15)", type: "url" }),
    defineField({
      name: "faqItems",
      title: "FAQ Maddeleri (schema için)",
      type: "array",
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
    defineField({ name: "seo", type: "seo", validation: (r) => r.required() }),
  ],
});

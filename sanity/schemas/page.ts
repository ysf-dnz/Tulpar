import { defineType, defineField, defineArrayMember } from "sanity";
import { blockTypes } from "./blocks";

export const page = defineType({
  name: "page",
  title: "Sayfa",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      validation: (r) => r.required(),
      description: "Ana sayfa için 'ana-sayfa' kullanın.",
    }),
    defineField({
      name: "blocks",
      title: "Bloklar (sürükle-bırak sırala, ADM-02)",
      type: "array",
      of: blockTypes.map((b) => defineArrayMember({ type: b.name })),
    }),
    defineField({ name: "seo", type: "seo", validation: (r) => r.required() }),
  ],
});

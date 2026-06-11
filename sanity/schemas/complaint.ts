import { defineType, defineField } from "sanity";

export const complaint = defineType({
  name: "complaint",
  title: "Şikayet Kaydı",
  type: "document",
  initialValue: async (_params, { getClient }) => {
    const client = getClient({ apiVersion: "2026-06-01" });
    const last = await client.fetch<number | null>(`max(*[_type=="complaint"].ticketNo)`);
    return { ticketNo: (last ?? 1000) + 1, date: new Date().toISOString() };
  },
  fields: [
    defineField({
      name: "ticketNo",
      title: "Ticket No",
      type: "number",
      validation: (r) => r.required(),
      readOnly: ({ document }) => Boolean(document?._createdAt),
      description: "Otomatik artar; elle değiştirmeyin.",
    }),
    defineField({ name: "date", title: "Tarih", type: "datetime", validation: (r) => r.required() }),
    defineField({
      name: "status",
      title: "Durum",
      type: "string",
      validation: (r) => r.required(),
      options: {
        list: [
          { title: "AÇIK", value: "OPEN" },
          { title: "ÇÖZÜLDÜ", value: "SOLVED" },
          { title: "İADE", value: "REFUND" },
        ],
        layout: "radio",
      },
      initialValue: "OPEN",
    }),
    defineField({ name: "customerText", title: "Müşteri Metni (anonim)", type: "text", validation: (r) => r.required() }),
    defineField({ name: "responseText", title: "Tulpar Cevabı", type: "text" }),
    defineField({ name: "responseAt", title: "Yanıt Tarihi", type: "datetime" }),
  ],
  preview: { select: { title: "customerText", subtitle: "status" } },
});

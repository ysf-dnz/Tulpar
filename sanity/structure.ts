import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("İçerik")
    .items([
      S.listItem().title("Sayfalar").child(S.documentTypeList("page")),
      S.listItem().title("Ürünler").child(S.documentTypeList("product")),
      S.listItem()
        .title("Açık Pano")
        .child(
          S.documentTypeList("complaint").defaultOrdering([{ field: "ticketNo", direction: "desc" }])
        ),
      S.listItem().title("Blog").child(S.documentTypeList("blogPost")),
      S.listItem()
        .title("Site Ayarları")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
    ]);

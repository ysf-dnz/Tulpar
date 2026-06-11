import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list().title("İçerik").items(S.documentTypeListItems());

// Boş/eksik env'de "placeholder" kullanılır: CI ve Sanity'siz lokal build yeşil
// kalır, tüm fetch'ler zaten try/catch'li olduğundan sayfalar boş içerikle render edilir.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2026-06-01";

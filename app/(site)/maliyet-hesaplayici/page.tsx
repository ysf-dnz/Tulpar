import { client } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/lib/queries";
import { CostCalculator } from "@/components/CostCalculator";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { fetchPage } from "@/lib/page";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Halı Yıkama Maliyeti Hesaplayıcı — 5 Yıllık Gerçek Maliyet",
  description: "Ucuz halı gerçekten ucuz mu? Halı fiyatı + 5 yıllık yıkatma masrafını hesapla, gerçek maliyeti gör.",
  alternates: { canonical: "/maliyet-hesaplayici/" },
};

type Settings = { whatsappNumber?: string; waMessageCalculator?: string; calcDefaultWashCount?: number; calcDefaultWashPrice?: number } | null;

export default async function CalculatorPage() {
  let settings: Settings = null;
  try {
    settings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600, tags: ["siteSettings"] } });
  } catch {
    // Sanity yapılandırılmadıysa varsayılanlarla devam et
  }
  const page = await fetchPage("maliyet-hesaplayici"); // MH-04: ≥800 kelimelik SEO metni CMS'den

  return (
    <>
      <div className="mx-auto max-w-2xl space-y-8 px-6 py-16">
        <header className="space-y-3">
          <h1 className="font-display text-4xl">5 Yıllık Gerçek Maliyet Hesaplayıcısı</h1>
          <p className="text-muted">Halının gerçek maliyeti etiketteki fiyat değildir; 5 yıllık yıkatma masrafını da ekle.</p>
        </header>
        <CostCalculator
          defaults={{ washesPerYear: settings?.calcDefaultWashCount ?? 2, washPrice: settings?.calcDefaultWashPrice ?? 900 }}
          waNumber={settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? ""}
          waTemplate={settings?.waMessageCalculator ?? "Merhaba, hesaplayıcıda 5 yılda {fark} ₺ fark çıktı. Bilgi almak istiyorum."}
        />
      </div>
      <BlockRenderer blocks={page?.blocks ?? []} />
    </>
  );
}

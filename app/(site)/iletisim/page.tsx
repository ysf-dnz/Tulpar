import { client } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/lib/queries";
import { buildWaLink } from "@/lib/wa";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "İletişim — Tulpar Carpet, Kayseri",
  description: "WhatsApp, e-posta ve Kayseri mağaza adresimiz. En hızlı yanıt WhatsApp'tan.",
  alternates: { canonical: "/iletisim/" },
};

type Settings = { whatsappNumber?: string; waMessageGeneral?: string; email?: string; address?: string } | null;

export default async function IletisimPage() {
  let settings: Settings = null;
  try {
    settings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600, tags: ["siteSettings"] } });
  } catch {
    // Sanity yapılandırılmadıysa varsayılanlarla devam et
  }
  const number = settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? "";
  const email = settings?.email ?? "info@tulparcarpet.com";
  const address = settings?.address ?? "Organize Sanayi Bölgesi, Kayseri, Türkiye";

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <header className="space-y-3">
        <h1 className="font-display text-4xl">İletişim</h1>
        <p className="text-muted">En hızlı yanıtı WhatsApp&apos;tan alırsın; mesai saatlerinde ortalama bir saat içinde döneriz.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <a href={buildWaLink({ number, message: settings?.waMessageGeneral ?? "Merhaba, tulparcarpet.com'dan yazıyorum.", refCode: "ILETISIM" })}
          target="_blank" rel="noopener noreferrer" className="card-premium block p-6">
          <h2 className="font-display text-lg text-gold">WhatsApp</h2>
          <p className="font-data mt-2 text-sm text-muted">Mesaj yaz, fotoğraf iste, ölçü sor.</p>
        </a>
        <a href={`mailto:${email}`} className="card-premium block p-6">
          <h2 className="font-display text-lg text-gold">E-posta</h2>
          <p className="font-data mt-2 text-sm text-muted">{email}</p>
        </a>
        <div className="card-premium p-6">
          <h2 className="font-display text-lg text-gold">Mağaza</h2>
          <p className="mt-2 text-sm text-muted">{address}</p>
        </div>
      </div>
      <iframe
        title="Tulpar Carpet Kayseri mağaza konumu"
        src="https://www.google.com/maps?q=Kayseri%2C%20T%C3%BCrkiye&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-80 w-full rounded-xl border border-stroke"
      />
    </div>
  );
}

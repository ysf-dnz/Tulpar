import { client } from "@/sanity/client";
import { SETTINGS_QUERY } from "@/lib/queries";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WaFab } from "@/components/whatsapp/WaFab";
import { KilimProgress } from "@/components/flow/KilimProgress";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings: { whatsappNumber?: string; waMessageGeneral?: string } | null = null;
  try {
    settings = await client.fetch(SETTINGS_QUERY, {}, { next: { revalidate: 3600, tags: ["siteSettings"] } });
  } catch {
    // Sanity projesi henüz yapılandırılmadıysa varsayılanlarla devam et
  }
  return (
    <>
      <KilimProgress />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WaFab number={settings?.whatsappNumber ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? ""}
        message={settings?.waMessageGeneral ?? "Merhaba, tulparcarpet.com'dan yazıyorum."} />
    </>
  );
}

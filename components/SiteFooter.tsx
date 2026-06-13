import { Link } from "next-view-transitions";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-stroke px-6 py-16">
      <div
        aria-hidden
        className="motif motif-repeat-x inset-x-0 top-2 h-12"
        style={{ "--motif": "url(/motifs/desen-clean.svg)", opacity: 0.07 } as React.CSSProperties}
      />
      <div className="relative mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center">
            <Logo height={38} />
            <span className="sr-only">Tulpar Carpet</span>
          </div>
          <div className="gold-rule mt-3" aria-hidden />
          <p className="mt-2 text-sm text-muted">Mağazada gördüğün, evine gelen halıdır. Kayseri&apos;de üretilir.</p>
        </div>
        <nav className="space-y-2 text-sm text-muted">
          {["/halilar/", "/durust-etiket/", "/acik-pano/", "/sss/", "/iletisim/"].map((h) => (
            <Link key={h} href={h} className="block hover:text-cream">{h.replaceAll("/", "").replaceAll("-", " ") || "Ana sayfa"}</Link>
          ))}
        </nav>
        <nav className="space-y-2 text-sm text-muted">
          {["/kvkk/", "/cerez-politikasi/", "/iade-kosullari/", "/hakkimizda/"].map((h) => (
            <Link key={h} href={h} className="block hover:text-cream">{h.replaceAll("/", "").replaceAll("-", " ")}</Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-stroke pt-8 text-sm md:flex-row md:items-center md:justify-between">
        <Link href="/maliyet-hesaplayici/" className="text-gold underline-offset-4 hover:underline">5 yıllık gerçek maliyeti hesapla →</Link>
        <p className="text-muted">Sorunuz mu var? Sağ alttaki WhatsApp düğmesinden yazın — 24 saatte yanıt sözü.</p>
      </div>
    </footer>
  );
}

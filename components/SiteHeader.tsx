import { Link } from "next-view-transitions";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const nav = [
  { href: "/halilar/", label: "Halılar" },
  { href: "/durust-etiket/", label: "Dürüst Etiket" },
  { href: "/taahhutler/", label: "Taahhütler" },
  { href: "/acik-pano/", label: "Açık Pano" },
  { href: "/maliyet-hesaplayici/", label: "Hesaplayıcı" },
  { href: "/blog/", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stroke bg-base/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Tulpar Carpet ana sayfa" className="flex items-center">
          <Logo height={48} />
        </Link>
        <nav className="flex gap-6 text-sm text-muted max-md:hidden">
          {nav.map((n) => <Link key={n.href} href={n.href} className="inline-block px-1 py-2 transition-colors duration-[var(--dur-micro)] hover:text-cream">{n.label}</Link>)}
        </nav>
        <MobileMenu nav={nav} />
      </div>
    </header>
  );
}

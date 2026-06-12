import { Link } from "next-view-transitions";
import Image from "next/image";

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Tulpar Carpet ana sayfa">
          <Image src="/logo-light.svg" alt="Tulpar Carpet" width={160} height={27} priority />
        </Link>
        <nav className="flex gap-6 text-sm text-muted max-md:hidden">
          {nav.map((n) => <Link key={n.href} href={n.href} className="inline-block px-1 py-2 transition-colors duration-[var(--dur-micro)] hover:text-cream">{n.label}</Link>)}
        </nav>
        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-stroke px-3 py-2 text-sm text-cream marker:content-none" aria-label="Menüyü aç">
            Menü
          </summary>
          <nav className="card-premium absolute right-0 top-full mt-2 flex w-56 flex-col gap-1 p-3 text-sm text-muted">
            {nav.map((n) => <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 hover:bg-elevated hover:text-cream">{n.label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

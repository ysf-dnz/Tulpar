"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";

export function MobileMenu({ nav }: { nav: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Route değişince menüyü kapat
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Menü dışına tıklayınca kapat
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative md:hidden">
      <button
        type="button"
        aria-label="Menüyü aç"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer rounded-lg border border-stroke px-3 py-2 text-sm text-cream"
      >
        Menü
      </button>
      {open && (
        <nav className="card-premium absolute right-0 top-full mt-2 flex w-56 flex-col gap-1 p-3 text-sm text-muted">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 hover:bg-elevated hover:text-cream">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

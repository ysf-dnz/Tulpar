"use client";
import { useEffect, useRef } from "react";

export function KilimProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden">
      <div ref={ref} className="h-full w-full origin-left scale-x-0 will-change-transform"
        style={{
          background: "var(--grad-gold)",
          maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='4'%3E%3Cpath d='M0 4 L4 0 L8 4 L12 0 L16 4 Z' fill='black'/%3E%3C/svg%3E\")",
          maskRepeat: "repeat-x", maskSize: "16px 4px",
        }} />
    </div>
  );
}

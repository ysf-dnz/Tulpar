"use client";
import { useEffect, useRef } from "react";

export function ScrollReveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) { ref.current?.classList.add("reveal"); return; }
    ref.current?.classList.add("reveal-js");
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.disconnect(); }
    }, { threshold: 0.15 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

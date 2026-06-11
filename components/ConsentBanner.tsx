"use client";
import { useEffect, useState } from "react";

export function ConsentBanner({ onConsent }: { onConsent: (granted: boolean) => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("consent");
    if (saved === null) {
      document.documentElement.style.setProperty("--consent-offset", "88px");
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    onConsent(saved === "granted");
  }, [onConsent]);
  const decide = (granted: boolean) => {
    localStorage.setItem("consent", granted ? "granted" : "denied");
    document.documentElement.style.setProperty("--consent-offset", "0px"); // WA-01 FAB ofseti
    setVisible(false);
    onConsent(granted);
  };
  if (!visible) return null;
  return (
    <div role="dialog" aria-label="Çerez tercihi" className="card-premium fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-2xl p-5 text-sm">
      <p className="text-muted">Deneyimi ölçmek için çerez kullanıyoruz. Pazarlama çerezleri yalnızca onayınızla çalışır.
        Ayrıntı: <a href="/cerez-politikasi/" className="text-gold underline">Çerez Politikası</a></p>
      <div className="mt-4 flex gap-3">
        <button onClick={() => decide(true)} className="rounded px-5 py-2 font-semibold text-cream [background:var(--grad-ember)]">Kabul et</button>
        <button onClick={() => decide(false)} className="rounded border border-stroke px-5 py-2 text-muted">Reddet</button>
      </div>
    </div>
  );
}

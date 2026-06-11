"use client";
import { useEffect, useState } from "react";
import { HorseIcon } from "./HorseIcon";
import { buildWaLink } from "@/lib/wa";
import { track } from "@/lib/analytics";

export function WaFab({ number, message }: { number: string; message: string }) {
  const [tooltip, setTooltip] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("wa-tooltip-seen")) return;
    const t = setTimeout(() => setTooltip(true), 5000);
    return () => clearTimeout(t);
  }, []);
  const dismiss = () => { setTooltip(false); localStorage.setItem("wa-tooltip-seen", "1"); };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-md:bottom-4 max-md:right-4" style={{ bottom: "calc(1.5rem + var(--consent-offset, 0px))" }}>
      {tooltip && (
        <div role="status" className="card-premium absolute bottom-full right-0 mb-3 w-64 p-3 text-sm text-cream">
          Halı hakkında soru sor — 24 saatte yanıt sözü.
          <button onClick={dismiss} aria-label="Kapat" className="absolute right-2 top-1 text-muted hover:text-cream">×</button>
        </div>
      )}
      <a
        href={buildWaLink({ number, message, refCode: "FAB" })}
        target="_blank" rel="noopener noreferrer"
        aria-label="WhatsApp ile konuşma başlat"
        onClick={() => { dismiss(); track("whatsapp_click", { context: "fab" }); }}
        className="group flex size-14 items-center justify-center rounded-full border border-transparent max-md:size-[52px] [background:var(--grad-ember)_padding-box,var(--grad-border)_border-box] shadow-lg transition-transform duration-[var(--dur-micro)] [transition-timing-function:var(--ease-flow)] hover:-translate-y-1 motion-reduce:hover:translate-y-0"
      >
        <HorseIcon className="size-8 text-cream transition-transform duration-200 group-hover:rotate-[-6deg] motion-reduce:group-hover:rotate-0" />
      </a>
    </div>
  );
}

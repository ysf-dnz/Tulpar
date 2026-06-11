"use client";
import { useState } from "react";
import { fiveYearCost } from "@/lib/calc";
import { buildWaLink, fillTemplate } from "@/lib/wa";
import { track } from "@/lib/analytics";

export function CostCalculator({ defaults, waNumber, waTemplate }: {
  defaults: { washesPerYear: number; washPrice: number }; waNumber: string; waTemplate: string;
}) {
  const [rivalPrice, setRivalPrice] = useState(5000);
  const [tulparPrice, setTulparPrice] = useState(8000);
  const [washes, setWashes] = useState(defaults.washesPerYear);
  const [washPrice, setWashPrice] = useState(defaults.washPrice);
  const r = fiveYearCost({ rivalPrice, tulparPrice, washesPerYear: washes, washPrice });
  const fields = [
    ["Rakip halı fiyatı (₺)", rivalPrice, setRivalPrice],
    ["Tulpar halı fiyatı (₺)", tulparPrice, setTulparPrice],
    ["Yıllık yıkatma sayısı", washes, setWashes],
    ["Sefer başı yıkama bedeli (₺)", washPrice, setWashPrice],
  ] as const;
  return (
    <div className="card-premium space-y-6 p-6">
      {fields.map(([label, val, set]) => (
        <label key={label} className="block text-sm">
          <span className="text-muted">{label}</span>
          <input type="number" value={val} min={0}
            onChange={(e) => { set(Number(e.target.value)); track("calculator_used"); }}
            className="font-data mt-1 w-full rounded border border-stroke bg-base px-3 py-2 text-cream" />
        </label>
      ))}
      <div className="font-data space-y-1 border-t border-stroke pt-4">
        <p className="flex justify-between text-muted"><span>Rakip 5 yıllık toplam</span><span>{r.rivalTotal.toLocaleString("tr-TR")} ₺</span></p>
        <p className="flex justify-between text-muted"><span>Tulpar 5 yıllık toplam</span><span>{r.tulparTotal.toLocaleString("tr-TR")} ₺</span></p>
        <p className="flex justify-between text-xl text-gold"><span>Fark</span><span>{r.savings.toLocaleString("tr-TR")} ₺</span></p>
      </div>
      <a href={buildWaLink({ number: waNumber, message: fillTemplate(waTemplate, { fark: r.savings.toLocaleString("tr-TR") }), refCode: "MH" })}
        target="_blank" rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { context: "calculator" })}
        className="block rounded-lg px-6 py-3 text-center font-semibold text-cream [background:var(--grad-ember)]">
        Sonucu WhatsApp&apos;ta paylaş
      </a>
    </div>
  );
}

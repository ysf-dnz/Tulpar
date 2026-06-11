import { client } from "@/sanity/client";
import { COMPLAINTS_QUERY, PANO_STATS_QUERY } from "@/lib/queries";
import { CountUp } from "@/components/flow/CountUp";
import { PanoViewTracker } from "@/components/PanoViewTracker";
import type { Metadata } from "next";

export const revalidate = 3600; // AP-04

export const metadata: Metadata = {
  title: "Açık Şikayet Panosu — Filtresiz, Silinmez",
  description: "Tulpar Carpet'e gelen her şikayet, cevabı ve çözüm süresiyle burada. Silme yok, filtre yok.",
  alternates: { canonical: "/acik-pano/" },
};

const STATUS_TR = { OPEN: "AÇIK", SOLVED: "ÇÖZÜLDÜ", REFUND: "İADE" } as const;
const STATUS_CLS = { OPEN: "text-gold", SOLVED: "text-success", REFUND: "text-ember" } as const;

type Complaint = { ticketNo: number; date: string; status: keyof typeof STATUS_TR; customerText: string; responseText?: string; responseAt?: string };
type Stats = { total: number; answered: number; avgResponseHours: number | null; refunds: number };

export default async function PanoPage() {
  let complaints: Complaint[] = [];
  let s: Stats = { total: 0, answered: 0, avgResponseHours: 0, refunds: 0 };
  try {
    [complaints, s] = await Promise.all([
      client.fetch(COMPLAINTS_QUERY, {}, { next: { revalidate: 3600, tags: ["complaint"] } }),
      client.fetch(PANO_STATS_QUERY, {}, { next: { revalidate: 3600, tags: ["complaint"] } }),
    ]);
  } catch {
    // Sanity yapılandırılmadıysa sıfır/boş değerlerle render et
  }
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-16">
      <PanoViewTracker />
      <header className="space-y-3">
        <h1 className="font-display text-4xl">Açık Şikayet Panosu</h1>
        <p className="text-muted">Bu panoda silme yoktur, filtre yoktur. Her kayıt cevabı ve süresiyle durur.</p>
      </header>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[["Son 12 ay", s.total], ["Cevaplanan", s.answered], ["Ort. yanıt (saat)", Math.round(s.avgResponseHours ?? 0)], ["İade", s.refunds]].map(([l, v]) => (
          <div key={l as string} className="card-premium p-5 text-center">
            <div className="text-3xl text-gold"><CountUp to={v as number} /></div>
            <div className="mt-1 text-xs text-muted">{l}</div>
          </div>
        ))}
      </div>
      <ol className="space-y-4">
        {complaints.map((c) => (
          <li key={c.ticketNo} className="card-premium p-5">
            <div className="font-data flex justify-between text-xs text-muted">
              <span>#{c.ticketNo} · {new Date(c.date).toLocaleDateString("tr-TR")}</span>
              <span className={STATUS_CLS[c.status]}>{STATUS_TR[c.status]}</span>
            </div>
            <p className="mt-3">{c.customerText}</p>
            {c.responseText && (
              <div className="mt-3 border-l-2 border-gold pl-4 text-sm text-muted">
                <p className="font-data text-xs text-gold">TULPAR CEVABI{c.responseAt && ` — ${Math.round((+new Date(c.responseAt) - +new Date(c.date)) / 36e5)} saat içinde`}</p>
                <p className="mt-1">{c.responseText}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

import { client } from "@/sanity/client";
import { PANO_STATS_QUERY } from "@/lib/queries";
import { CountUp } from "@/components/flow/CountUp";
import { Button } from "@/components/ui/Button";

type Stats = { total: number; answered: number; avgResponseHours: number | null; refunds: number };

export async function PanoSummary({ b }: { b: { heading: string } }) {
  let s: Stats = { total: 0, answered: 0, avgResponseHours: 0, refunds: 0 };
  try {
    s = await client.fetch(PANO_STATS_QUERY, {}, { next: { revalidate: 3600, tags: ["complaint"] } });
  } catch {
    // Sanity projesi henüz yapılandırılmadıysa sıfırlarla render et
  }
  const items = [
    { label: "Son 12 ay şikayet", value: s.total },
    { label: "Cevaplanan", value: s.answered },
    { label: "Ort. yanıt (saat)", value: Math.round(s.avgResponseHours ?? 0) },
    { label: "İade", value: s.refunds },
  ];
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-6xl space-y-8 text-center">
        <h2 className="font-display text-3xl">{b.heading}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((i) => (
            <div key={i.label} className="card-premium p-6">
              <div className="text-4xl text-gold"><CountUp to={i.value} /></div>
              <div className="mt-2 text-sm text-muted">{i.label}</div>
            </div>
          ))}
        </div>
        <Button href="/acik-pano/" variant="secondary">Panonun tamamını gör — filtresiz</Button>
      </div>
    </section>
  );
}

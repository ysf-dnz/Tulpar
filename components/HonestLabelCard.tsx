const RESULT_TR = { PASS: "ÇIKAR", PARTIAL: "KISMEN", FAIL: "ÇIKMAZ" } as const;
const RESULT_CLS = { PASS: "text-success", PARTIAL: "text-gold", FAIL: "text-ember" } as const;
const TEST_TR = { tea: "Çay", coffee: "Kahve", cherry: "Vişne", ink: "Mürekkep" } as const;

type Entry = { result: keyof typeof RESULT_TR; methodNote?: string };

export function HonestLabelCard({ label, pileHeightMm, batchNo, sheddingScore, washingInstructions }: {
  label: Record<keyof typeof TEST_TR, Entry>; pileHeightMm: number; batchNo: string;
  sheddingScore: string; washingInstructions: string;
}) {
  return (
    <section aria-labelledby="durust-etiket" className="card-premium font-data p-6 text-sm">
      <h2 id="durust-etiket" className="font-display mb-4 text-xl">DÜRÜST ETİKET <span className="text-muted">— Parti {batchNo}</span></h2>
      <dl className="space-y-2">
        <div className="flex justify-between"><dt className="text-muted">Hav yüksekliği (ölçülmüş)</dt><dd>{pileHeightMm} mm</dd></div>
        {(Object.keys(TEST_TR) as (keyof typeof TEST_TR)[]).map((k) => (
          <div key={k} className="flex justify-between">
            <dt className="text-muted">{TEST_TR[k]} lekesi</dt>
            <dd className={RESULT_CLS[label[k].result]} title={label[k].methodNote}>{RESULT_TR[label[k].result]}</dd>
          </div>
        ))}
        <div className="flex justify-between"><dt className="text-muted">Tüy dökme</dt><dd>{sheddingScore}</dd></div>
      </dl>
      <p className="mt-4 border-t border-stroke pt-3 text-muted">Yıkama: {washingInstructions}</p>
    </section>
  );
}

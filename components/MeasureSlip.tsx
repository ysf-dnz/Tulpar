export function MeasureSlip({ batchNo, pileHeightMm }: { batchNo: string; pileHeightMm: number }) {
  return (
    <figure className="font-data rounded-lg border border-dashed border-stroke bg-elevated p-4 text-xs text-muted">
      <figcaption className="mb-2 text-cream">Sevkiyat öncesi size gönderilecek ölçüm fişi örneği:</figcaption>
      <pre>{`TULPAR CARPET / ÖLÇÜM FİŞİ
Parti: ${batchNo}   Hav: ${pileHeightMm} mm
Ölçen: ____   Tarih: __/__/____
Fotoğraf: sevkiyat e-postasına eklenir`}</pre>
    </figure>
  );
}

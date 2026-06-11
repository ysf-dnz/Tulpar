type HonestLabel = { tea?: { result: string }; coffee?: { result: string }; cherry?: { result: string }; ink?: { result: string } };

export function stainScore(label: HonestLabel | undefined): number {
  if (!label) return 0;
  return (["tea", "coffee", "cherry", "ink"] as const).filter((k) => label[k]?.result === "PASS").length;
}

export function StainBadge({ label }: { label?: HonestLabel }) {
  const score = stainScore(label);
  return (
    <span className="font-data inline-flex items-center gap-1 rounded-full border border-stroke bg-elevated px-2.5 py-1 text-xs text-cream"
      title={`Leke direnci: ${score}/4 test ÇIKAR sonuçlu`}>
      <span className="text-gold">●</span> LEKE {score}/4
    </span>
  );
}

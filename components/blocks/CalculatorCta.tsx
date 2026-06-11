import { Button } from "@/components/ui/Button";

export function CalculatorCta({ b }: { b: { heading?: string } }) {
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="card-premium mx-auto flex max-w-4xl flex-col items-center gap-6 p-10 text-center">
        <h2 className="font-display text-3xl">{b.heading ?? "5 yıllık gerçek maliyeti hesapla"}</h2>
        <Button href="/maliyet-hesaplayici/">Hesaplayıcıyı Aç</Button>
      </div>
    </section>
  );
}

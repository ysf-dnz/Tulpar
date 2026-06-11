"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="hero-surface grid min-h-screen place-items-center px-6 text-center">
      <div className="space-y-4">
        <p className="font-data text-gold">500</p>
        <h1 className="font-display text-3xl text-cream">Bir ilmek atladık, dokuma kısa süreliğine durdu.</h1>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-block cursor-pointer rounded-lg px-6 py-3 font-semibold text-cream [background:var(--grad-ember)]"
        >
          Tekrar dene
        </button>
      </div>
    </div>
  );
}

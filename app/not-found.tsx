import Link from "next/link";

export default function NotFound() {
  return (
    <div className="hero-surface grid min-h-screen place-items-center px-6 text-center">
      <div className="space-y-4">
        <p className="font-data text-gold">404</p>
        <h1 className="font-display text-3xl text-cream">Bu halının deseni burada yok.</h1>
        <Link
          href="/halilar/"
          className="inline-block rounded-lg px-6 py-3 font-semibold text-cream [background:var(--grad-ember)]"
        >
          Koleksiyona dön
        </Link>
      </div>
    </div>
  );
}

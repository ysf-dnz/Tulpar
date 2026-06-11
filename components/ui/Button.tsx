import Link from "next/link";

const styles = {
  primary: "text-cream [background:var(--grad-ember)] hover:brightness-110",
  secondary: "border border-stroke text-cream hover:border-gold",
} as const;

export function Button({ href, variant = "primary", children, onClick, target }: {
  href?: string; variant?: keyof typeof styles; children: React.ReactNode;
  onClick?: () => void; target?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-[transform,filter] duration-[var(--dur-micro)] [transition-timing-function:var(--ease-flow)] hover:-translate-y-0.5 ${styles[variant]}`;
  if (href) return <Link href={href} target={target} className={cls} onClick={onClick}>{children}</Link>;
  return <button className={cls} onClick={onClick}>{children}</button>;
}

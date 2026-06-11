"use client";
import { buildWaLink, fillTemplate } from "@/lib/wa";
import { track } from "@/lib/analytics";

export function WaMicroCta({ productTitle, slug, size, number, template }: {
  productTitle: string; slug: string; size?: string; number?: string; template?: string;
}) {
  const num = number ?? process.env.NEXT_PUBLIC_WA_NUMBER ?? "";
  const msg = fillTemplate(template ?? "Merhaba, {urun} ({olcu}) hakkında bilgi almak istiyorum. {url}", {
    urun: productTitle, olcu: size ?? "ölçü seçilmedi", url: `https://tulparcarpet.com/halilar/${slug}/`,
  });
  return (
    <a href={buildWaLink({ number: num, message: msg, refCode: `UD-${slug}` })} target="_blank" rel="noopener noreferrer"
      onClick={() => track("whatsapp_click", { context: "product", product_slug: slug })}
      className="text-sm text-gold underline-offset-4 hover:underline">WhatsApp&apos;tan Sor →</a>
  );
}

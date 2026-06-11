export function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}

export function buildWaLink(opts: { number: string; message: string; refCode?: string }): string {
  const text = opts.refCode ? `${opts.message}\n\nRef: ${opts.refCode}` : opts.message;
  return `https://wa.me/${opts.number}?text=${encodeURIComponent(text)}`;
}

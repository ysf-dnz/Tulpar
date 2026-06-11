type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void; }
}

export function track(event: "whatsapp_click" | "calculator_used" | "label_video_play" | "pano_viewed", params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  if (event === "whatsapp_click") window.fbq?.("track", "Contact", params);
}

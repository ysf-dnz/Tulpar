import type { Metadata } from "next";
import { Space_Grotesk, Figtree, IBM_Plex_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin", "latin-ext"], weight: ["500", "700"], variable: "--font-space-grotesk", display: "swap" });
const body = Figtree({ subsets: ["latin", "latin-ext"], weight: ["400", "500", "600"], variable: "--font-figtree", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tulparcarpet.com"),
  title: { default: "Tulpar Carpet — Mağazada Gördüğün, Evine Gelen Halıdır", template: "%s | Tulpar Carpet" },
  description: "Dürüst Etiket, 30 Gün Serili Dene ve Açık Şikayet Panosu ile radikal şeffaf D2C halı markası.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <body>
          {children}
          <AnalyticsScripts />
        </body>
      </html>
    </ViewTransitions>
  );
}

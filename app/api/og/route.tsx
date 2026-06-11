import { ImageResponse } from "next/og";
import { client } from "@/sanity/client";
import { PRODUCT_QUERY } from "@/lib/queries";
import { urlFor } from "@/lib/image";
import { stainScore } from "@/components/ui/StainBadge";

export const runtime = "edge";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  let p = null;
  try {
    p = slug ? await client.fetch(PRODUCT_QUERY, { slug }) : null;
  } catch {
    p = null; // Sanity yapılandırılmadıysa marka kartına düş
  }
  const minPrice = p ? Math.min(...p.sizeVariants.map((v: { priceTRY: number }) => v.priceTRY)) : null;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0E1322", color: "#F1EAD9", padding: 60 }}>
        {p && <img src={urlFor(p.heroImage).width(500).height(510).url()} width={500} height={510} style={{ borderRadius: 16, objectFit: "cover" }} />}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 48, gap: 16 }}>
          <div style={{ fontSize: 28, color: "#D9A441" }}>TULPAR CARPET</div>
          <div style={{ fontSize: 52, fontWeight: 700 }}>{p?.title ?? "Mağazada gördüğün, evine gelen halıdır."}</div>
          {p && <div style={{ fontSize: 32, color: "#D9A441" }}>{minPrice?.toLocaleString("tr-TR")} ₺&apos;den · LEKE {stainScore(p.honestLabel)}/4</div>}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

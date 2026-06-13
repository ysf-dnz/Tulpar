"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const CORNERS = ["tl", "tr", "bl", "br"] as const;

// Sayfa geçişinde kilim motifi ekranın ortasında belirir, dört köşeye
// savrularak kaybolur. Yalnız transform/opacity (FLW-06/10); reduced-motion
// kapsamı globals.css'te .page-scatter'ı gizliyor.
export function PageScatter() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const [active, setActive] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    // İlk yüklemede oynatma — yalnız gezinmede.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setRunId((n) => n + 1);
    setActive(true);
    const t = setTimeout(() => setActive(false), 800);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!active) return null;

  return (
    <div aria-hidden className="page-scatter" key={runId}>
      {CORNERS.map((c) => (
        <span
          key={c}
          className={`scatter-tile scatter-${c}`}
          style={{ "--motif-color": "url(/motifs/desen-color.svg)" } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";

export function LiteYouTube({ url, title }: { url: string; title: string }) {
  const [play, setPlay] = useState(false);
  const id = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1];
  if (!id) return null;
  if (play) return (
    <iframe className="aspect-video w-full rounded-xl" title={title} allow="autoplay; encrypted-media" allowFullScreen
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} />
  );
  return (
    <button onClick={() => { setPlay(true); track("label_video_play"); }}
      className="relative block aspect-video w-full overflow-hidden rounded-xl" aria-label={`${title} videosunu oynat`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={title} className="size-full object-cover" loading="lazy" />
      <span className="absolute inset-0 grid place-items-center bg-black/40">
        <span className="grid size-16 place-items-center rounded-full text-2xl text-cream [background:var(--grad-ember)]">▶</span>
      </span>
    </button>
  );
}

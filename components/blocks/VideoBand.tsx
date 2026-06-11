import { LiteYouTube } from "@/components/flow/LiteYouTube";

export function VideoBand({ b }: { b: { heading?: string; videoUrl: string } }) {
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto max-w-4xl space-y-8">
        {b.heading && <h2 className="font-display text-3xl">{b.heading}</h2>}
        <LiteYouTube url={b.videoUrl} title={b.heading ?? "Tulpar Carpet videosu"} />
      </div>
    </section>
  );
}

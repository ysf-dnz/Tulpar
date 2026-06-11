import Image from "next/image";
import { urlFor } from "@/lib/image";

export function InstagramStrip({ b }: { b: { posts?: { image: { alt?: string } & object; permalink: string }[] } }) {
  return (
    <section className="px-6 py-24 max-md:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-4">
        {(b.posts ?? []).map((post) => (
          <a key={post.permalink} href={post.permalink} target="_blank" rel="noopener noreferrer"
            className="card-premium group block overflow-hidden">
            <Image src={urlFor(post.image).width(480).height(480).url()} alt={post.image.alt ?? "Instagram gönderisi"}
              width={480} height={480}
              className="aspect-square w-full object-cover transition-transform duration-[var(--dur-element)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100" />
          </a>
        ))}
      </div>
    </section>
  );
}

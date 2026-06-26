import Image from "next/image";
import type { MediaAsset } from "@/types/content";

export function SpeciesMediaGallery({ gallery }: { gallery: MediaAsset[] }) {
  const images = gallery.filter((g) => g.kind === "image");
  const videos = gallery.filter((g) => g.kind === "youtube");

  return (
    <div className="space-y-6">
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, i) => (
            <figure
              key={img.url}
              className={`relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={img.url}
                  alt={img.caption}
                  fill
                  sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="px-3 py-2 text-xs text-ink-faint">
                {img.caption}
                {img.credit && <span className="opacity-70"> — {img.credit}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {videos.map((v) => (
        <figure key={v.url} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${v.url}`}
              title={v.caption}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <figcaption className="px-3 py-2 text-xs text-ink-faint">{v.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

import Image from "next/image";

import type { WorkCategory, WorkGalleryItem } from "@/app/types";

interface WorkGalleryGridProps {
  category: Pick<WorkCategory, "title" | "slug">;
  items: WorkGalleryItem[];
}

export default function WorkGalleryGrid({ category, items }: WorkGalleryGridProps) {
  if (items.length === 0) {
    return (
      <section className="border-t border-charcoal/15 pt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
              Gallery
            </span>
          </div>

          <div className="space-y-5 lg:col-span-8">
            <h2 className="font-heading text-4xl leading-[0.88] tracking-tight text-charcoal md:text-6xl">
              {category.title} is ready for its first published images.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 md:text-lg">
              This category route is live, but no visible gallery items have been published for
              <span className="font-medium text-charcoal"> {category.title}</span> yet.
            </p>
            <div className="border-t border-charcoal/10 pt-5">
              <span className="text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                /work/{category.slug}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-1">
      {items.map((item, index) => {
        const aspectClass =
          index % 4 === 0 ? "aspect-[4/5]" : index % 4 === 1 ? "aspect-[5/4]" : "aspect-[4/3]";

        return (
          <figure key={item.id} className={`group relative w-full overflow-hidden ${aspectClass}`}>
            <Image
              src={item.imageUrl}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, 88vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              priority={index === 0}
            />

            {(item.title || item.alt) && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-5 py-5 text-white">
                {item.title ? (
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-white/70">
                      {category.title}
                    </span>
                    <p className="font-heading text-2xl leading-none md:text-3xl">{item.title}</p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-white/90 md:text-base">{item.alt}</p>
                )}
              </figcaption>
            )}
          </figure>
        );
      })}
    </section>
  );
}

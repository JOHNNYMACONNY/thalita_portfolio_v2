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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
              Gallery
            </span>
          </div>

          <div className="space-y-8 lg:col-span-8">
            <div className="grid gap-6 border-b border-charcoal/10 pb-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:items-end">
              <h2 className="font-heading text-4xl leading-[0.9] tracking-tight text-charcoal sm:text-5xl md:text-6xl">
                {category.title} is ready for its first published images.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-charcoal/60 md:justify-self-end md:text-base">
                The route is already public, with its category identity, cover image, and gallery
                rhythm in place.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-8">
              <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 md:text-lg">
                No visible gallery items have been published for
                <span className="font-medium text-charcoal"> {category.title}</span> yet. Once an
                editor publishes the first image in Studio, it will appear here without changing
                the route structure.
              </p>

              <div className="grid gap-3 border-t border-charcoal/10 pt-5 text-[11px] uppercase tracking-[0.28em] text-charcoal/45 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                <span>/work/{category.slug}</span>
                <span>Zero visible images</span>
                <span>Awaiting first publication</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-12 md:gap-3">
      {items.map((item, index) => {
        const layoutClass =
          items.length === 1
            ? "md:col-span-12"
            : index % 5 === 0
              ? "md:col-span-7"
              : index % 5 === 1
                ? "md:col-span-5"
                : index % 5 === 2
                  ? "md:col-span-5"
                  : index % 5 === 3
                    ? "md:col-span-7"
                    : "md:col-span-12";
        const aspectClass =
          items.length === 1
            ? "aspect-[4/5] md:aspect-[16/10]"
            : index % 5 === 0
              ? "aspect-[4/5] md:aspect-[4/5]"
              : index % 5 === 1
                ? "aspect-[5/4] md:aspect-[5/6]"
                : index % 5 === 2
                  ? "aspect-[4/3] md:aspect-[5/4]"
                  : index % 5 === 3
                    ? "aspect-[4/5] md:aspect-[16/10]"
                    : "aspect-[4/3] md:aspect-[18/9]";

        return (
          <figure
            key={item.id}
            className={`group relative w-full overflow-hidden bg-stone-100 ${layoutClass} ${aspectClass}`}
          >
            <Image
              src={item.imageUrl}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 88vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              priority={index === 0}
            />

            {(item.title || item.alt) && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent px-4 py-4 text-white sm:px-5 sm:py-5">
                {item.title ? (
                  <div className="space-y-1">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-white/70">
                      {category.title}
                    </span>
                    <p className="font-heading text-xl leading-none sm:text-2xl md:text-3xl">
                      {item.title}
                    </p>
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

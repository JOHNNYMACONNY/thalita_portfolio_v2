"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { WorkGalleryItem } from "@/app/types";

interface HomeGalleryGridProps {
  items: WorkGalleryItem[];
}

export default function HomeGalleryGrid({ items }: HomeGalleryGridProps) {
  if (items.length === 0) {
    return (
      <section className="border-t border-charcoal/15 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
              Selected Work
            </span>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <h2 className="max-w-4xl font-heading text-4xl leading-[0.9] tracking-tight text-charcoal sm:text-5xl md:text-6xl">
              The home curation rail is ready for its next published selection.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 md:text-lg">
              When gallery items are marked for home display in Studio, they will appear here in
              the editorial order set by the published curation fields.
            </p>

            <div className="grid gap-4 border-t border-charcoal/10 pt-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div className="grid gap-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                <span>Zero curated home items</span>
                <span>Order controlled in Sanity</span>
                <span>Browse all work at /work</span>
              </div>

              <Link
                href="/work"
                className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-charcoal transition-colors duration-300 hover:text-magenta"
              >
                <span>Browse Work</span>
                <span className="block h-px w-10 bg-current transition-all duration-300 group-hover:w-14" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-10 border-t border-charcoal/15 pt-8 md:space-y-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-4 lg:col-span-4">
          <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
            Selected Work
          </span>
          <div className="grid gap-2 border-t border-charcoal/10 pt-5 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
            <span>{items.length} curated image{items.length === 1 ? "" : "s"}</span>
            <span>Ordered in Sanity</span>
            <span>Home preview of /work</span>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <h2 className="max-w-5xl font-heading text-4xl leading-[0.9] tracking-tight text-charcoal sm:text-5xl md:text-6xl lg:text-7xl">
            A curated first look at the new Work archive.
          </h2>

          <div className="grid gap-5 border-t border-charcoal/10 pt-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8">
            <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 md:text-lg">
              These images are pulled only from gallery items intentionally marked for the home
              page. The full category browse experience lives at{" "}
              <span className="text-charcoal">/work</span>.
            </p>

            <div className="flex items-end md:justify-end">
              <Link
                href="/work"
                className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-charcoal transition-colors duration-300 hover:text-magenta"
              >
                <span>Browse All Work</span>
                <span className="block h-px w-10 bg-current transition-all duration-300 group-hover:w-14" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-12 md:gap-3">
        {items.map((item, index) => {
          const layoutClass =
            items.length === 1
              ? "md:col-span-12"
              : index % 6 === 0
                ? "md:col-span-7"
                : index % 6 === 1
                  ? "md:col-span-5"
                  : index % 6 === 2
                    ? "md:col-span-4"
                    : index % 6 === 3
                      ? "md:col-span-8"
                      : index % 6 === 4
                        ? "md:col-span-5"
                        : "md:col-span-7";

          const aspectClass =
            items.length === 1
              ? "aspect-[4/5] md:aspect-[16/10]"
              : index % 6 === 0
                ? "aspect-[4/5] md:aspect-[4/5]"
                : index % 6 === 1
                  ? "aspect-[5/4] md:aspect-[5/6]"
                  : index % 6 === 2
                    ? "aspect-[4/3] md:aspect-[4/5]"
                    : index % 6 === 3
                      ? "aspect-[4/5] md:aspect-[16/10]"
                      : index % 6 === 4
                        ? "aspect-[5/4] md:aspect-[5/6]"
                        : "aspect-[4/3] md:aspect-[16/10]";

          return (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`${layoutClass}`}
            >
              <Link
                href={`/work/${item.category.slug}`}
                className={`group relative block w-full overflow-hidden bg-stone-100 ${aspectClass}`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 88vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  priority={index < 2}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 py-4 text-white sm:px-5 sm:py-5">
                  <div className="space-y-2">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-white/70">
                      {item.category.title}
                    </span>
                    <p className="max-w-md font-heading text-2xl leading-none sm:text-3xl md:text-4xl">
                      {item.title || item.alt}
                    </p>
                  </div>

                  <span className="hidden text-[10px] uppercase tracking-[0.28em] text-white/70 md:block">
                    /work/{item.category.slug}
                  </span>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

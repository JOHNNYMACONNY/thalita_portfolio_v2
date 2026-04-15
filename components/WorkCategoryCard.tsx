"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { WorkCategory } from "@/app/types";

interface WorkCategoryCardProps {
  category: WorkCategory;
  index: number;
}

export default function WorkCategoryCard({ category, index }: WorkCategoryCardProps) {
  const imageOrderClass = index % 2 === 0 ? "md:col-span-7" : "md:order-2 md:col-span-7";
  const contentOrderClass = index % 2 === 0 ? "md:col-span-5 md:py-2" : "md:order-1 md:col-span-5 md:py-2";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/work/${category.slug}`} className="block">
        <div className="grid grid-cols-1 gap-6 border-t border-charcoal/15 pt-6 md:grid-cols-12 md:gap-8 md:pt-8">
          <div className={`relative aspect-[4/5] overflow-hidden bg-stone-100 sm:aspect-[5/6] ${imageOrderClass}`}>
            <Image
              src={category.coverImageUrl}
              alt={category.coverAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-4 py-4 text-white sm:px-5">
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/75">
                {category.slug.replace(/-/g, " ")}
              </span>
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/75">
                Category {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className={`flex flex-col justify-between gap-6 ${contentOrderClass}`}>
            <div className="space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
                Category {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-heading text-4xl leading-[0.9] tracking-tight text-charcoal sm:text-5xl md:text-7xl">
                {category.title}
              </h2>
              <p className="max-w-md text-base leading-relaxed text-charcoal/70 md:text-lg">
                {category.description}
              </p>
            </div>

            <div className="grid gap-4 border-t border-charcoal/10 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="grid gap-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                <span>Browse the gallery</span>
                <span>/work/{category.slug}</span>
              </div>
              <span className="font-heading text-2xl leading-none text-charcoal transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl">
                Explore
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

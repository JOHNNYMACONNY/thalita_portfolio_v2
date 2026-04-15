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
          <div className="relative aspect-[4/5] overflow-hidden md:col-span-7">
            <Image
              src={category.coverImageUrl}
              alt={category.coverAlt}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="flex flex-col justify-between gap-6 md:col-span-5 md:py-2">
            <div className="space-y-4">
              <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
                Category {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="font-heading text-5xl leading-[0.88] tracking-tight text-charcoal md:text-7xl">
                {category.title}
              </h2>
              <p className="max-w-md text-base leading-relaxed text-charcoal/70 md:text-lg">
                {category.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-charcoal/10 pt-5">
              <span className="text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                Browse the gallery
              </span>
              <span className="font-heading text-2xl leading-none text-charcoal transition-transform duration-300 group-hover:translate-x-1">
                Explore
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

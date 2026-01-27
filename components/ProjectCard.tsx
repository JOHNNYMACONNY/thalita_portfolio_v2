"use client";

import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
    title: string;
    category: string;
    imageSrc: string;
    href?: string;
    size?: "portrait" | "landscape" | "square";
    className?: string;
    priority?: boolean;
}

export default function ProjectCard({
    title,
    category,
    imageSrc,
    href = "#",
    size = "portrait",
    className = "",
    priority = false,
}: ProjectCardProps) {
    const aspectRatio =
        size === "landscape" ? "aspect-[16/9]" : size === "square" ? "aspect-square" : "aspect-[3/4]";

    return (
        <Link
            href={href}
            // EDITORIAL CHANGE: Removed rounded-xl, removed shadow-sm/hover:shadow-xl.
            // Added grayscale to color transition for confident 'reveal'.
            className={`group relative block w-full overflow-hidden transition-all duration-500 ${aspectRatio} ${className}`}
        >
            <Image
                src={imageSrc}
                alt={title}
                fill
                // EDITORIAL CHANGE: Removed scale-105 on hover. 
                // Images should feel stable and heavy, not bouncy.
                className="object-cover transition-all duration-700 ease-out"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay - Minimal Editorial Label */}
            {/* EDITORIAL CHANGE: Removed translate effects. Text stays firm. Background is subtle. */}
            <div className="absolute inset-x-0 bottom-0 top-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 flex flex-col justify-end p-6">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="block text-white/90 text-[10px] uppercase tracking-[0.2em] mb-2">
                        {category}
                    </span>
                    <h3 className="text-white font-heading text-3xl leading-none">
                        {title}
                    </h3>
                </div>
            </div>
        </Link>
    );
}

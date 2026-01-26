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
            className={`group relative block w-full overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 ${aspectRatio} ${className}`}
        >
            <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay - Gradient Reveal */}
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-white/80 text-xs font-mono uppercase tracking-widest mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {category}
                </span>
                <h3 className="text-white font-heading text-2xl md:text-3xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {title}
                </h3>
            </div>
        </Link>
    );
}

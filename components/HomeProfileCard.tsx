"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HomeProfileCardProps {
    className?: string;
}

export default function HomeProfileCard({ className = "" }: HomeProfileCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`relative group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 ${className}`}
        >
            <Link href="/about" className="block h-full w-full relative">
                <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                {/* New Badge */}
                <div className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-charcoal/10">
                    <span className="text-xs font-bold uppercase tracking-widest text-charcoal">About</span>
                </div>

                <Image
                    src="/images/profile-photo.jpg"
                    alt="Thalita Bueno Profile"
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white/80 text-xs font-mono uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        Meet the Creative
                    </p>
                    <h3 className="font-heading text-3xl md:text-4xl text-white mb-2">
                        Profile & Bio
                    </h3>
                    <div className="h-px w-full bg-white/30 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200" />
                </div>
            </Link>
        </motion.div>
    );
}

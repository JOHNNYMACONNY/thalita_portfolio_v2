"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
    title?: string;
    subtitle?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
    return (
        <section className="flex flex-col items-center justify-center text-center min-h-[70vh] mb-24 pt-32 relative overflow-hidden">
            {/* Background Decorative Elements (Optional for 'Ethereal' feel) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-magenta/5 rounded-full blur-[100px] -z-10" />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-mocha text-lg md:text-xl tracking-[0.2em] uppercase font-medium mb-6"
            >
                {subtitle || "Fashion Stylist & Creative Director"}
            </motion.p>

            {title ? (
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-heading text-6xl md:text-8xl lg:text-9xl text-charcoal mb-8 max-w-5xl leading-[0.9]"
                >
                    {title}
                </motion.h1>
            ) : (
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="font-heading text-6xl md:text-8xl lg:text-9xl text-charcoal mb-8 max-w-5xl leading-[0.9]"
                >
                    Elevating Style
                    <br />
                    With Intentional
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta to-mocha bg-[length:200%_auto] animate-gradient">
                        Minimalism
                    </span>
                </motion.h1>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-10 flex flex-col md:flex-row items-center gap-8 md:gap-12"
            >
                {/* Primary CTA: View Work */}
                <Link
                    href="#portfolio"
                    className="group relative px-8 py-3 bg-charcoal text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-magenta"
                >
                    <span className="relative z-10 text-xs font-bold uppercase tracking-widest">
                        View Selected Works
                    </span>
                </Link>

                {/* Secondary CTA: Inquire */}
                <Link
                    href="/contact"
                    className="group relative inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition-colors duration-300"
                >
                    <span>Inquire</span>
                    <span className="block h-px w-8 bg-current group-hover:w-12 transition-all duration-300" />
                </Link>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">Scroll</span>
                <div className="w-px h-12 bg-charcoal/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-magenta/50 animate-scroll-down" />
                </div>
            </motion.div>
        </section>
    );
}

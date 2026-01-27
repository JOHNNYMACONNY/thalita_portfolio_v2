"use client";

import { useState } from "react";
import Link from "next/link";
import NavigationOverlay from "./NavigationOverlay";

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-40 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center bg-gradient-to-b from-white/10 to-transparent backdrop-blur-[2px]">
                {/* Logo / Name */}
                <Link href="/" className="z-50">
                    <h1 className="font-heading text-3xl md:text-5xl text-charcoal hover:text-magenta transition-colors duration-300">
                        Thalita Bueno
                    </h1>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                    <Link href="/#portfolio" className="text-sm font-bold uppercase tracking-widest text-charcoal hover:text-magenta transition-colors duration-300">
                        Work
                    </Link>
                    <Link href="/services" className="text-sm font-bold uppercase tracking-widest text-charcoal hover:text-magenta transition-colors duration-300">
                        Services
                    </Link>
                    <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-charcoal hover:text-magenta transition-colors duration-300">
                        About
                    </Link>
                </nav>

                {/* Menu Toggle */}
                <button
                    onClick={() => setIsNavOpen(true)}
                    className="z-50 group flex flex-col gap-1.5 p-2 md:hidden"
                    aria-label="Open Menu"
                >
                    <span className="w-8 h-0.5 bg-charcoal group-hover:bg-magenta transition-colors duration-300"></span>
                    <span className="w-8 h-0.5 bg-charcoal group-hover:bg-magenta transition-colors duration-300"></span>
                </button>
            </header>

            <NavigationOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
        </>
    );
}

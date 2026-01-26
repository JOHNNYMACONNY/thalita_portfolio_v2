"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function OverlayMenu() {
    const [isOpen, setIsOpen] = useState(false);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="text-sm font-bold uppercase tracking-widest hover:text-magenta transition-colors relative z-[70]"
            >
                {isOpen ? "Close" : "Menu"}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 h-[100dvh] bg-[#f8f1e4] z-[60] flex flex-col items-center justify-center overflow-y-auto"
                    >
                        <nav className="flex flex-col items-center gap-8">
                            <Link
                                href="/"
                                onClick={toggleMenu}
                                className="font-heading text-4xl md:text-5xl text-charcoal hover:text-mocha transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href="#portfolio"
                                onClick={toggleMenu}
                                className="font-heading text-4xl md:text-5xl text-charcoal hover:text-mocha transition-colors"
                            >
                                Portfolio
                            </Link>
                            <Link
                                href="#about"
                                onClick={toggleMenu}
                                className="font-heading text-4xl md:text-5xl text-charcoal hover:text-mocha transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="#contact"
                                onClick={toggleMenu}
                                className="font-heading text-4xl md:text-5xl text-charcoal hover:text-mocha transition-colors"
                            >
                                Contact
                            </Link>
                        </nav>

                        <div className="absolute bottom-12 text-center text-charcoal/40 text-xs uppercase tracking-widest">
                            <p>© 2025 Thalita Bueno</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface NavigationOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuVariants = {
    closed: {
        opacity: 0,
        y: "-100%",
        transition: {
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1] as const,
            staggerChildren: 0.1,
            staggerDirection: -1,
        },
    },
    open: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1] as const,
            staggerChildren: 0.1,
            delayChildren: 0.3,
        },
    },
};

const linkVariants = {
    closed: { y: 80, opacity: 0 },
    open: { y: 0, opacity: 1 },
};

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
    const pathname = usePathname();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="overlay"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-2 text-charcoal hover:text-magenta transition-colors duration-300"
                        aria-label="Close Menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-10 h-10"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Links */}
                    <nav className="flex flex-col items-center gap-6 text-center">
                        <NavLink href="/" label="Home" currentPath={pathname} onClick={onClose} />
                        <NavLink href="/#portfolio" label="Portfolio" currentPath={pathname} onClick={onClose} />
                        <NavLink href="/services" label="Services" currentPath={pathname} onClick={onClose} />
                        <NavLink href="/about" label="About" currentPath={pathname} onClick={onClose} />
                        <NavLink href="/contact" label="Contact" currentPath={pathname} onClick={onClose} />
                    </nav>

                    {/* Footer Info in Menu */}
                    <motion.div
                        variants={linkVariants}
                        className="absolute bottom-12 text-center"
                    >
                        <p className="text-charcoal/50 text-xs uppercase tracking-widest font-mono">
                            Thalita Bueno © {new Date().getFullYear()}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function NavLink({
    href,
    label,
    currentPath,
    onClick,
}: {
    href: string;
    label: string;
    currentPath: string;
    onClick: () => void;
}) {
    const isActive = currentPath === href;

    return (
        <motion.div variants={linkVariants} className="overflow-hidden">
            <Link
                href={href}
                onClick={onClick}
                className={`block font-heading text-5xl md:text-7xl transition-all duration-300 hover:text-magenta hover:skew-x-[-10deg] ${isActive ? "text-magenta" : "text-charcoal"
                    }`}
            >
                {label}
            </Link>
        </motion.div>
    );
}

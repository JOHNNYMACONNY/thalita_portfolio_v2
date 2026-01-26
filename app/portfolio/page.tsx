"use client";

import { useState } from "react";





import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";

// Mock Data from Scrape (Updated images to local assets or valid placeholders for demo if needed, keeping originals for now but using new Card logic)
// Mapping "image" to "imageSrc" format of ProjectCard if needed, or refactoring Card to accept this object.
// We'll map the data in render.

// ... keeping existing data array ...
const PROJECTS = [
    {
        id: 1,
        title: "Editorial Fashion Shoot",
        category: "Fashion",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_3639_tuyuj8.jpg"
    },
    {
        id: 2,
        title: "Designer Collaboration",
        category: "Fashion",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_8419_nfc31z.jpg"
    },
    {
        id: 3,
        title: "Urban Minimalist",
        category: "Fashion",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_4795_ssnily.jpg"
    },
    {
        id: 4,
        title: "Brand Campaign Styling",
        category: "Commercial",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/2u0a9726_o53loh.jpg"
    },
    {
        id: 5,
        title: "Vogue Street Style",
        category: "Fashion",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_8416_asoj9o.jpg"
    },
    {
        id: 6,
        title: "Commercial Lookbook",
        category: "Commercial",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_8409_rrao1d.jpg"
    },
    {
        id: 7,
        title: "Fashion Editorial",
        category: "Fashion",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_4794_patogo.jpg"
    },
    {
        id: 8,
        title: "Runway Show Look",
        category: "Fashion",
        image: "https://res.cloudinary.com/doqqhj2nt/image/upload/c_fill,g_auto,f_auto,q_auto:good/portfolio/fashion/IMG_6049_gtllgy.png"
    }
];

const TABS = ["All Work", "Fashion", "Commercial"];

export default function Portfolio() {
    const [activeTab, setActiveTab] = useState("All Work");

    const filteredProjects = activeTab === "All Work"
        ? PROJECTS
        : PROJECTS.filter(p => p.category === activeTab);

    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white pb-24">
            <Header />

            <main className="flex flex-col items-center w-full pt-32 pb-24 px-4 max-w-[1600px] mx-auto">
                <h1 className="font-heading text-5xl md:text-7xl text-charcoal mb-12 text-center">Portfolio</h1>

                {/* Filter Tabs */}
                <div className="flex gap-8 mb-16 text-sm uppercase tracking-widest font-bold">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 transition-all duration-300 border-b-2 ${activeTab === tab
                                ? "text-charcoal border-charcoal"
                                : "text-charcoal/40 border-transparent hover:text-charcoal"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full animate-in fade-in duration-700">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            title={project.title}
                            category={project.category}
                            imageSrc={project.image}
                            size="portrait"
                        />
                    ))}
                </div>

                {/* Footer */}
                <footer className="w-full py-12 text-center text-charcoal/60 text-xs uppercase tracking-widest mt-12 border-t border-charcoal/10">
                    <p>© 2025 Thalita Bueno. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}

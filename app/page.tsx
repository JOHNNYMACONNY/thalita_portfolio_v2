import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HomeProfileCard from "@/components/HomeProfileCard";
import PortfolioGrid from "@/components/PortfolioGrid";
import Footer from "@/components/Footer";

import { getProjects, getSiteSettings } from "@/lib/api";

export default function Home() {
  const projects = getProjects();
  const siteSettings = getSiteSettings();

  return (
    <div className="min-h-screen selection:bg-magenta selection:text-white">
      <Header />

      <main className="w-full pt-32 pb-24 px-4 md:px-12 max-w-[1600px] mx-auto">

        {/* Hero Section */}
        <Hero title={siteSettings.heroTitle} subtitle={siteSettings.heroSubtitle} />

        {/* Portfolio Grid - Masonry Style */}
        <section id="portfolio" className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 w-full">

            {/* Item 1 - Big Right */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <PortfolioGrid projects={projects} />
            </div>

            {/* Item 2 - Tall Left */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <HomeProfileCard className="h-full min-h-[500px]" />
              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-xl border border-white/60 shadow-sm flex flex-col justify-center h-full">
                <h3 className="font-heading text-3xl mb-4 text-mocha">Let's Create</h3>
                <p className="text-charcoal/80 mb-6 text-sm leading-relaxed">
                  Specializing in editorial styling, commercial campaigns, and personal wardrobe curation.
                </p>
                <Link href="/contact" className="self-start text-xs font-bold uppercase tracking-widest border-b border-charcoal pb-1 hover:text-magenta hover:border-magenta transition-colors">
                  Get In Touch
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Footer Minimal */}
        <Footer email={siteSettings.email} socials={siteSettings.socials} />

      </main>
    </div>
  );
}

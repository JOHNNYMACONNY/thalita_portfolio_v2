import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
          <div className="w-full">
            <PortfolioGrid projects={projects} />
          </div>
        </section>

        {/* Footer Minimal */}
        <Footer email={siteSettings.email} socials={siteSettings.socials} />

      </main>
    </div>
  );
}

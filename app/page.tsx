import Header from "@/components/Header";
import HomeGalleryGrid from "@/components/HomeGalleryGrid";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

import { getSiteSettings } from "@/lib/api";
import { getHomeGalleryItems } from "@/sanity/lib/work";

export default async function Home() {
  const [homeGalleryItems, siteSettings] = await Promise.all([
    getHomeGalleryItems(),
    Promise.resolve(getSiteSettings()),
  ]);

  return (
    <div className="min-h-screen selection:bg-magenta selection:text-white">
      <Header />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-24 pt-32 md:px-12">
        <Hero title={siteSettings.heroTitle} subtitle={siteSettings.heroSubtitle} />

        <section className="mb-32">
          <HomeGalleryGrid items={homeGalleryItems} />
        </section>

        <Footer email={siteSettings.email} socials={siteSettings.socials} />
      </main>
    </div>
  );
}

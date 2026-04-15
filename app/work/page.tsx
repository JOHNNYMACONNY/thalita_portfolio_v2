import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WorkCategoryCard from "@/components/WorkCategoryCard";
import { getSiteSettings } from "@/lib/api";
import { getWorkCategories } from "@/sanity/lib/work";

export default async function WorkLandingPage() {
  const [categories, siteSettings] = await Promise.all([
    getWorkCategories(),
    Promise.resolve(getSiteSettings()),
  ]);

  return (
    <div className="min-h-screen selection:bg-magenta selection:text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-14 px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:gap-20 md:px-12 md:pt-32">
        <section className="grid grid-cols-1 gap-8 border-t border-charcoal/15 pt-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
              Work
            </span>

            <div className="hidden border-t border-charcoal/10 pt-5 text-[11px] uppercase tracking-[0.28em] text-charcoal/45 lg:grid lg:grid-cols-1 lg:gap-3">
              <span>{categories.length} published categories</span>
              <span>Sanity-backed selection</span>
              <span>/work</span>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <h1 className="max-w-5xl font-heading text-5xl leading-[0.86] tracking-tight text-charcoal sm:text-6xl md:text-8xl lg:text-9xl">
              Three bodies of work, one editorial language.
            </h1>

            <div className="grid grid-cols-1 gap-5 border-t border-charcoal/10 pt-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8">
              <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 sm:text-lg md:text-xl">
                Explore Thalita&apos;s published categories through image-led selections curated in
                Sanity. Each route opens a dedicated gallery without reviving the old project-story
                structure.
              </p>

              <div className="grid gap-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/45 lg:hidden">
                <span>{categories.length} published categories</span>
                <span>Sanity-backed selection</span>
                <span>/work</span>
              </div>
            </div>
          </div>
        </section>

        {categories.length > 0 ? (
          <section className="flex flex-col gap-14 md:gap-18">
            {categories.map((category, index) => (
              <WorkCategoryCard key={category.id} category={category} index={index} />
            ))}
          </section>
        ) : (
          <section className="border-t border-charcoal/15 pt-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
                  Publishing
                </span>
              </div>

              <div className="space-y-6 lg:col-span-8">
                <h2 className="max-w-3xl font-heading text-4xl leading-[0.9] tracking-tight text-charcoal sm:text-5xl md:text-6xl">
                  The category index is live and waiting on its first published set.
                </h2>
                <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 md:text-lg">
                  Once the three category documents are published in Studio, they will appear here
                  automatically with their cover images and route links.
                </p>
                <div className="border-t border-charcoal/10 pt-5 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                  Seed categories in Studio before moving into gallery verification
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer email={siteSettings.email} socials={siteSettings.socials} />
      </main>
    </div>
  );
}

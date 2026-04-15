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

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-4 pb-24 pt-32 md:gap-24 md:px-12">
        <section className="grid grid-cols-1 gap-8 border-t border-charcoal/15 pt-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
              Work
            </span>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <h1 className="max-w-4xl font-heading text-6xl leading-[0.84] tracking-tight text-charcoal md:text-8xl lg:text-9xl">
              Three bodies of work, one editorial language.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-charcoal/70 md:text-xl">
              Explore Thalita&apos;s published categories through image-led selections curated in
              Sanity. Each route opens a dedicated gallery without reviving the old project-story
              structure.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-14 md:gap-18">
          {categories.map((category, index) => (
            <WorkCategoryCard key={category.id} category={category} index={index} />
          ))}
        </section>

        <Footer email={siteSettings.email} socials={siteSettings.socials} />
      </main>
    </div>
  );
}

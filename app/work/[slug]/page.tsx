
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WorkGalleryGrid from "@/components/WorkGalleryGrid";
import { getSiteSettings } from "@/lib/api";
import { getGalleryItemsByCategorySlug, getWorkCategories } from "@/sanity/lib/work";

export async function generateStaticParams() {
  const categories = await getWorkCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function WorkCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, siteSettings] = await Promise.all([
    getWorkCategories(),
    Promise.resolve(getSiteSettings()),
  ]);

  const category = categories.find((entry) => entry.slug === slug);
  if (!category) {
    notFound();
  }

  const galleryItems = await getGalleryItemsByCategorySlug(category.slug);

  return (
    <div className="min-h-screen selection:bg-magenta selection:text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-4 pb-24 pt-32 md:gap-24 md:px-12">
        <section className="grid grid-cols-1 gap-8 border-t border-charcoal/15 pt-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link
              href="/work"
              className="text-[11px] uppercase tracking-[0.28em] text-charcoal/55 transition-colors hover:text-magenta"
            >
              ← Back to Work
            </Link>
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-charcoal/45">
              Category Gallery
            </span>
          </div>

          <div className="space-y-6 lg:col-span-8">
            <h1 className="max-w-4xl font-heading text-6xl leading-[0.84] tracking-tight text-charcoal md:text-8xl lg:text-9xl">
              {category.title}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-charcoal/70 md:text-xl">
              {category.description}
            </p>
            <div className="flex flex-wrap gap-4 border-t border-charcoal/10 pt-5 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
              <span>{galleryItems.length} visible image{galleryItems.length === 1 ? "" : "s"}</span>
              <span>/work/{category.slug}</span>
            </div>
          </div>
        </section>

        <WorkGalleryGrid category={category} items={galleryItems} />

        <Footer email={siteSettings.email} socials={siteSettings.socials} />
      </main>
    </div>
  );
}

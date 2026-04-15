import Image from "next/image";
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

      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-14 px-4 pb-24 pt-24 sm:px-6 sm:pt-28 md:gap-20 md:px-12 md:pt-32">
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
            <h1 className="max-w-5xl font-heading text-5xl leading-[0.86] tracking-tight text-charcoal sm:text-6xl md:text-8xl lg:text-9xl">
              {category.title}
            </h1>

            <div className="grid grid-cols-1 gap-6 border-t border-charcoal/10 pt-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-8">
              <p className="max-w-2xl text-base leading-relaxed text-charcoal/70 sm:text-lg md:text-xl">
                {category.description}
              </p>

              <div className="grid gap-2 text-[11px] uppercase tracking-[0.28em] text-charcoal/45">
                <span>
                  {galleryItems.length === 0 ? "Awaiting first publication" : "Published selection"}
                </span>
                <span>
                  {galleryItems.length} visible image{galleryItems.length === 1 ? "" : "s"}
                </span>
                <span>/work/{category.slug}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="hidden border-t border-charcoal/10 pt-5 text-[11px] uppercase tracking-[0.28em] text-charcoal/45 lg:grid lg:gap-3">
              <span>Category cover</span>
              <span>{galleryItems.length === 0 ? "Zero-item state verified here" : "Gallery now populated"}</span>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 sm:aspect-[3/2] lg:aspect-[16/9]">
              <Image
                src={category.coverImageUrl}
                alt={category.coverAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-5 py-5 text-white sm:px-8 sm:py-8">
                <span className="text-[10px] uppercase tracking-[0.32em] text-white/75">
                  {galleryItems.length === 0 ? "Category cover before first publish" : "Published category view"}
                </span>
                <p className="max-w-2xl font-heading text-3xl leading-[0.92] sm:text-4xl md:text-5xl">
                  {galleryItems.length === 0
                    ? "The route is live and ready for its first visible image."
                    : "Published images are now held inside the category gallery below."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <WorkGalleryGrid category={category} items={galleryItems} />

        <Footer email={siteSettings.email} socials={siteSettings.socials} />
      </main>
    </div>
  );
}


import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectNavigation from "@/components/ProjectNavigation";
import { getProjects, getSiteSettings } from "@/lib/api";

// Generate static params for all projects
export async function generateStaticParams() {
    const projects = getProjects();
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export default async function ProjectDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const slug = (await params).slug;
    const allProjects = getProjects();
    const siteSettings = getSiteSettings();
    const projectIndex = allProjects.findIndex(p => p.slug === slug);
    const project = allProjects[projectIndex];

    const nextProject = projectIndex >= 0 && projectIndex < allProjects.length - 1
        ? allProjects[projectIndex + 1]
        : null;

    if (!project) {
        notFound();
    }

    const otherImages = project.images;

    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white pb-24">
            <Header />

            <main className="pt-32 px-4 md:px-12 max-w-[1600px] mx-auto w-full">

                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/#portfolio" className="text-xs uppercase tracking-widest text-charcoal/60 hover:text-magenta transition-colors">
                        ← Back to Work
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32 md:mb-48">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col justify-start pt-12 lg:pt-0">
                        {/* EDITORIAL CHANGE: Scale is Authority. 8xl/9xl for maximum impact. Tight leading. */}
                        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-charcoal mb-8 leading-[0.85] tracking-tight">
                            {project.title}
                        </h1>
                        <div className="space-y-8 text-charcoal/80 leading-relaxed max-w-lg">
                            <p className="text-xl md:text-2xl font-light">{project.description}</p>

                            {/* Role / Client / Year */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-8 py-8 border-t border-charcoal/30">
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Role</h3>
                                    <p className="text-sm font-medium">{project.role}</p>
                                </div>
                                {project.client && (
                                    <div>
                                        <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Client</h3>
                                        <p className="text-sm font-medium">{project.client}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Year</h3>
                                    <p className="text-sm font-medium">{project.year}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-2">Categories</h3>
                                    <div className="text-sm font-medium">
                                        {project.categories.join(", ")}
                                    </div>
                                </div>
                            </div>

                            {/* Credits */}
                            {project.credits.length > 0 && (
                                <div className="border-t border-charcoal/30 pt-8">
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal/40 mb-4">Team & Credits</h3>
                                    <ul className="space-y-2 text-sm">
                                        {project.credits.map((credit, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-charcoal/40">{credit.role}</span>
                                                <span className="font-medium">{credit.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hero Image */}
                    {/* EDITORIAL CHANGE: Removed rounded-xl. Sharp edges only. */}
                    {project.coverImage && (
                        <div className="order-1 lg:order-2 lg:col-span-8 relative aspect-[3/4] lg:aspect-auto lg:h-[90vh] w-full overflow-hidden">
                            <Image
                                src={project.coverImage}
                                alt={project.coverAlt || project.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 66vw"
                            />
                        </div>
                    )}
                </div>

                {/* Additional Images Grid (Editorial Spread) */}
                {/* EDITORIAL CHANGE: Removed space-y-12. Used grid gap-1 for a cohesive sheet look. */}
                {otherImages.length > 0 && (
                    <section className="grid grid-cols-1 gap-1">
                        {otherImages.map((img, idx) => (
                            // EDITORIAL CHANGE: Removed aspect ratio constraints to allow natural image flow if needed, 
                            // but keeping square/wide formatting for rhythm.
                            // Removed rounded-xl.
                            <div key={idx} className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </section>
                )}

                {/* Footer Nav */}
                <div className="border-t border-charcoal/10 pt-12 flex flex-col md:flex-row justify-between items-center pb-12 gap-8">
                    <Link href="/#portfolio" className="text-lg font-heading hover:text-magenta transition-colors order-2 md:order-1">
                        View All Projects
                    </Link>

                    <div className="order-1 md:order-2">
                        <Link href="/contact" className="px-8 py-4 bg-charcoal text-white rounded-lg hover:bg-magenta transition-colors uppercase tracking-widest text-xs font-bold">
                            Inquire
                        </Link>
                    </div>
                </div>

                {/* Next Project Flow */}
                <ProjectNavigation nextProject={nextProject} />

                <Footer email={siteSettings.email} socials={siteSettings.socials} />

            </main>
        </div>
    );
}


import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/api";
import Header from "@/components/Header";

function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

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
    const project = getProjectBySlug(slug);

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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1 lg:col-span-4 flex flex-col justify-end">
                        <h1 className="font-heading text-5xl md:text-7xl text-charcoal mb-6 leading-tight">
                            {project.title}
                        </h1>
                        <div className="space-y-6 text-charcoal/80 leading-relaxed max-w-lg">
                            <p className="text-lg">{project.description}</p>

                            {/* Role / Client / Year */}
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-charcoal/10">
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-mocha mb-1">Role</h3>
                                    <p className="text-sm">{project.role}</p>
                                </div>
                                {project.client && (
                                    <div>
                                        <h3 className="text-xs uppercase tracking-widest font-bold text-mocha mb-1">Client</h3>
                                        <p className="text-sm">{project.client}</p>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-mocha mb-1">Year</h3>
                                    <p className="text-sm">{project.year}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-mocha mb-1">Categories</h3>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {project.categories.map(cat => (
                                            <span key={cat} className="bg-charcoal/5 px-2 py-1 rounded-sm text-xs">{cat}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Credits */}
                            {project.credits.length > 0 && (
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-mocha mb-2">Team & Credits</h3>
                                    <ul className="space-y-1 text-sm">
                                        {project.credits.map((credit, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-charcoal/60">{credit.role}:</span>
                                                <span>{credit.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hero Image */}
                    {project.coverImage && (
                        <div className="order-1 lg:order-2 lg:col-span-8 relative aspect-[4/5] lg:aspect-auto lg:h-[80vh] w-full overflow-hidden rounded-xl">
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

                {/* Additional Images Grid (Masonry-ish) */}
                {otherImages.length > 0 && (
                    <section className="space-y-12">
                        {otherImages.map((img, idx) => (
                            <div key={idx} className="relative w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-xl">
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
                <div className="mt-32 border-t border-charcoal/10 pt-12 flex justify-between items-center pb-12">
                    <Link href="/#portfolio" className="text-lg font-heading hover:text-magenta transition-colors">
                        View All Projects
                    </Link>
                    <Link href="/contact" className="px-6 py-3 bg-charcoal text-white rounded-lg hover:bg-magenta transition-colors">
                        Book This Style
                    </Link>
                </div>

            </main>
        </div>
    );
}

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAboutContent, getSiteSettings } from "@/lib/api";

export default function About() {
    const content = getAboutContent();
    const settings = getSiteSettings();
    const bioParagraphs = content.bio.split('\n\n');

    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white">
            <Header />

            <main className="pt-32 px-4 max-w-6xl mx-auto w-full pb-24">
                <div className="animate-fade-in-up">
                    <h1 className="font-heading text-5xl md:text-7xl text-charcoal mb-12 text-center">About Me</h1>

                    {/* Bento Grid layout matching new aesthetic */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">

                        {/* 1. Intro Card (Large, Span 2) */}
                        <div className="md:col-span-2 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/60 shadow-sm flex flex-col justify-center">
                            <h2 className="font-heading text-3xl text-mocha mb-6">My Journey</h2>
                            {bioParagraphs.map((paragraph, idx) => (
                                <p key={idx} className={`text-lg leading-relaxed text-charcoal/80 ${idx < bioParagraphs.length - 1 ? 'mb-6' : ''}`}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* 2. Photo Card (Span 1, Row 2) */}
                        <div className="bg-white/20 rounded-2xl overflow-hidden relative min-h-[400px]">
                            <Image src="/images/profile-photo.jpg" alt="Thalita Bueno" fill className="object-cover hover:scale-105 transition-transform duration-700" />
                        </div>

                        {/* 3. Philosophy (Span 1) */}
                        <div className="bg-gradient-to-br from-magenta/10 to-transparent backdrop-blur-sm p-8 rounded-2xl border border-magenta/20 flex flex-col justify-center">
                            <h2 className="font-heading text-2xl text-magenta mb-4">Philosophy</h2>
                            <blockquote className="text-xl italic font-caooli leading-relaxed text-charcoal">
                                &quot;Fashion is not just about what you wear, but about the story you tell. It&apos;s about purpose, confidence, and authenticity.&quot;
                            </blockquote>
                        </div>

                        {/* 4. Career Highlights (Span 1) */}
                        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-white/60 shadow-sm">
                            <h2 className="font-heading text-2xl text-charcoal mb-6">Experience</h2>
                            <ul className="space-y-4 text-sm uppercase tracking-widest text-charcoal/70 font-bold">
                                {content.experience.map((exp, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-magenta rounded-full"></span>
                                        {exp.company}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 5. Services & Education (Span 2) */}
                        <div className="md:col-span-2 bg-white/40 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/60 shadow-sm flex flex-col md:flex-row gap-12">
                            <div className="flex-1">
                                <h2 className="font-heading text-2xl text-charcoal mb-6">Services</h2>
                                <div className="space-y-6">
                                    {content.services.map((service, idx) => (
                                        <div key={idx}>
                                            <h3 className="font-bold text-lg mb-1 text-mocha">{service.title}</h3>
                                            <p className="text-charcoal/70 text-sm">{service.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full h-px bg-charcoal/10 md:w-px md:h-auto md:bg-charcoal/10"></div>

                            <div className="flex-1">
                                <h2 className="font-heading text-2xl text-charcoal mb-6">Education</h2>
                                {content.education.map((edu, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-bold text-lg">{edu.institution}</h3>
                                        <p className="text-sm uppercase tracking-wider text-magenta font-semibold mb-2">{edu.location}</p>
                                        <p className="text-charcoal/70">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* CTA */}
                    <div className="mt-24 text-center">
                        <Link href="/contact" className="inline-block px-10 py-4 rounded-lg bg-charcoal text-white font-heading text-xl hover:bg-magenta transition-colors duration-300 shadow-lg hover:shadow-xl">
                            Let&apos;s Collaborate
                        </Link>
                    </div>
                </div>
            </main>

            <Footer email={settings.email} socials={settings.socials} />
        </div>
    );
}

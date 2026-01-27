import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAboutContent, getSiteSettings } from "@/lib/api";

export default function About() {
    const content = getAboutContent();
    const settings = getSiteSettings();
    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white pb-24">
            <Header />

            <main className="pt-32 px-4 md:px-12 max-w-[1600px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                    {/* 1. Image (Left/Top) */}
                    <div className="lg:col-span-5 order-1">
                        <div className="relative aspect-[3/4] w-full overflow-hidden">
                            <Image
                                src="/images/profile-photo.jpg"
                                alt="Thalita Bueno"
                                fill
                                className="object-cover transition-all duration-1000 ease-out"
                                priority
                            />
                        </div>
                    </div>

                    {/* 2. Content (Right) */}
                    <div className="lg:col-span-7 order-2 flex flex-col justify-center lg:pt-12">
                        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-charcoal mb-12 leading-[0.85]">
                            About
                        </h1>

                        <div className="space-y-8 text-xl md:text-2xl font-light text-charcoal/80 leading-relaxed max-w-2xl">
                            I&apos;m Thalita, a wardrobe stylist and marketing professional based in the US.
                            With a keen eye for detail and a passion for storytelling through fashion,
                            I&apos;ve dedicated my career to creating compelling visual narratives.
                            <br /><br />
                            My work bridges the gap between creative vision and market strategy,
                            ensuring that every look not only inspires but also resonates with its audience.
                            Whether it&apos;s for editorial spreads, commercial campaigns, or personal styling,
                            I bring a sophisticated and modern aesthetic to every project.
                        </div>

                        {/* Signature / Philosophy as subtle footer */}
                        <div className="pt-12 border-t border-charcoal/10">
                            <p className="text-sm font-medium tracking-widest uppercase text-charcoal/40 mb-4">
                                Philosophy
                            </p>
                            <p className="text-lg md:text-xl italic font-serif text-charcoal/60">
                                &quot;Style is the intentional arrangement of reality.&quot;
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 mt-24">
                <Footer email={settings.email} socials={settings.socials} />
            </div>
        </div>
    );
}

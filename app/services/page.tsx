import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings, getServicesContent } from "@/lib/api";

export default function ServicesPage() {
    const siteSettings = getSiteSettings();
    const content = getServicesContent();
    const services = content.services;

    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white pb-24">
            <Header />

            <main className="pt-32 px-4 md:px-12 max-w-[1600px] mx-auto w-full">
                {/* Page Title */}
                <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl text-charcoal mb-24 md:mb-32">
                    {content.title}
                </h1>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-8">
                    {services.map((service, idx) => (
                        <div key={idx} className="flex flex-col gap-8">
                            <h2 className="font-heading text-3xl md:text-4xl text-charcoal border-b border-charcoal/10 pb-4">
                                {service.category}
                            </h2>
                            <ul className="space-y-4">
                                {service.items.map((item, i) => (
                                    <li key={i} className="text-xl md:text-2xl font-light text-charcoal/80">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-32 md:mt-48 pt-12 border-t border-charcoal/10">
                    <p className="text-lg md:text-xl font-light text-charcoal/60 mb-8 max-w-2xl">
                        {content.ctaText}
                    </p>
                    <a href="/contact" className="inline-block px-12 py-5 bg-charcoal text-white text-xs font-bold uppercase tracking-widest hover:bg-magenta transition-colors">
                        Inquire for Rates
                    </a>
                </div>

            </main>

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 mt-24">
                <Footer email={siteSettings.email} socials={siteSettings.socials} />
            </div>
        </div>
    );
}

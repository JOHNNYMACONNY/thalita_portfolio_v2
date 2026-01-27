import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/api";

export default function Contact() {
    const settings = getSiteSettings();

    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white pb-24">
            <Header />

            <main className="pt-32 px-4 max-w-4xl mx-auto w-full flex flex-col items-center">

                {/* Contact Card */}
                <div className="w-full max-w-2xl bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg overflow-hidden animate-in fade-in duration-700 slide-in-from-bottom-8">

                    {/* Header Box */}
                    <div className="bg-white/50 p-8 text-center border-b border-white/20">
                        <h1 className="font-heading text-4xl text-charcoal mb-4">Send a Message</h1>
                        <p className="text-charcoal/80 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                            Fill out the form below and I&apos;ll get back to you as soon as possible.
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="p-8 md:p-12">
                        <ContactForm />
                    </div>
                </div>

                {/* Social Connect */}
                <div className="mt-16 flex flex-col items-center">
                    <h3 className="font-heading text-2xl text-charcoal mb-6">Connect</h3>
                    <div className="flex gap-8">
                        {settings.socials.map(social => (
                            <Link key={social.platform} href={social.url} className="text-charcoal hover:text-magenta transition-colors">
                                <span className="sr-only">{social.label || social.platform}</span>
                                <span className="text-sm font-bold uppercase tracking-widest">{social.platform}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </main>

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12">
                <Footer email={settings.email} socials={settings.socials} />
            </div>
        </div>
    );
}

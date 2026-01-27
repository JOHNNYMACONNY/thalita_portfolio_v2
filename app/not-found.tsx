import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/api";

export default function NotFound() {
    const siteSettings = getSiteSettings();

    return (
        <div className="min-h-screen selection:bg-magenta selection:text-white flex flex-col justify-between">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center px-4">
                <h1 className="font-heading text-9xl md:text-[12rem] text-charcoal leading-none mb-4">
                    404
                </h1>
                <p className="text-xl font-light text-charcoal/60 mb-8 tracking-wide">
                    Page Not Found
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 border border-charcoal/20 rounded-full hover:bg-charcoal hover:text-white transition-all uppercase tracking-widest text-xs"
                >
                    Return Home
                </Link>
            </main>

            <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12">
                <Footer email={siteSettings.email} socials={siteSettings.socials} />
            </div>
        </div>
    );
}

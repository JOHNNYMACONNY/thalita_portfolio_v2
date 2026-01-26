import Link from 'next/link';
import { SocialLink } from '@/app/types';

interface FooterProps {
    email: string;
    socials: SocialLink[];
}

export default function Footer({ email, socials }: FooterProps) {
    return (
        <footer className="w-full border-t border-charcoal/10 pt-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest text-charcoal/60">
            <p>© {new Date().getFullYear()} Thalita Bueno. All rights reserved.</p>
            <div className="flex gap-8">
                {socials.map((social) => (
                    <Link key={social.platform} href={social.url} className="hover:text-magenta transition-colors">
                        {social.platform}
                    </Link>
                ))}
                <Link href={`mailto:${email}`} className="hover:text-magenta transition-colors">
                    Email
                </Link>
            </div>
        </footer>
    );
}

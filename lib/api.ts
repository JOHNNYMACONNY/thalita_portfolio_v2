import fs from 'fs';
import path from 'path';
import { SiteConfig, AboutContent } from '@/app/types';

const contentDirectory = path.join(process.cwd(), 'content');

// Helper to read JSON files
function readJsonFile<T>(filePath: string): T {
    const fullPath = path.join(contentDirectory, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
}

// --- Site Settings ---

export interface CMSSiteSettings extends SiteConfig {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
}

export function getSiteSettings(): CMSSiteSettings {
    const settings = readJsonFile<unknown>('settings/site.json');

    // Merge with hardcoded nav since navigation isn't in CMS yet (or kept hardcoded for safety)
    return {
        ...(settings as CMSSiteSettings),
        nav: [
            { label: "Home", path: "/" },
            { label: "Work", path: "/work" },
            { label: "Services", path: "/services" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
        ]
    };
}

// --- Services Page ---

export interface ServiceCategory {
    category: string;
    items: string[];
}

export interface ServicesContent {
    title: string;
    services: ServiceCategory[];
    ctaText: string;
}

export function getServicesContent(): ServicesContent {
    return readJsonFile<ServicesContent>('settings/services.json');
}

// --- About Page ---

export function getAboutContent(): AboutContent {
    return readJsonFile<AboutContent>('settings/about.json');
}

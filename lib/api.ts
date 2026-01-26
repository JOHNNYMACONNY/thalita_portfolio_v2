import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { SiteConfig, AboutContent, Project } from '@/app/types';

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
    const settings = readJsonFile<any>('settings/site.json');

    // Merge with hardcoded nav since navigation isn't in CMS yet (or kept hardcoded for safety)
    return {
        ...settings,
        nav: [
            { label: "Home", path: "/" },
            { label: "Work", path: "/#portfolio" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contact" },
        ]
    };
}

// --- About Page ---

export function getAboutContent(): AboutContent {
    return readJsonFile<AboutContent>('settings/about.json');
}

// --- Projects ---

const projectsDirectory = path.join(contentDirectory, 'projects');

export function getProjects(): Project[] {
    const fileNames = fs.readdirSync(projectsDirectory);
    const allProjects = fileNames
        .filter(fileName => fileName.endsWith('.md') && !fileName.startsWith('.'))
        .map((fileName) => {
            // Read markdown file as string
            const fullPath = path.join(projectsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            // Use gray-matter to parse the post metadata section
            const { data, content } = matter(fileContents);

            // Normalize categories (could be legacy tags or category field)
            let categories: string[] = [];
            if (data.categories && Array.isArray(data.categories)) {
                categories = data.categories;
            } else if (data.category) {
                // Handle legacy single category or array
                categories = Array.isArray(data.category) ? data.category : [data.category];
            } else if (data.tags) {
                categories = data.tags;
            }

            // Fallback for coverImage if missing (legacy data) in runtime (though we will update files)
            const coverImage = data.coverImage || (data.gallery && data.gallery.length > 0 ? data.gallery[0].src : '');

            // Combine the data with the id
            return {
                id: data.slug, // Use slug as ID
                slug: data.slug,
                title: data.title,
                description: content, // The body of the markdown is the description
                client: data.client,
                role: data.role,
                year: data.year,
                categories: categories,
                coverImage: coverImage,
                coverAlt: data.coverAlt || data.title,
                credits: data.credits || [],
                images: data.gallery || [],
                youtubeUrl: data.youtubeUrl,
                isFeatured: data.isFeatured,
                isHidden: data.isHidden,
                featuredOrder: data.featuredOrder || 99,
                date: data.date,
            } as Project & { featuredOrder: number; date: string; isHidden?: boolean };
        });

    // Filter out hidden projects
    const visibleProjects = allProjects.filter(p => !p.isHidden);

    // Sort projects by date or featuredOrder
    return visibleProjects.sort((a, b) => {
        // Primary sort: Featured Order (ascending)
        if (a.featuredOrder !== b.featuredOrder) {
            return a.featuredOrder - b.featuredOrder;
        }
        // Secondary sort: Date (newer first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getProjectBySlug(slug: string): Project | null {
    try {
        const fullPath = path.join(projectsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        // Normalize categories
        let categories: string[] = [];
        if (data.categories && Array.isArray(data.categories)) {
            categories = data.categories;
        } else if (data.category) {
            categories = Array.isArray(data.category) ? data.category : [data.category];
        } else if (data.tags) {
            categories = data.tags;
        }

        const coverImage = data.coverImage || (data.gallery && data.gallery.length > 0 ? data.gallery[0].src : '');

        return {
            id: data.slug,
            slug: data.slug,
            title: data.title,
            description: content,
            client: data.client,
            role: data.role,
            year: data.year,
            categories: categories,
            coverImage: coverImage,
            coverAlt: data.coverAlt || data.title,
            credits: data.credits || [],
            images: data.gallery || [],
            isFeatured: data.isFeatured,
            isHidden: data.isHidden,
        } as Project;
    } catch (e) {
        return null;
    }
}


export interface SocialLink {
    platform: string;
    url: string;
    label?: string;
    icon?: string; // Optional: for icon component matching
}

export interface NavRoute {
    label: string;
    path: string;
}

export interface SiteConfig {
    title: string;
    description: string;
    email: string;
    socials: SocialLink[];
    nav: NavRoute[];
}

export interface ProjectCredit {
    role: string;
    name: string;
    url?: string;
}

export interface ProjectImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

export interface Project {
    id: string;
    slug: string;
    title: string;
    client?: string;
    role: string; // e.g., "Wardrobe Stylist", "Creative Director"
    year: string;
    description: string;
    categories: string[]; // e.g., "Editorial", "Commercial"
    coverImage: string;
    coverAlt?: string;
    credits: ProjectCredit[];
    images: ProjectImage[];
    isFeatured: boolean; // For Homepage Grid
    isHidden?: boolean; // Draft mode
    youtubeUrl?: string; // Optional embedded video
}

export interface AboutContent {
    bio: string; // Markdown string from CMS
    philosophy: string;
    services: {
        title: string;
        description: string;
    }[];
    education: {
        institution: string;
        location: string;
        degree: string;
    }[];
    experience: {
        company: string;
        role?: string;
    }[];
}

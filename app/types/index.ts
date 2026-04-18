
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

export interface SanitySlugValue {
    current: string;
}

export interface SanityImageCrop {
    _type?: "sanity.imageCrop";
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface SanityImageHotspot {
    _type?: "sanity.imageHotspot";
    x: number;
    y: number;
    height: number;
    width: number;
}

export interface SanityImageAssetReference {
    _ref: string;
    _type: "reference";
}

export interface SanityImageValue {
    _type: "image";
    asset?: SanityImageAssetReference;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
    alt?: string;
}

export interface WorkCategory {
    id: string;
    title: string;
    slug: string;
    description: string;
    displayOrder: number;
    coverImage: SanityImageValue;
    coverImageUrl: string;
    coverAlt: string;
}

export interface WorkGalleryItem {
    id: string;
    title?: string;
    alt: string;
    imageUrl: string;
    isVisible: boolean;
    showOnHomePage: boolean;
    homePageOrder?: number;
    categoryOrder?: number;
    image: SanityImageValue;
    category: Pick<WorkCategory, "id" | "title" | "slug" | "displayOrder">;
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

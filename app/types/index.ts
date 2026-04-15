
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

export interface WorkGalleryItemLegacyBridge {
    projectSlug?: string;
    projectTitle?: string;
    sourceFile?: string;
    imageRole?: "cover" | "gallery";
    featuredOrder?: number;
}

export interface WorkGalleryItem {
    id: string;
    title?: string;
    alt: string;
    isVisible: boolean;
    showOnHomePage: boolean;
    homePageOrder?: number;
    image: SanityImageValue;
    category: Pick<WorkCategory, "id" | "title" | "slug" | "displayOrder">;
    legacy?: WorkGalleryItemLegacyBridge;
}

export interface ProjectImage {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

export interface LegacyProjectBridge {
    id: string;
    slug: string;
    title: string;
    client?: string;
    featuredOrder?: number;
    role: string;
    year: string;
    description: string;
    categories: string[];
    coverImage: string;
    coverAlt?: string;
    credits: ProjectCredit[];
    images: ProjectImage[];
    isFeatured: boolean;
    isHidden?: boolean;
    youtubeUrl?: string;
}

export type Project = LegacyProjectBridge;

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

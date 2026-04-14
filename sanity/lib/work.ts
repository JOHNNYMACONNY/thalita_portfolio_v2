import "server-only";

import type { Project, ProjectImage, SanityImageValue, WorkCategory, WorkGalleryItem } from "@/app/types";

import { client } from "./client";
import { urlFor } from "./image";
import {
  galleryItemsByCategorySlugQuery,
  homeWorkGalleryItemsQuery,
  legacyWorkGalleryItemsByProjectSlugQuery,
  legacyWorkGalleryItemsQuery,
  visibleWorkCategoriesQuery,
} from "./queries";

type WorkCategoryRecord = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  displayOrder: number;
  coverImage: SanityImageValue;
  coverAlt: string;
};

type WorkGalleryItemRecord = {
  _id: string;
  title?: string;
  alt: string;
  image: SanityImageValue;
  isVisible: boolean;
  showOnHomePage: boolean;
  homePageOrder?: number;
  legacyProjectSlug?: string;
  legacyProjectTitle?: string;
  legacySourceFile?: string;
  legacyImageRole?: "cover" | "gallery";
  legacyFeaturedOrder?: number;
  category?: {
    _id: string;
    title: string;
    slug: string;
    displayOrder: number;
  };
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function toImageUrl(image?: SanityImageValue) {
  if (!image?.asset?._ref) {
    return null;
  }

  return urlFor(image).auto("format").url();
}

function toWorkGalleryItem(record: WorkGalleryItemRecord): WorkGalleryItem | null {
  if (!record.category || !isNonEmptyString(record.alt) || !record.image?.asset?._ref) {
    return null;
  }

  return {
    id: record._id,
    title: record.title,
    alt: record.alt,
    image: record.image,
    isVisible: record.isVisible,
    showOnHomePage: record.showOnHomePage,
    homePageOrder: record.homePageOrder,
    category: {
      id: record.category._id,
      title: record.category.title,
      slug: record.category.slug,
      displayOrder: record.category.displayOrder,
    },
    legacy: {
      projectSlug: record.legacyProjectSlug,
      projectTitle: record.legacyProjectTitle,
      sourceFile: record.legacySourceFile,
      imageRole: record.legacyImageRole,
      featuredOrder: record.legacyFeaturedOrder,
    },
  };
}

function toProjectImage(record: WorkGalleryItemRecord): ProjectImage | null {
  const src = toImageUrl(record.image);
  if (!src || !isNonEmptyString(record.alt)) {
    return null;
  }

  return {
    src,
    alt: record.alt,
  };
}

function toLegacyProject(records: WorkGalleryItemRecord[]): Project | null {
  if (records.length === 0) {
    return null;
  }

  const [primaryRecord] = records;
  if (
    !primaryRecord.category ||
    !isNonEmptyString(primaryRecord.legacyProjectSlug) ||
    !isNonEmptyString(primaryRecord.legacyProjectTitle)
  ) {
    return null;
  }

  const coverRecord = records.find((record) => record.legacyImageRole === "cover") ?? primaryRecord;
  const coverImage = toImageUrl(coverRecord.image);
  if (!coverImage || !isNonEmptyString(coverRecord.alt)) {
    return null;
  }

  const otherImages = records
    .filter((record) => record._id !== coverRecord._id)
    .map(toProjectImage)
    .filter((image): image is ProjectImage => image !== null);

  const categories = Array.from(
    new Set(
      records
        .map((record) => record.category?.title)
        .filter((title): title is string => isNonEmptyString(title)),
    ),
  );

  return {
    id: primaryRecord.legacyProjectSlug,
    slug: primaryRecord.legacyProjectSlug,
    title: primaryRecord.legacyProjectTitle,
    client: undefined,
    featuredOrder: primaryRecord.legacyFeaturedOrder,
    role: "",
    year: "",
    description: "",
    categories,
    coverImage,
    coverAlt: coverRecord.alt,
    credits: [],
    images: otherImages,
    isFeatured: isPositiveInteger(primaryRecord.legacyFeaturedOrder),
    youtubeUrl: undefined,
  };
}

async function fetchWorkGalleryItems(
  query: string,
  params?: Record<string, string>,
): Promise<WorkGalleryItemRecord[]> {
  const items = await client.fetch<WorkGalleryItemRecord[]>(query, params ?? {});
  return Array.isArray(items) ? items : [];
}

export async function getWorkCategories(): Promise<WorkCategory[]> {
  const categories = await client.fetch<WorkCategoryRecord[]>(visibleWorkCategoriesQuery);
  if (!Array.isArray(categories) || categories.length === 0) {
    return [];
  }

  return categories
    .filter((category): category is WorkCategoryRecord => {
      return (
        isNonEmptyString(category._id) &&
        isNonEmptyString(category.title) &&
        isNonEmptyString(category.slug) &&
        isNonEmptyString(category.description) &&
        isPositiveInteger(category.displayOrder) &&
        isNonEmptyString(category.coverAlt) &&
        Boolean(category.coverImage?.asset?._ref)
      );
    })
    .map((category) => ({
      id: category._id,
      title: category.title,
      slug: category.slug,
      description: category.description,
      displayOrder: category.displayOrder,
      coverImage: category.coverImage,
      coverAlt: category.coverAlt,
    }));
}

export async function getHomeGalleryItems(): Promise<WorkGalleryItem[]> {
  const items = await fetchWorkGalleryItems(homeWorkGalleryItemsQuery);
  return items.map(toWorkGalleryItem).filter((item): item is WorkGalleryItem => item !== null);
}

export async function getGalleryItemsByCategorySlug(slug: string): Promise<WorkGalleryItem[]> {
  if (!isNonEmptyString(slug)) {
    return [];
  }

  const items = await fetchWorkGalleryItems(galleryItemsByCategorySlugQuery, { slug });
  return items.map(toWorkGalleryItem).filter((item): item is WorkGalleryItem => item !== null);
}

export async function getLegacyProjectsFromSanity(): Promise<Project[]> {
  const records = await fetchWorkGalleryItems(legacyWorkGalleryItemsQuery);
  if (records.length === 0) {
    return [];
  }

  const grouped = new Map<string, WorkGalleryItemRecord[]>();
  for (const record of records) {
    if (!isNonEmptyString(record.legacyProjectSlug)) {
      continue;
    }

    const existing = grouped.get(record.legacyProjectSlug) ?? [];
    existing.push(record);
    grouped.set(record.legacyProjectSlug, existing);
  }

  return Array.from(grouped.values())
    .map(toLegacyProject)
    .filter((project): project is Project => project !== null)
    .sort((left, right) => {
      const leftOrder = left.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = right.featuredOrder ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.title.localeCompare(right.title);
    });
}

export async function getLegacyProjectBySlugFromSanity(slug: string): Promise<Project | null> {
  if (!isNonEmptyString(slug)) {
    return null;
  }

  const records = await fetchWorkGalleryItems(legacyWorkGalleryItemsByProjectSlugQuery, { slug });
  return toLegacyProject(records);
}

export async function getLegacyProjectSlugsFromSanity(): Promise<string[]> {
  const projects = await getLegacyProjectsFromSanity();
  return projects.map((project) => project.slug);
}

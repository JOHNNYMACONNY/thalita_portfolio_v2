import "server-only";

import type { SanityImageValue, WorkCategory, WorkGalleryItem } from "@/app/types";

import { client } from "./client";
import { urlFor } from "./image";
import {
  galleryItemsByCategorySlugQuery,
  homeWorkGalleryItemsQuery,
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
  categoryOrder?: number;
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
  const imageUrl = toImageUrl(record.image);
  if (!record.category || !isNonEmptyString(record.alt) || !imageUrl) {
    return null;
  }

  return {
    id: record._id,
    title: record.title,
    alt: record.alt,
    imageUrl,
    image: record.image,
    isVisible: record.isVisible,
    showOnHomePage: record.showOnHomePage,
    homePageOrder: record.homePageOrder,
    categoryOrder: record.categoryOrder,
    category: {
      id: record.category._id,
      title: record.category.title,
      slug: record.category.slug,
      displayOrder: record.category.displayOrder,
    },
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
    .map((category) => {
      const coverImageUrl = toImageUrl(category.coverImage);
      if (!coverImageUrl) {
        return null;
      }

      return {
        id: category._id,
        title: category.title,
        slug: category.slug,
        description: category.description,
        displayOrder: category.displayOrder,
        coverImage: category.coverImage,
        coverImageUrl,
        coverAlt: category.coverAlt,
      };
    })
    .filter((category): category is WorkCategory => category !== null);
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

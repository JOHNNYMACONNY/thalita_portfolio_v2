import { defineQuery } from "next-sanity";

const galleryItemProjection = `
  _id,
  title,
  alt,
  image,
  isVisible,
  showOnHomePage,
  homePageOrder,
  legacyProjectSlug,
  legacyProjectTitle,
  legacySourceFile,
  legacyImageRole,
  legacyFeaturedOrder,
  "category": category->{
    _id,
    title,
    "slug": slug.current,
    displayOrder
  }
`;

export const visibleWorkCategoriesQuery = defineQuery(`
  *[_type == "category"] | order(displayOrder asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    displayOrder,
    coverImage,
    "coverAlt": coverImage.alt
  }
`);

export const homeWorkGalleryItemsQuery = defineQuery(`
  *[_type == "galleryItem" && isVisible == true && showOnHomePage == true]
    | order(homePageOrder asc, _createdAt asc) {
      ${galleryItemProjection}
    }
`);

export const galleryItemsByCategorySlugQuery = defineQuery(`
  *[_type == "galleryItem" && isVisible == true && category->slug.current == $slug]
    | order(coalesce(homePageOrder, 999) asc, _createdAt asc) {
      ${galleryItemProjection}
    }
`);

export const legacyWorkGalleryItemsQuery = defineQuery(`
  *[_type == "galleryItem" && isVisible == true && defined(legacyProjectSlug)]
    | order(coalesce(legacyFeaturedOrder, 999) asc, legacyProjectTitle asc, _createdAt asc) {
      ${galleryItemProjection}
    }
`);

export const legacyWorkGalleryItemsByProjectSlugQuery = defineQuery(`
  *[_type == "galleryItem" && isVisible == true && legacyProjectSlug == $slug]
    | order(coalesce(legacyFeaturedOrder, 999) asc, legacyImageRole asc, _createdAt asc) {
      ${galleryItemProjection}
    }
`);

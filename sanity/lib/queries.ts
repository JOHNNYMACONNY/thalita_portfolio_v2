import { defineQuery } from "next-sanity";

const galleryItemProjection = `
  _id,
  title,
  alt,
  image,
  isVisible,
  showOnHomePage,
  homePageOrder,
  categoryOrder,
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
  *[_type == "galleryItem" && isVisible == true && showOnHomePage == true && defined(category)]
    | order(homePageOrder asc, _createdAt asc) {
      ${galleryItemProjection}
    }
`);

export const galleryItemsByCategorySlugQuery = defineQuery(`
  *[_type == "galleryItem" && isVisible == true && category->slug.current == $slug]
    | order(coalesce(categoryOrder, 999) asc, coalesce(homePageOrder, 999) asc, _createdAt asc) {
      ${galleryItemProjection}
    }
`);

import { defineField, defineType } from "sanity";

const categorySlotOrderById: Record<string, number> = {
  "work-category-1": 1,
  "work-category-2": 2,
  "work-category-3": 3,
};

function getExpectedDisplayOrder(documentId?: string) {
  if (!documentId) {
    return undefined;
  }

  const normalizedId = documentId.replace(/^drafts\./, "");
  return categorySlotOrderById[normalizedId];
}

export const category = defineType({
  name: "category",
  title: "Work Category",
  type: "document",
  preview: {
    select: {
      title: "title",
      media: "coverImage",
    },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Reserve slots 1 through 3 for the three approved Work categories.",
      validation: (rule) =>
        rule.required().integer().min(1).max(3).custom((value, context) => {
          if (typeof value !== "number") {
            return true;
          }

          const expectedOrder = getExpectedDisplayOrder(context.document?._id);
          if (!expectedOrder || value === expectedOrder) {
            return true;
          }

          return `This category slot must use display order ${expectedOrder}.`;
        }),
    }),
  ],
});

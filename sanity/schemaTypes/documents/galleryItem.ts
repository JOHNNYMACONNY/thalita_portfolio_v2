import { defineField, defineType } from "sanity";

export const galleryItem = defineType({
  name: "galleryItem",
  title: "Gallery Item",
  type: "document",
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "category.title",
    },
    prepare(selection) {
      return {
        title: selection.title || "Untitled gallery item",
        media: selection.media,
        subtitle: selection.subtitle,
      };
    },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Optional internal label for editors.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      options: {
        disableNew: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isVisible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showOnHomePage",
      title: "Show On Home Page",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homePageOrder",
      title: "Home Page Order",
      type: "number",
      hidden: ({ document }) => !document?.showOnHomePage,
      validation: (rule) =>
        rule.integer().custom((value, context) => {
          if (!context.document?.showOnHomePage) {
            return true;
          }

          if (typeof value !== "number") {
            return "Home page order is required when this item is shown on the home page.";
          }

          return value >= 1 ? true : "Home page order must be at least 1.";
        }),
    }),
  ],
});

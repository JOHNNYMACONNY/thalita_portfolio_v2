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
        subtitle: selection.subtitle || "Unassigned photo",
      };
    },
  },
  fields: [
    defineField({
      name: "title",
      title: "Photo Label",
      type: "string",
      description: "Optional internal name to help you recognize this photo later.",
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
      description: "Describe the image for accessibility. The upload tool can prefill this so you can refine it later.",
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
      description: "Leave this blank to keep the photo in Unassigned until you're ready to sort it.",
    }),
    defineField({
      name: "isVisible",
      title: "Visible On Site",
      type: "boolean",
      initialValue: true,
      description: "Only assigned photos can appear on the public site.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showOnHomePage",
      title: "Show On Home Page",
      type: "boolean",
      initialValue: false,
      hidden: ({ document }) => !document?.category,
      description: "Turn this on after the photo has been assigned to a category.",
      validation: (rule) =>
        rule.required().custom((value, context) => {
          if (value && !context.document?.category) {
            return "Assign a category before showing this photo on the home page.";
          }

          return true;
        }),
    }),
    defineField({
      name: "homePageOrder",
      title: "Home Page Order",
      type: "number",
      hidden: ({ document }) => !document?.category || !document?.showOnHomePage,
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

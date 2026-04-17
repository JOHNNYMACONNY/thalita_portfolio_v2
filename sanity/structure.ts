import type { StructureResolver } from "sanity/structure";
import { DocumentsIcon, ImagesIcon } from "@sanity/icons";

const categorySlots = [
  {
    documentId: "work-category-1",
    title: "Category Slot 1",
    displayOrder: 1,
  },
  {
    documentId: "work-category-2",
    title: "Category Slot 2",
    displayOrder: 2,
  },
  {
    documentId: "work-category-3",
    title: "Category Slot 3",
    displayOrder: 3,
  },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Category Slots")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Category Slots")
            .items(
              categorySlots.map((slot) =>
                S.listItem()
                  .title(`${slot.title} (Display Order ${slot.displayOrder})`)
                  .child(
                    S.document()
                      .schemaType("category")
                      .documentId(slot.documentId)
                      .title(slot.title)
                  )
              )
            )
        ),
      S.listItem()
        .title("Unassigned Photos")
        .icon(ImagesIcon)
        .child(
          S.documentList()
            .title("Unassigned Photos")
            .schemaType("galleryItem")
            .filter('_type == "galleryItem" && !defined(category)')
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
            .initialValueTemplates([])
        ),
      S.listItem()
        .title("All Photos")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("galleryItem")
            .title("All Photos")
            .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
            .initialValueTemplates([])
        ),
    ]);

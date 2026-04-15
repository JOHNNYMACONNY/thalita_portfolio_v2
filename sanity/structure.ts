import type { StructureResolver } from "sanity/structure";

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
        .title("Work Categories")
        .child(
          S.list()
            .title("Work Categories")
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
        .title("Gallery Items")
        .child(
          S.documentTypeList("galleryItem")
            .title("Gallery Items")
            .initialValueTemplates([])
        ),
    ]);

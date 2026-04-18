# Phase 08 Research

## Goal

Make publishing state and placement order legible enough that the editor can predict the live site before publishing.

## Inputs Reviewed

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/phases/07-category-assignment-and-organization/07-RESEARCH.md`
- `sanity/components/PhotoOrganizerTool.tsx`
- `sanity/schemaTypes/documents/galleryItem.ts`
- `sanity/lib/queries.ts`
- `sanity/lib/work.ts`

## Current State

- The organizer is now the primary photo-management surface.
- Placement state still needs to be expressed more clearly than the raw schema booleans/numbers.
- Category pages still need their own ordering model so category sequencing is not tied to homepage sequencing.

## Product Implications

### 1. Status should be readable at thumbnail level

Editors should not have to open a document to answer: "Is this hidden?", "Which category owns it?", and "Is it on the homepage?"

### 2. Visual order should drive numeric fields, not the other way around

The schema can keep order fields for the frontend, but the editor should manipulate order through photo cards and rails.

### 3. Placement review is part of publishing confidence

Each photo card should explain where it will appear so the editor can catch mistakes before pressing publish.

## Recommended Plan Slices

- `08-01-PLAN.md`
  - Add placement badges and visibility/home controls to the organizer.
- `08-02-PLAN.md`
  - Add category/home ordering controls and update the public query model.
- `08-03-PLAN.md`
  - Run end-to-end verification and close the milestone artifacts.

## Recommendation

Phase 08 should finish the milestone by turning the organizer into a publish-confidence surface: read the status at a glance, change it in bulk, and reorder outputs visually without touching raw numeric inputs.

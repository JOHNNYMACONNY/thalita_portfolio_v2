# Phase 07 Research

## Goal

Make category sorting feel like organizing photos into visible albums instead of editing CMS references one record at a time.

## Inputs Reviewed

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/research/v1.1-simple-photo-management.md`
- `.planning/phases/06-upload-workflow-foundation/06-RESEARCH.md`
- `sanity/components/PhotoOrganizerTool.tsx`
- `sanity/components/PhotoUploadTool.tsx`
- `sanity/schemaTypes/documents/galleryItem.ts`

## Current State

- The upload flow is now safe and batch-friendly.
- The organizer already supports moving several unassigned photos into one category.
- The missing pieces are reassignment, visual scanability across all categories, and recovery actions when the editor changes their mind.

## Product Implications

### 1. The organizer should show all destinations simultaneously

The editor should not have to remember which category they selected before seeing where photos are headed. The three category slots need to stay visible while sorting.

### 2. Bulk organization must include reversal

One-way assignment is not enough. Editors need to bulk reassign photos to a different category and remove photos back to `Unassigned` without opening documents individually.

### 3. Recovery helpers matter as much as movement

Fast filtering and search are part of organization, especially after a large upload session. `Unassigned`, `Hidden`, and `Home page` subsets are high-value views.

## Recommended Plan Slices

- `07-01-PLAN.md`
  - Turn the organizer into a multi-bucket workspace with `Unassigned` plus the three category slots visible together.
- `07-02-PLAN.md`
  - Add bulk reassignment, remove-to-unassigned, and quick filters/search.
- `07-03-PLAN.md`
  - Add safe confirmations, improve language/copy, and close the phase with verification artifacts.

## Recommendation

Phase 07 should deepen the existing custom organizer instead of replacing it. That keeps the editor mental model consistent: upload first, then switch to one visual surface for sorting, cleanup, and quick recovery.

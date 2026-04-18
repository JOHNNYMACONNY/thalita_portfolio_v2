---
phase: 06-upload-workflow-foundation
plan: 01
subsystem: studio-schema
tags: [sanity, studio, schema, editorial-ux, uploads]
requires:
  - phase: 05-legacy-cms-removal
    provides: Sanity Studio is the only live CMS surface
provides:
  - Unassigned intake state for newly uploaded photos
  - Plain-language field labels for the initial photo workflow
  - Studio navigation that separates category slots from unassigned and all-photo views
affects: [phase-06-02-upload-surface, phase-06-03-verification]
tech-stack:
  added: []
  patterns: [safe-unassigned-state, plain-language-schema-labeling, editor-first studio structure]
key-files:
  created: []
  modified: [sanity/lib/queries.ts, sanity/schemaTypes/documents/galleryItem.ts, sanity/structure.ts]
  deleted: []
key-decisions:
  - "New photos should be allowed to exist without a category so editors can upload first and sort later."
  - "Homepage curation controls stay hidden until a photo has been assigned to a category."
patterns-established:
  - "When an editor workflow has a natural holding state, model it explicitly instead of forcing an early content decision."
requirements-completed: [UPL-03, EDT-01]
duration: 15min
completed: 2026-04-17
---

# Phase 06 Plan 01: Unassigned Intake Summary

**Phase 06 started by turning `Unassigned` into a safe first-class photo state instead of forcing category assignment during intake**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-17T07:30:00Z
- **Completed:** 2026-04-17T07:45:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Removed the category requirement from live `galleryItem` documents so photo drafts can exist safely before sorting.
- Hid homepage placement fields until a category is chosen and added validation so uncategorized photos cannot be featured accidentally.
- Updated the home-page query to ignore uncategorized records explicitly.
- Restructured Studio so editors can open `Category Slots`, `Unassigned Photos`, or `All Photos` without scanning raw document lists.

## Task Commits

1. **Task 1: Add a safe unassigned photo state and plain-language schema labels** - `6e7ca6e` (`feat`)
2. **Task 2: Separate unassigned and all-photo views in Studio structure** - `6e7ca6e` (`feat`)

## Files Created/Modified

- `sanity/schemaTypes/documents/galleryItem.ts` - removes forced category assignment and guards homepage fields
- `sanity/lib/queries.ts` - excludes uncategorized photos from homepage curation reads
- `sanity/structure.ts` - adds `Unassigned Photos` and keeps the Studio navigation editor-friendly

## Decisions Made

- Chose an explicit `Unassigned` workflow instead of a fake placeholder category because it better matches how non-technical editors think about fresh uploads.
- Kept `isVisible` available while making category assignment the real guardrail for public placement.

## Deviations from Plan

- The Studio structure cleanup was pulled into the same slice because it directly reinforces the new unassigned workflow.

## Issues Encountered

- Verification briefly hit AppleDouble `._*` sidecar files on macOS; these were cleaned during lint verification.

## User Setup Required

None.

## Next Phase Readiness

- The content model now supports upload-first behavior, so Plan `06-02` can build a real batch upload surface on top of it.

## Self-Check

PASSED

- Verified commit `6e7ca6e` exists.
- Verified uncategorized photos are hidden from homepage queries by schema/query guardrails.

---
*Phase: 06-upload-workflow-foundation*
*Completed: 2026-04-17*

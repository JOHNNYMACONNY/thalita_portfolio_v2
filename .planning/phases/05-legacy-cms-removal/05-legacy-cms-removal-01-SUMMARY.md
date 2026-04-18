---
phase: 05-legacy-cms-removal
plan: 01
subsystem: migration
tags: [nextjs, sanity, cleanup, migration, routing]
requires:
  - phase: 04-home-curation-and-navigation
    provides: Homepage curation and `/work` navigation are fully live
provides:
  - Legacy `/portfolio` route removal
  - Removal of obsolete project-card presentation components and bridge types
  - Sanity Work helpers and schema narrowed to the category/gallery model only
affects: [phase-05-02-admin-cleanup, phase-05-03-verification]
tech-stack:
  added: []
  patterns: [remove-dead-route cleanup, fail-closed helper surface reduction, schema/runtime alignment]
key-files:
  created: []
  modified: [app/types/index.ts, sanity/lib/queries.ts, sanity/lib/work.ts, sanity/migrations/work-audit.ts, sanity/schemaTypes/documents/galleryItem.ts]
  deleted: [app/portfolio/page.tsx, components/PortfolioGrid.tsx, components/ProjectCard.tsx, components/ProjectNavigation.tsx]
key-decisions:
  - "Phase 5 removes the temporary legacy project bridge completely instead of preserving compatibility helpers after `/work` became category-first."
  - "The migration audit should be updated to validate only live helper APIs rather than keeping fake legacy checks alive."
patterns-established:
  - "Once overlap routes are no longer user-facing, delete their helper/query/type surface instead of carrying dormant bridge code forward."
requirements-completed: [MIG-02]
duration: 20min
completed: 2026-04-16
---

# Phase 05 Plan 01: Legacy Work Removal Summary

**The obsolete portfolio route and temporary project bridge were removed so Work now exists only as a Sanity-backed category gallery**

## Performance

- **Duration:** 20 min
- **Started:** 2026-04-17T06:09:00Z
- **Completed:** 2026-04-17T06:29:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Deleted the dead `app/portfolio/page.tsx` route and the unused `ProjectCard`, `PortfolioGrid`, and `ProjectNavigation` components.
- Removed temporary legacy project bridge types from `app/types/index.ts`.
- Simplified Sanity Work helpers and queries so they expose only the active category/gallery APIs.
- Removed legacy provenance fields from the live `galleryItem` schema and aligned the audit script with the reduced helper surface.

## Task Commits

1. **Task 1: Remove obsolete Work routes and unused presentation components** - `95c4b97` (`feat`)
2. **Task 2: Remove legacy bridge helpers, queries, and schema fields** - `95c4b97` (`feat`)

## Files Created/Modified

- `app/types/index.ts` - removes legacy project bridge types
- `sanity/lib/queries.ts` - drops legacy project query exports and fields
- `sanity/lib/work.ts` - narrows the helper layer to category and gallery reads
- `sanity/migrations/work-audit.ts` - removes legacy helper expectations from the audit
- `sanity/schemaTypes/documents/galleryItem.ts` - removes legacy provenance fields from the active schema

## Decisions Made

- Chose full bridge deletion instead of a soft deprecation path because the visitor-facing IA had already been cut over in earlier phases.
- Kept legacy import history in migration artifacts, while removing only the live runtime/schema overlap.

## Deviations from Plan

- The migration audit script needed to be updated as part of the same slice because it still imported the removed helper functions.

## Issues Encountered

- Lint initially failed on macOS AppleDouble `._*` sidecar files in the repo, so those were cleaned out before verification.

## User Setup Required

None.

## Next Phase Readiness

- The runtime no longer depends on the legacy Work bridge, so Phase `05-02` can safely remove Decap/admin infrastructure next.

## Self-Check

PASSED

- Verified commit `95c4b97` exists.
- Verified runtime references to legacy project bridge helpers are removed from app code.

---
*Phase: 05-legacy-cms-removal*
*Completed: 2026-04-16*

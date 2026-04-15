---
phase: 03-category-work-experience
plan: 01
subsystem: ui
tags: [nextjs, sanity, work-gallery, app-router, images]
requires:
  - phase: 02-data-layer-migration
    provides: Sanity Work helpers for categories and gallery items
provides:
  - Sanity-backed `/work` landing page with three category cards
  - Dedicated editorial category card component for Work browsing
  - Sanity CDN image support for category cover media
affects: [phase-04-home-curation-and-navigation, phase-03-02-category-galleries]
tech-stack:
  added: []
  patterns: [server-rendered route composition, category-first Sanity projections, remote image allowlisting]
key-files:
  created: [app/work/page.tsx, components/WorkCategoryCard.tsx, .planning/phases/03-category-work-experience/deferred-items.md]
  modified: [app/types/index.ts, sanity/lib/work.ts, next.config.ts]
key-decisions:
  - "The `/work` landing route should consume typed category records with resolved cover image URLs instead of teaching UI components about Sanity image builders."
  - "Sanity CDN enablement is a minimal Phase 03 change in `next.config.ts`, not a broader image pipeline cleanup."
patterns-established:
  - "Category-first Work routes use `getWorkCategories()` as the canonical source instead of legacy project bridge helpers."
  - "Work browsing UI gets dedicated components when project-detail components carry the wrong information architecture."
requirements-completed: [WORK-01]
duration: 3min
completed: 2026-04-14
---

# Phase 03 Plan 01: Category Work Landing Summary

**A Sanity-backed `/work` landing page with editorial category cards and production-safe Sanity cover images**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-15T02:52:31Z
- **Completed:** 2026-04-15T02:55:51Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Added a dedicated server-rendered `/work` route that fetches the published Work categories from Sanity.
- Introduced `WorkCategoryCard` so the new landing page stays browse-oriented and visually aligned with the existing editorial system.
- Enabled category cover media in production by resolving cover image URLs in the Work helper layer and allowlisting `cdn.sanity.io`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add a category-first `/work` landing route and presentation component** - `3b2b77e` (`feat`)
2. **Task 2: Ensure category cover media can render on the landing page** - `488a27c` (`feat`)

## Files Created/Modified

- `app/work/page.tsx` - Server route for the new category-first Work landing page
- `components/WorkCategoryCard.tsx` - Editorial category card with motion, image, and browse affordance
- `app/types/index.ts` - Adds the resolved `coverImageUrl` field to `WorkCategory`
- `sanity/lib/work.ts` - Resolves and validates category cover image URLs in `getWorkCategories()`
- `next.config.ts` - Allows Sanity CDN images for Next Image rendering
- `.planning/phases/03-category-work-experience/deferred-items.md` - Logs unrelated pre-existing warnings observed during verification

## Decisions Made

- Added `coverImageUrl` to the category contract so the UI receives a render-ready image string and stays ignorant of Sanity image-builder details.
- Kept the `/work` landing visually distinct from the legacy project grid instead of reusing `ProjectCard`, which carried project-detail assumptions into the wrong IA.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `next build` surfaced pre-existing warnings from `@sanity/image-url` deprecation and the legacy homepage empty-grid log. These were recorded in `deferred-items.md` because they do not block `03-01`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `/work` now has a stable category-first entry point, and Phase `03-02` can repurpose `/work/[slug]` into the category gallery route without changing global navigation.
- The site still uses legacy homepage and navigation flows, which is expected and remains owned by later phases.

## Self-Check

PASSED

- Verified created files exist: `app/work/page.tsx`, `components/WorkCategoryCard.tsx`, `deferred-items.md`, and this summary file.
- Verified task commits exist in git history: `3b2b77e`, `488a27c`.

---
*Phase: 03-category-work-experience*
*Completed: 2026-04-14*

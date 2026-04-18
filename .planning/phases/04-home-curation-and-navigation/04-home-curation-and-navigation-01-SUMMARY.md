---
phase: 04-home-curation-and-navigation
plan: 01
subsystem: ui
tags: [nextjs, sanity, homepage, curation, app-router]
requires:
  - phase: 03-category-work-experience
    provides: Category-first `/work` routes and Sanity gallery helpers
provides:
  - Homepage Work section backed by curated Sanity gallery items
  - Dedicated home-gallery component instead of the legacy project grid
  - Intentional zero-curated-state treatment that still routes visitors to `/work`
affects: [phase-04-02-navigation, phase-04-03-verification, phase-05-legacy-cms-removal]
tech-stack:
  added: []
  patterns: [server-rendered home curation reads, dedicated homepage gallery UI, fail-closed empty curated state]
key-files:
  created: [components/HomeGalleryGrid.tsx]
  modified: [app/page.tsx]
key-decisions:
  - "The homepage should read `getHomeGalleryItems()` directly instead of stretching the legacy `Project` bridge into the new information architecture."
  - "A dedicated `HomeGalleryGrid` is clearer than repurposing `PortfolioGrid`, because home curation is category/gallery-oriented rather than project-detail-oriented."
patterns-established:
  - "Homepage Work discovery now uses a dedicated image-led gallery component when the legacy project card model carries the wrong semantics."
  - "Zero curated home items are treated as a deliberate editorial state rather than a silent empty return."
requirements-completed: [HOME-01, HOME-02]
duration: 14min
completed: 2026-04-16
---

# Phase 04 Plan 01: Home Curation Summary

**Homepage Work discovery now comes from curated Sanity gallery items instead of the legacy project bridge**

## Performance

- **Duration:** 14 min
- **Started:** 2026-04-17T04:02:00Z
- **Completed:** 2026-04-17T04:16:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Replaced the legacy `getLegacyProjectsFromSanity()` homepage flow with `getHomeGalleryItems()`.
- Added `HomeGalleryGrid` so the home page can render curated imagery without reviving project-detail cards.
- Introduced an intentional zero-curated-state treatment that continues to route visitors toward `/work`.

## Task Commits

Implementation shipped in one focused code commit because the data-source swap and new gallery component were tightly coupled:

1. **Task 1: Replace the legacy homepage grid data source with curated home gallery items** - `e5dc414` (`feat`)
2. **Task 2: Build a home-specific gallery presentation that preserves the site's editorial tone** - `e5dc414` (`feat`)

## Files Created/Modified

- `app/page.tsx` - switches the homepage Work section from legacy project records to curated home gallery items
- `components/HomeGalleryGrid.tsx` - renders curated home imagery plus the empty curated-state treatment and `/work` browse affordance

## Decisions Made

- Kept home-page curation on the canonical helper ordering instead of re-sorting in the route layer.
- Built a dedicated home-gallery component rather than mutating `PortfolioGrid`, which still encodes legacy project assumptions.

## Deviations from Plan

- Both tasks were committed together because the route rewrite and the new component were structurally coupled and verified together.

## Issues Encountered

- `next build` still reports the pre-existing `@sanity/image-url` default-export deprecation warning.
- The local browser check showed the zero-curated state, so live curated-item proof remained part of the later blocking UAT step rather than this implementation slice.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The home route now exposes the correct curated Work surface, so Phase `04-02` can repoint shared navigation to `/work` without reviving the old `/#portfolio` path.
- The final reorder proof remains owned by Phase `04-03`.

## Self-Check

PASSED

- Verified `app/page.tsx` and `components/HomeGalleryGrid.tsx` exist with the curated home-gallery flow.
- Verified implementation commit `e5dc414` exists in git history.

---
*Phase: 04-home-curation-and-navigation*
*Completed: 2026-04-16*

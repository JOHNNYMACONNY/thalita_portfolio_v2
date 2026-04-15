---
phase: 02-data-layer-migration
plan: 01
subsystem: api
tags: [sanity, nextjs, groq, migration, work]
requires:
  - phase: 01-01
    provides: Embedded Sanity client and environment wiring for published server-side reads
  - phase: 01-02
    provides: Category and gallery item schemas with single-category governance
provides:
  - Sanity-native Work contracts plus a temporary legacy project bridge
  - Typed GROQ query helpers for categories, gallery items, home curation, and legacy overlap projections
  - Homepage and legacy `/work/[slug]` reads routed through `sanity/lib/work.ts`
affects: [work-routing, data-layer, migration, homepage]
tech-stack:
  added: []
  patterns: [server-only-sanity-work-helpers, legacy-project-bridge, fail-closed-compatibility-transforms]
key-files:
  created:
    - sanity/lib/queries.ts
    - sanity/lib/work.ts
  modified:
    - app/types/index.ts
    - app/page.tsx
    - app/work/[slug]/page.tsx
    - lib/api.ts
    - sanity/schemaTypes/documents/galleryItem.ts
key-decisions:
  - "WorkCategory and WorkGalleryItem are now the source-of-truth contracts, while Project remains a temporary overlap bridge."
  - "Legacy compatibility transforms fail closed when slug, title, category, or image fields are malformed instead of guessing missing values."
  - "The legacy detail page keeps its presentation shell but suppresses empty metadata sections until later migration plans populate richer content."
patterns-established:
  - "All active Work reads should flow through `sanity/lib/work.ts`, not `lib/api.ts`."
  - "Legacy route support is reconstructed from gallery-item provenance fields rather than reviving project documents."
requirements-completed: [SAN-03]
duration: 9min
completed: 2026-04-14
---

# Phase 02 Plan 01: Data Layer Migration Summary

**Sanity-backed Work queries now drive the homepage portfolio grid and the overlapping legacy `/work/[slug]` route through a typed compatibility layer**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-14T22:28:05Z
- **Completed:** 2026-04-14T22:37:01Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Added explicit Sanity-facing Work contracts and narrowed the legacy `Project` shape to a temporary bridge instead of the primary model.
- Extended `galleryItem` with only the provenance fields needed for overlap reconstruction and migration traceability.
- Moved active Work reads off markdown by introducing typed GROQ queries and a server-only `sanity/lib/work.ts` helper layer used by the homepage and legacy detail route.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Work contracts and migration-safe legacy bridge fields** - `ab75512` (feat)
2. **Task 2: Create Sanity Work query helpers and switch current Work consumers off markdown** - `a71a28b` (feat)

**Plan metadata:** pending final docs commit

## Files Created/Modified
- `app/types/index.ts` - Adds Sanity image/category/gallery contracts and narrows `Project` into a compatibility bridge type.
- `sanity/schemaTypes/documents/galleryItem.ts` - Stores minimal legacy provenance fields needed for overlap routing and migration audits.
- `sanity/lib/queries.ts` - Defines typed GROQ queries for categories, category items, home curation, and legacy bridge reads.
- `sanity/lib/work.ts` - Centralizes published Sanity fetches plus fail-closed transforms into the temporary legacy project view.
- `lib/api.ts` - Keeps only filesystem-backed JSON/settings readers for non-Work content.
- `app/page.tsx` - Reads homepage portfolio data from `getLegacyProjectsFromSanity()`.
- `app/work/[slug]/page.tsx` - Generates params and detail content from the Sanity compatibility helpers.

## Decisions Made
- Kept `Project` as a compatibility type alias so existing Work UI components can survive the overlap period while new Work data contracts become explicit.
- Used gallery-item provenance fields for title/slug/order reconstruction instead of reintroducing project documents or multi-category content models.
- Returned `[]` or `null` from empty or malformed Sanity reads so build-time route generation fails predictably rather than dereferencing undefined data.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed generated AppleDouble metadata files before repo verification**
- **Found during:** Task 2 verification
- **Issue:** Generated `._*` metadata files caused ESLint parsing errors against fake mirror files such as `app/._page.tsx`.
- **Fix:** Deleted `._*` files outside `.git` and `node_modules`, then reran lint.
- **Files modified:** generated metadata files only
- **Verification:** `npm run lint` completed with warnings only afterward; `npm run build` passed
- **Committed in:** not applicable

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The cleanup only restored verification reliability. The implementation stayed within plan scope.

## Issues Encountered
- `npm run lint` still reports three pre-existing warnings in `app/about/page.tsx` and `public/admin/cms.js`, both outside this plan’s write scope.
- `npm run build` emits existing warnings from `@sanity/image-url` deprecation and a `--localstorage-file` runtime warning, but the production build completed successfully.

## User Setup Required

None - no additional external configuration was introduced by this plan.

## Known Stubs

- `sanity/lib/work.ts:142` leaves legacy `role` empty because Phase 2 intentionally does not restore that project-era field into the Sanity model.
- `sanity/lib/work.ts:143` leaves legacy `year` empty for the same reason.
- `sanity/lib/work.ts:144` leaves legacy `description` empty until later migration work provides a sanctioned replacement.
- `sanity/lib/work.ts:148` returns empty `credits` because credits are intentionally out of scope for the image-centric Phase 2 model.

## TDD Gate Compliance

- Warning: Both tasks were marked `tdd="true"`, but the repo has no dedicated test harness in scope for this plan and the prescribed verification surface is lint/build only. No standalone `test(...)` RED commit was created; verification relied on `npx eslint`, `npm run lint`, and `npm run build`.

## Next Phase Readiness
- The app is ready for the dataset import and auditing plans to populate Sanity with legacy image records and provenance values.
- Legacy Work routes still render from a compatibility bridge, so the content experience remains sparse until the migration/import plans populate those bridge fields.

---
*Phase: 02-data-layer-migration*
*Completed: 2026-04-14*

## Self-Check: PASSED

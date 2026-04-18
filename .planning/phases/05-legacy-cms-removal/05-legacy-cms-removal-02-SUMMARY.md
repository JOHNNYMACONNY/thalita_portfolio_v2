---
phase: 05-legacy-cms-removal
plan: 02
subsystem: cms
tags: [nextjs, sanity, cleanup, cms, deployment]
requires:
  - phase: 05-legacy-cms-removal
    provides: Legacy Work bridge is removed from live runtime code
provides:
  - Decap `/admin` asset removal
  - Netlify Identity widget removal from the app shell
  - README and config cleanup aligned with `/studio` as the sole CMS
affects: [phase-05-03-verification]
tech-stack:
  added: []
  patterns: [single-cms-path cleanup, remove-stale-rewrite cleanup, docs/runtime alignment]
key-files:
  created: []
  modified: [README.md, app/layout.tsx, next.config.ts, package.json]
  deleted: [public/admin/admin-preview.css, public/admin/admin.css, public/admin/cms.js, public/admin/config.yml, public/admin/index.html]
key-decisions:
  - "Once `/studio` is verified live, `/admin` should fail closed instead of silently preserving an obsolete fallback CMS."
  - "README should describe the current Sanity-first editorial setup rather than historical Decap structure."
patterns-established:
  - "Phase cleanup should remove dead runtime integration points, dead static assets, and stale documentation together so the repo tells one consistent story."
requirements-completed: [MIG-02]
duration: 18min
completed: 2026-04-16
---

# Phase 05 Plan 02: Decap Removal Summary

**The old Decap admin path and its Netlify Identity wiring were removed, leaving `/studio` as the only live CMS surface**

## Performance

- **Duration:** 18 min
- **Started:** 2026-04-17T06:29:00Z
- **Completed:** 2026-04-17T06:47:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Deleted all static Decap admin assets under `public/admin`.
- Removed the Netlify Identity widget script from the root layout.
- Removed the `/admin` rewrite and obsolete `dev:admin` package script.
- Updated the README so the documented project structure and CMS workflow match the current Sanity-based implementation.

## Task Commits

1. **Task 1: Remove Decap CMS assets, rewrites, scripts, and identity integration** - `06d8135` (`feat`)
2. **Task 2: Align high-level docs with the Sanity-only editorial workflow** - `06d8135` (`feat`)

## Files Created/Modified

- `app/layout.tsx` - removes the Netlify Identity script
- `next.config.ts` - removes the `/admin` rewrite
- `package.json` - removes the `dev:admin` script
- `README.md` - replaces Decap references with Studio/Sanity descriptions
- `public/admin/*` - deleted obsolete Decap files

## Decisions Made

- Treated `/admin` removal as a hard cut rather than a redirect so obsolete editor entry points fail obviously.
- Left the broader Netlify deployment config intact because the active Next.js deployment path still depends on it.

## Deviations from Plan

- None.

## Issues Encountered

- Lint briefly re-surfaced AppleDouble sidecar files around touched files; these were cleaned and did not reflect a product regression.

## User Setup Required

None.

## Next Phase Readiness

- With Decap removed, the last remaining Phase `05-03` work is final config cleanup, regression verification, and phase closeout.

## Self-Check

PASSED

- Verified commit `06d8135` exists.
- Verified build output no longer includes `/admin`.

---
*Phase: 05-legacy-cms-removal*
*Completed: 2026-04-16*

---
phase: 04-home-curation-and-navigation
plan: 02
subsystem: navigation
tags: [nextjs, navigation, routing, app-router, responsive-ui]
requires:
  - phase: 04-home-curation-and-navigation
    provides: Homepage curated Work section and `/work` as the canonical browse destination
provides:
  - Header, hero CTA, and mobile overlay navigation aligned on `/work`
  - Shared nav config aligned with the new Work route
  - Removal of active `#portfolio` Work discovery links in app code
affects: [phase-04-03-verification, phase-05-legacy-cms-removal]
tech-stack:
  added: []
  patterns: [route-target consistency sweep, responsive nav parity, active-path handling for nested Work routes]
key-files:
  created: []
  modified: [components/Header.tsx, components/Hero.tsx, components/NavigationOverlay.tsx, components/OverlayMenu.tsx, lib/api.ts]
key-decisions:
  - "Work discovery now resolves to `/work` everywhere in shared navigation, rather than splitting semantics between the homepage anchor and the category-first Work route."
  - "The mobile overlay should treat all `/work/*` paths as active so category pages still light up the Work entry point."
patterns-established:
  - "When route semantics change, shared navigation config and fallback menu code are swept in the same slice to avoid internal drift."
requirements-completed: [WORK-02]
duration: 8min
completed: 2026-04-16
---

# Phase 04 Plan 02: Navigation Repointing Summary

**Shared Work discovery now routes to `/work` consistently across desktop, hero, mobile overlay, and hardcoded nav config**

## Performance

- **Duration:** 8 min
- **Started:** 2026-04-17T04:16:00Z
- **Completed:** 2026-04-17T04:24:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Repointed the desktop header Work link, the hero CTA target, and the active mobile overlay Work link to `/work`.
- Updated the shared nav config in `lib/api.ts` so the hardcoded route model matches visible navigation behavior.
- Preserved correct active-state behavior for nested `/work/[slug]` routes in the overlay nav.

## Task Commits

Implementation shipped in one focused code commit because the visible nav links and shared nav config needed to stay in sync:

1. **Task 1: Update all active shared Work entry paths to `/work`** - `5229595` (`feat`)
2. **Task 2: Eliminate leftover legacy Work anchors from shared nav sources** - `5229595` (`feat`)

## Files Created/Modified

- `components/Header.tsx` - desktop Work link now opens `/work`
- `components/Hero.tsx` - primary CTA now points to `/work`
- `components/NavigationOverlay.tsx` - mobile Work entry now routes to `/work` and stays active for nested `/work/*` routes
- `components/OverlayMenu.tsx` - fallback menu copy and route now reflect the new Work destination
- `lib/api.ts` - hardcoded Work nav path now resolves to `/work`

## Decisions Made

- Kept the navigation visual language untouched while changing only destination semantics.
- Folded the fallback menu and nav config cleanup into the same plan so future refactors cannot resurrect stale Work anchors.

## Deviations from Plan

- Both tasks were committed together because the route-target sweep and fallback cleanup were safest as a single consistency pass.

## Issues Encountered

- A stale `.git/index.lock` briefly blocked the second commit attempt, but no active git process was running and the follow-up commit completed cleanly.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase `04-03` can now verify desktop/mobile discovery paths and the live Sanity reorder loop without additional routing changes.
- Phase `05` inherits a cleaner route surface because the homepage-anchor Work discovery path is no longer active in shared app code.

## Self-Check

PASSED

- Verified the navigation files now route Work discovery through `/work`.
- Verified implementation commit `5229595` exists in git history.

---
*Phase: 04-home-curation-and-navigation*
*Completed: 2026-04-16*

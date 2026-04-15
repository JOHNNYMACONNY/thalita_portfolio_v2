---
phase: 01-sanity-foundation
plan: 01
subsystem: infra
tags: [sanity, next-sanity, cms, nextjs]
requires: []
provides:
  - Embedded Sanity Studio mounted at `/studio`
  - Shared Sanity environment, client, and image helper modules
  - Sanity CLI and Studio config ready for later schema registration
affects: [schema, work-migration, studio]
tech-stack:
  added: [sanity, next-sanity, @sanity/image-url]
  patterns: [embedded-studio-route, centralized-sanity-env, shared-sanity-client]
key-files:
  created:
    - sanity/env.ts
    - sanity.cli.ts
    - sanity/lib/client.ts
    - sanity/lib/image.ts
    - sanity.config.ts
    - app/studio/[[...tool]]/page.tsx
  modified:
    - package.json
    - package-lock.json
key-decisions:
  - "Embed Studio inside the existing App Router app at `/studio` instead of a separate Sanity project."
  - "Centralize Sanity project configuration in `sanity/env.ts` and reuse it from the CLI, Studio, and query helpers."
patterns-established:
  - "Sanity runtime code lives under `sanity/` and stays isolated from the legacy filesystem content layer."
  - "The Studio route mounts `NextStudio` directly through `app/studio/[[...tool]]/page.tsx`."
requirements-completed: [SAN-01, SAN-02]
duration: 9min
completed: 2026-04-14
---

# Phase 01 Plan 01: Sanity Foundation Summary

**Embedded Sanity Studio foundation with shared env, client, image, and CLI modules for the Next.js app**

## Performance

- **Duration:** 9 min
- **Started:** 2026-04-14T09:03:00Z
- **Completed:** 2026-04-14T09:11:37Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments
- Added the required Sanity packages and a fail-fast public env module for project and dataset configuration.
- Introduced shared CLI, client, and image helper modules for consistent Sanity access across later plans.
- Embedded Sanity Studio under `/studio` with the official catch-all App Router entrypoint.

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Sanity packages and add the shared env module** - `f7e8751` (chore)
2. **Task 2: Add the CLI config and shared client modules** - `12bd752` (feat)
3. **Task 3: Embed Studio at /studio with shared config** - `67e0c1d` (feat)

## Files Created/Modified
- `package.json` - Adds the Sanity runtime dependencies required by later schema and query work.
- `package-lock.json` - Locks the installed Sanity dependency graph.
- `sanity/env.ts` - Exposes validated public Sanity env values, default API version, Studio URL, and CDN usage.
- `sanity.cli.ts` - Wires the Sanity CLI to the shared project and dataset config.
- `sanity/lib/client.ts` - Provides a centralized `next-sanity` client with published perspective.
- `sanity/lib/image.ts` - Exposes `urlFor()` through Sanity's image URL builder.
- `sanity.config.ts` - Defines the embedded Studio config with `basePath: "/studio"` and empty schema registration for this plan.
- `app/studio/[[...tool]]/page.tsx` - Mounts `NextStudio` for all Studio subroutes.

## Decisions Made
- Embedded Studio directly inside the existing Next.js app to preserve the current shell and deployment model.
- Kept schema registration empty in this plan so the schema work can land separately in Plan `01-02` without violating wave ordering.
- Left the legacy markdown/Decap flow intact and isolated all Sanity code in new modules under `sanity/`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed generated macOS `._*` metadata files before repo-wide lint**
- **Found during:** Task 2 and Task 3 verification
- **Issue:** ESLint treated AppleDouble metadata files as source files and failed with parsing errors, blocking the required whole-repo lint check.
- **Fix:** Deleted generated `._*` files with `find . -name '._*' -delete` before rerunning `npm run lint`.
- **Files modified:** none (generated metadata files removed)
- **Verification:** `npm run lint` completed with warnings only and no errors afterward.
- **Committed in:** not applicable (generated-file cleanup only)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The cleanup was required for verification only. No scope creep or source behavior changes were introduced.

## Issues Encountered
- Repo-wide lint still reports pre-existing warnings in `app/about/page.tsx` and `public/admin/cms.js`, but there are no lint errors after the Sanity foundation changes.

## User Setup Required

Manual Sanity project configuration is still required for live Studio use:
- Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to the app environment.
- Optionally add `NEXT_PUBLIC_SANITY_API_VERSION`; otherwise the app defaults to `2026-03-01`.
- Add the local and production app origins to Sanity CORS settings with authenticated requests enabled for embedded Studio.

## Next Phase Readiness
- The repo is ready for schema work in Plan `01-02`; the Studio route and shared runtime modules are in place.
- No code blockers remain inside this plan's scope.

---
*Phase: 01-sanity-foundation*
*Completed: 2026-04-14*

## Self-Check: PASSED

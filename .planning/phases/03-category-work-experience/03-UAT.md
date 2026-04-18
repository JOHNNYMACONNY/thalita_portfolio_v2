---
phase: 03
plan: 03-03
status: approved
last_updated: 2026-04-16
---

# Phase 03 UAT: Work Route Verification

## Scope

Validate the final Phase 3 Work route set:

- `/work`
- `/work/editorial`
- `/work/commercial`
- `/work/personal-styling`
- `/studio`

This UAT is intentionally split between:

- zero-item verification for the fresh-start dataset
- live-item verification after a human creates and publishes a visible `galleryItem`

## Preconditions

- Run the site locally with the same Sanity dataset used for Phase 3.
- Confirm the three category documents remain published in Studio:
  - `editorial`
  - `commercial`
  - `personal-styling`

## Automated Verification Completed Before Checkpoint

- [x] `npm run build`

## Human Verification Steps

### 1. Work Landing Page

- [x] Open `/work`.
- [x] Confirm exactly three category cards render.
- [x] Confirm the titles are `Editorial`, `Commercial`, and `Personal Styling`.
- [x] Confirm each card shows a cover image and an `Explore` affordance.
- [x] Confirm the layout feels composed on both desktop and mobile widths.

### 2. Zero-Item Category States

- [x] Open `/work/editorial` before adding any new gallery items.
- [x] Open `/work/commercial` before adding any new gallery items.
- [x] Open `/work/personal-styling` before adding any new gallery items.
- [x] Confirm each page shows category identity clearly.
- [x] Confirm the empty state reads as intentional editorial copy, not a broken grid.
- [x] Confirm no cache-busting workaround or code change was needed to see the empty state.

### 3. Live Published Item From Studio

- [x] Open `/studio`.
- [x] Create one visible `galleryItem`.
- [x] Assign it to exactly one category.
- [x] Publish it.
- [x] Refresh the matching `/work/[slug]` route.
- [x] Confirm the image appears in the correct category gallery.
- [x] Confirm no code change, server restart, or cache-busting workaround was needed beyond a normal page refresh.

## Verification Record

### Zero-Item Review

- Date: 2026-04-15
- Reviewer: Codex browser check via Playwright
- Result: PASS for `/work`, `/work/editorial`, `/work/commercial`, and `/work/personal-styling`
- Notes: `/work` rendered the three expected category cards. Each category route rendered clear category identity and intentional zero-item copy. Console output on the Phase 3 routes was limited to normal React DevTools/HMR development messages; the `PortfolioGrid received 0 projects` error reproduced only on `/`, which remains the Phase 4 homepage migration path.

### Live-Item Review

- Date: 2026-04-16
- Reviewer: User confirmation in local Studio/browser
- Tested category slug: `editorial`
- Gallery item title: `test`
- Result: PASS
- Appeared after normal refresh only: `yes`
- Notes: The newly published editorial item appeared on `/work/editorial` after a normal page refresh. A separate console error on `/` continued to come from the legacy homepage `PortfolioGrid` path and is deferred to Phase 4.

## Outcome

- Final approval status: `approved`
- Follow-up issues:
  - Homepage `/` still logs the known legacy `PortfolioGrid received 0 projects` warning while the home experience remains on the Phase 4 data path.

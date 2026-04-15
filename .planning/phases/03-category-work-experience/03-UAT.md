---
phase: 03
plan: 03-03
status: awaiting-human-verification
last_updated: 2026-04-14
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

- [ ] Open `/work`.
- [ ] Confirm exactly three category cards render.
- [ ] Confirm the titles are `Editorial`, `Commercial`, and `Personal Styling`.
- [ ] Confirm each card shows a cover image and an `Explore` affordance.
- [ ] Confirm the layout feels composed on both desktop and mobile widths.

### 2. Zero-Item Category States

- [ ] Open `/work/editorial` before adding any new gallery items.
- [ ] Open `/work/commercial` before adding any new gallery items.
- [ ] Open `/work/personal-styling` before adding any new gallery items.
- [ ] Confirm each page shows category identity clearly.
- [ ] Confirm the empty state reads as intentional editorial copy, not a broken grid.
- [ ] Confirm no cache-busting workaround or code change was needed to see the empty state.

### 3. Live Published Item From Studio

- [ ] Open `/studio`.
- [ ] Create one visible `galleryItem`.
- [ ] Assign it to exactly one category.
- [ ] Publish it.
- [ ] Refresh the matching `/work/[slug]` route.
- [ ] Confirm the image appears in the correct category gallery.
- [ ] Confirm no code change, server restart, or cache-busting workaround was needed beyond a normal page refresh.

## Verification Record

### Zero-Item Review

- Date:
- Reviewer:
- Result:
- Notes:

### Live-Item Review

- Tested category slug:
- Gallery item title:
- Result:
- Appeared after normal refresh only: `yes | no`
- Notes:

## Outcome

- Final approval status: `pending`
- Follow-up issues:

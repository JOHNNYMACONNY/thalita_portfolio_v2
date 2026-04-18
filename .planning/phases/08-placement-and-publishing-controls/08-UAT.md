# Phase 08 UAT

**Date:** 2026-04-18
**Status:** Approved
**Phase:** 08-placement-and-publishing-controls

## Scope

- Confirm placement badges explain where each image will appear.
- Confirm category and homepage ordering can be changed from the organizer.
- Confirm the public query layer now respects category-specific ordering.

## Automated Verification Completed

- `npm run lint` — passed with one pre-existing warning in `app/about/page.tsx` for an unused local variable
- `npm run build` — passed
- Browser verification via Playwright:
  - `/work` loaded successfully after the ordering/query changes
  - `/studio` loaded without console errors in the local browser session

## Manual Verification Results

- Signed-in Studio check completed and approved by the user.
- Confirmed the live organizer shows:
  - placement badges on photo cards for category slot, visibility, and homepage placement
  - the `Home page rail` with reorder controls
  - category-slot reorder controls inside the organizer columns
- Result: Phase 08 placement visibility and visual-ordering controls are present in the live Studio session and were approved by the user.

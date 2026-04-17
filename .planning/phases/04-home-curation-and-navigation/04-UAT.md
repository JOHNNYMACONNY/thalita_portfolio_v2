# Phase 04 UAT

**Date:** 2026-04-16
**Status:** Approved
**Phase:** 04-home-curation-and-navigation

## Scope

Verify that:

- the homepage Work section is driven by the curated home-gallery flow
- desktop and mobile Work discovery paths land on `/work`
- Sanity `homePageOrder` changes are reflected on the homepage

## Automated Verification Completed

### Build and lint

- `npm run lint -- app/page.tsx components/HomeGalleryGrid.tsx sanity/lib/work.ts` — passed
- `npm run lint -- components/Header.tsx components/Hero.tsx components/NavigationOverlay.tsx lib/api.ts components/OverlayMenu.tsx components/HomeGalleryGrid.tsx app/page.tsx` — passed
- `npm run build` — passed

### Browser verification completed locally via Playwright

- Desktop header Work link exposed `/work` and successfully routed to `/work`
- Mobile overlay Work link exposed `/work` and successfully routed to `/work`
- Hero CTA `View Selected Works` now exposes `/work` in the homepage snapshot
- Homepage Work section currently renders the intentional zero-curated state instead of the legacy project grid

## Current Homepage State

- Observed state: zero curated home items published
- Homepage message shown: "The home curation rail is ready for its next published selection."
- Result: `HOME-01` empty-state behavior appears intentional and stable

## Manual Verification Results

### 1. Confirm hero CTA route manually

- Open `/`
- Click `View Selected Works`
- Confirm it lands on `/work`

Result:
- [x] Passed
- Notes: Approved by user after completing the manual verification step outside the agent session.

### 2. Confirm curated items appear on the homepage

- In `/studio`, ensure at least one visible `galleryItem` has `showOnHomePage` enabled
- Open `/`
- Confirm the homepage shows only curated home items, not the full category inventory

Result:
- [x] Passed
- Item titles observed: User approved the manual verification, but the specific curated item titles were not reported in-thread.
- Notes: Approval confirms the homepage rendered curated home content rather than the full inventory during the user-run Studio check.

### 3. Confirm `homePageOrder` reorder behavior

- In `/studio`, pick at least two visible curated `galleryItem` documents
- Record their current homepage order
- Change their `homePageOrder` values and publish
- Refresh `/`
- Confirm the homepage order matches the new published order without code changes or workaround refreshes

Result:
- [x] Passed
- Items tested: User approved the reorder verification, but the exact item titles were not reported in-thread.
- Order before: Approved by user; detailed sequence not captured in the terminal transcript.
- Order after: Approved by user; detailed sequence not captured in the terminal transcript.
- Notes: Manual Studio reorder proof was approved, satisfying the blocking checkpoint even though the exact editorial item names were not relayed back in the session.

## Completion Gate

Phase 04 manual verification was approved by the user on 2026-04-16. Exact curated item names and before/after order were not captured in the terminal transcript, so that limitation is recorded explicitly above.

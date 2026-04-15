# Phase 03 Research

## Goal

Build the new Work browsing experience around Sanity-backed categories and category galleries while preserving the current editorial visual language.

## Inputs Reviewed

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/phases/02-data-layer-migration/02-RESEARCH.md`
- `.planning/phases/02-data-layer-migration/02-SOURCE-AUDIT.md`
- `.planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md`
- `app/page.tsx`
- `app/work/[slug]/page.tsx`
- `components/PortfolioGrid.tsx`
- `components/ProjectCard.tsx`
- `components/Header.tsx`
- `components/Hero.tsx`
- `components/NavigationOverlay.tsx`
- `components/OverlayMenu.tsx`
- `app/types/index.ts`
- `sanity/lib/work.ts`
- `sanity/lib/queries.ts`
- `next.config.ts`

## Current State

- The homepage still renders Work inside `/#portfolio` via `getLegacyProjectsFromSanity()` in `app/page.tsx`.
- `components/PortfolioGrid.tsx` still links cards to `/work/${project.slug}` using the legacy bridge shape.
- The only `app/work` route today is `app/work/[slug]/page.tsx`, and it is still a legacy project-detail page powered by `getLegacyProjectBySlugFromSanity()`.
- Shared navigation still points to `/#portfolio` or `#portfolio`, which roadmap Phase 4 explicitly owns.
- Phase 2 established the real Work helper layer in `sanity/lib/work.ts`:
  - `getWorkCategories()`
  - `getGalleryItemsByCategorySlug()`
  - `getHomeGalleryItems()`
- The user has now seeded and published the three category documents in Studio:
  - `Editorial` / `editorial`
  - `Commercial` / `commercial`
  - `Personal Styling` / `personal-styling`
- The dataset intentionally starts with zero gallery items.
- The About/profile image remains out of scope for Work and should be handled in a later About or site-settings CMS phase.

## Key Planning Implications

### 1. `/work/[slug]` should become the category route

Phase 3 needs category pages under the simplified Work IA. Because the project is now on a fresh-start dataset with no legacy imported project pages to preserve, the cleanest approach is to repurpose `app/work/[slug]/page.tsx` from legacy project detail to category gallery.

This keeps the public route shape aligned with the roadmap goal:

- `/work`
- `/work/editorial`
- `/work/commercial`
- `/work/personal-styling`

It also avoids inventing a temporary route like `/work/category/[slug]` that would immediately become legacy debt.

### 2. Phase 3 should not repoint global nav yet

The repo still contains multiple `/#portfolio` links, but roadmap Phase 4 owns:

- header navigation
- hero CTA
- overlay/navigation links
- homepage curation changes

Phase 3 should therefore focus on building the new `/work` and `/work/[slug]` experiences, not on changing the site-wide navigation contract.

### 3. Empty states are first-class, not fallback polish

Because the dataset intentionally has zero gallery items today, empty-state behavior is not a corner case. Phase 3 must treat this as a primary behavior:

- `/work` should still show the three category cards from Sanity
- `/work/[slug]` should render a polished empty gallery state when a category has no visible items
- category identity must remain clear even when no images exist yet

### 4. Sanity image delivery is a likely implementation dependency

`next.config.ts` currently only allows `res.cloudinary.com` in `images.remotePatterns`. Phase 3 category cards and gallery pages depend on Sanity-hosted images, so the implementation will likely need a narrow config touch to allow Sanity CDN assets.

This does not change the Phase 5 cleanup requirement. It only means a minimal enabling change may be necessary earlier so Phase 3 can actually render category media.

### 5. Existing presentation patterns can be preserved

The current site language is already strong enough for Phase 3:

- oversized typography
- sharp-edged image crops
- simple motion reveals
- minimal overlays and restrained chrome

The new Work routes should reuse and adapt these patterns rather than introducing a redesign.

## Recommended Route and Component Direction

### `/work`

Use `getWorkCategories()` to render three category cards with:

- cover image
- title
- short description
- clear link to the category page

Recommended component split:

- `app/work/page.tsx` as the server route
- a dedicated category-card component rather than reusing `ProjectCard` directly

Reason:
- `ProjectCard` is title/category/project-detail oriented
- category cards need description-driven browse behavior instead of project metadata

### `/work/[slug]`

Use category-derived static params and fetch:

- category identity from `getWorkCategories()`
- images from `getGalleryItemsByCategorySlug(slug)`

Recommended page behaviors:

- `generateStaticParams()` from the seeded category slugs
- `notFound()` for unknown slugs
- category header with title/description
- image gallery using visible `galleryItem` documents only
- intentional empty state when no items exist

## Risks

- If Sanity image URLs are not allowed in `next.config.ts`, category cards and gallery pages may fail at runtime.
- The current repo still carries legacy bridge helpers and `Project`-shaped UI expectations, so Phase 3 should avoid reusing project-detail assumptions where category-first components are clearer.
- Homepage and nav still point to `/#portfolio`, so users may not discover `/work` organically until Phase 4 unless direct links are used during verification.

## Dependencies

- Phase 2 helper layer must remain the canonical data source for categories and gallery items.
- The three seeded categories must stay published in Studio.
- Manual verification should include at least one real or temporary gallery item so CAT-01 can be tested with visible content, even though the implementation must also support zero-item categories.

## Recommended Plan Slices

- `03-01-PLAN.md`
  - Add `/work` landing route
  - Add category-card presentation component(s)
  - Fetch and render the three seeded categories from Sanity

- `03-02-PLAN.md`
  - Repurpose `/work/[slug]` into a category gallery route
  - Build gallery rendering for category images
  - Add category-based static params and not-found handling

- `03-03-PLAN.md`
  - Tune mobile/desktop presentation
  - Add polished empty states and failure handling
  - Verify route behavior against the fresh-start dataset plus at least one manually created gallery item

## Recommendation

Phase 3 should treat the fresh-start dataset as a product decision, not a temporary inconvenience. Build the Work landing page and category routes so they feel complete with zero images, then verify the gallery path with one manually created item per category or a smaller editorial spot check before Phase 4 repoints navigation.

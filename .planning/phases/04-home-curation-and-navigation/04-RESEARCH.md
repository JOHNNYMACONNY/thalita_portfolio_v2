# Phase 04 Research

## Goal

Shift the homepage and shared Work navigation to the Sanity-backed category/gallery model while preserving the site's current editorial tone and motion language.

## Inputs Reviewed

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/phases/03-category-work-experience/03-RESEARCH.md`
- `.planning/phases/03-category-work-experience/03-VALIDATION.md`
- `app/page.tsx`
- `components/PortfolioGrid.tsx`
- `components/Header.tsx`
- `components/Hero.tsx`
- `components/NavigationOverlay.tsx`
- `components/OverlayMenu.tsx`
- `lib/api.ts`
- `app/types/index.ts`
- `sanity/lib/work.ts`
- `sanity/lib/queries.ts`
- `sanity/schemaTypes/documents/galleryItem.ts`

## Current State

- The homepage still reads Work content through `getLegacyProjectsFromSanity()` in `app/page.tsx`, which preserves the old project-centric bridge instead of the approved home-curation model.
- The homepage section is still anchored as `#portfolio`, and `Hero`, `Header`, `NavigationOverlay`, and `lib/api.ts` still point Work navigation at `/#portfolio` or `#portfolio`.
- `components/PortfolioGrid.tsx` assumes `Project` records and links each tile to `/work/${project.slug}`, which is now the category-gallery route rather than a project-detail route.
- Phase 2 and Phase 3 already established the canonical helper and route model needed for this phase:
  - `getHomeGalleryItems()` returns visible `galleryItem` documents where `showOnHomePage == true`
  - `homeWorkGalleryItemsQuery` orders by `homePageOrder asc, _createdAt asc`
  - `/work` and `/work/[slug]` now represent the public Work IA
- The Sanity schema already exposes the exact editorial controls this phase needs:
  - `showOnHomePage`
  - `homePageOrder`
- There is no `04-CONTEXT.md`, so planning must rely on roadmap requirements, the current implementation, and earlier phase decisions.

## Key Planning Implications

### 1. The homepage needs a home-specific gallery presentation, not the legacy project grid

`PortfolioGrid` is shaped around a legacy `Project` bridge:

- project title
- project-derived category label
- project slug links

Phase 4 should either replace or retire that usage on the homepage rather than stretching it around gallery-item data. A dedicated home gallery component is the safer path because it can:

- render image-led curated selections
- avoid project-detail assumptions
- keep any click behavior aligned with `/work` or category pages instead of nonexistent project destinations

### 2. Navigation repointing is broader than three visible links

The roadmap names header, overlay navigation, and hero CTA, but the codebase still has a second navigation source in `lib/api.ts` and an older `OverlayMenu.tsx` implementation that also references `#portfolio`.

Phase 4 should treat navigation repointing as a consistency sweep:

- active desktop header link
- active mobile overlay link
- hero primary CTA
- hardcoded site nav config
- any reachable fallback overlay/menu component still carrying legacy Work anchors

### 3. Home curation order must remain helper-driven

The editor-facing ordering rule is already modeled in Sanity. Phase 4 should not duplicate ordering in UI code or re-sort items in a way that undermines `homePageOrder`.

The safest rule is:

- trust `getHomeGalleryItems()` as the canonical ordering source
- preserve returned order in the homepage renderer
- verify the visible order manually by changing `homePageOrder` in Studio

### 4. Empty curated state is plausible and should feel intentional

The dataset began as a fresh-start migration. Even if current content exists, the implementation should still behave cleanly when zero items are marked for the home page.

That means the homepage should not:

- log misleading legacy stability warnings
- render an empty gap where Work used to be
- fall back to all visible gallery items automatically

If no items are curated for home, the section should still feel editorially deliberate and continue to route people into `/work`.

### 5. Phase 4 is the first point where `/work` becomes the primary discovery path

Phase 3 intentionally left global discovery alone. Once Phase 4 lands:

- `/work` becomes the canonical browse entry point from site chrome
- the home page becomes a curated teaser for the full Work experience
- any remaining legacy bridge behavior on the home page becomes active UX debt and should be removed from the route

## Risks

- Reusing `PortfolioGrid` without changing its route assumptions could send visitors from homepage tiles into category slugs as though they were project details.
- Updating only visible nav components while leaving `lib/api.ts` or dormant overlay code on legacy anchors creates internal drift and future regressions.
- A zero-curation state could silently collapse the homepage Work section if implementation keeps the current "return null on empty" pattern.
- Manual verification is required for `homePageOrder`; automated checks alone cannot prove the real editorial reorder loop in Studio.

## Dependencies

- Phase 3 routes must remain the canonical public Work destination: `/work` and `/work/[slug]`
- `getHomeGalleryItems()` and the `homeWorkGalleryItemsQuery` ordering contract remain the source of truth for curated home content
- The `galleryItem` schema must continue enforcing `homePageOrder` when `showOnHomePage` is enabled

## Recommended Plan Slices

- `04-01-PLAN.md`
  - Replace the homepage Work section data source with `getHomeGalleryItems()`
  - Introduce a home-specific curated gallery presentation
  - Remove legacy project-detail assumptions from the home route

- `04-02-PLAN.md`
  - Repoint header, mobile overlay, hero CTA, and nav config from `/#portfolio` to `/work`
  - Sweep any reachable fallback menu implementation for the same legacy anchor
  - Keep the visual language intact while updating route targets

- `04-03-PLAN.md`
  - Harden desktop/mobile behavior and empty curated-state presentation
  - Record manual UAT for route targets plus Studio-driven home reordering
  - Verify that homepage item order matches Sanity `homePageOrder`

## Recommendation

Phase 4 should make the homepage a curated preview of the new Work IA instead of a disguised legacy portfolio page. The cleanest approach is to give the home route its own image-led gallery component, repoint every Work entry path to `/work`, and close the phase with a manual Sanity reorder check so `HOME-02` is proven against the live editorial workflow.

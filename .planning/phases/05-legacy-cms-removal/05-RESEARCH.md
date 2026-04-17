# Phase 05 Research

## Goal

Remove the obsolete markdown/Decap Work stack now that the Sanity-backed category and home-curation flow is live and verified, while leaving the current public Work routes stable.

## Inputs Reviewed

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/phases/04-home-curation-and-navigation/04-UAT.md`
- `app/layout.tsx`
- `app/portfolio/page.tsx`
- `app/work/page.tsx`
- `app/work/[slug]/page.tsx`
- `app/types/index.ts`
- `sanity/lib/work.ts`
- `sanity/lib/queries.ts`
- `sanity/schemaTypes/documents/galleryItem.ts`
- `next.config.ts`
- `netlify.toml`
- `package.json`
- `README.md`
- `public/admin/index.html`
- `public/admin/config.yml`
- `public/admin/cms.js`
- `public/admin/admin.css`
- `public/admin/admin-preview.css`

## Current State

- Phase 4 is complete and approved, so the public Work discovery path now flows through:
  - `/work`
  - `/work/[slug]` as category galleries
  - homepage curated items
  - shared navigation targeting `/work`
- The repo still carries several legacy Work/Decap remnants:
  - `app/portfolio/page.tsx` hardcoded Cloudinary portfolio route
  - `public/admin/*` Decap CMS assets and config
  - `next.config.ts` rewrite from `/admin` to the static Decap entrypoint
  - `app/layout.tsx` loading the Netlify Identity widget
  - `package.json` script `dev:admin`
- The Sanity Work helper layer still exposes temporary legacy bridge behavior:
  - `getLegacyProjectsFromSanity()`
  - `getLegacyProjectBySlugFromSanity()`
  - `getLegacyProjectSlugsFromSanity()`
  - legacy GROQ queries
  - `Project`/`LegacyProjectBridge` types still kept only for the overlap path
  - `galleryItem` schema fields like `legacyProjectSlug` and `legacyFeaturedOrder`
- `next.config.ts` still allows both `res.cloudinary.com` and `cdn.sanity.io`, and `images.unoptimized: true` remains enabled.
- `README.md` still documents `public/admin/` as part of the project structure even though the active CMS path is now Sanity Studio at `/studio`.

## Key Planning Implications

### 1. `/work/[slug]` should stay, but the legacy bridge beneath it should not

The roadmap wording says "Legacy `/work/[slug]` pages" should be removed, but Phase 3 intentionally repurposed that path into the approved category gallery route.

Phase 5 therefore should remove:

- legacy project-detail logic
- legacy bridge helpers and provenance-only code that exists solely for that old route

Phase 5 should **not** remove:

- the `/work/[slug]` route path itself
- category-gallery rendering or category static params

### 2. Decap removal touches routing, scripts, and deployment glue together

Decap is not just the `public/admin` folder. The full removal surface includes:

- static admin assets
- rewrite config in `next.config.ts`
- Netlify Identity widget in `app/layout.tsx`
- any scripts or docs that still describe Decap as active

This argues for a dedicated plan slice so the repo does not end up half-removed with dead config still referenced at runtime.

### 3. The legacy provenance fields need judgment, not blind deletion

Some `legacy*` fields are now clearly obsolete for runtime behavior, but they may still have short-term value in the dataset for audit/history.

The safest implementation direction is:

- remove runtime dependence on legacy bridge fields first
- then remove schema/query/type surface that only exists for the old route
- preserve audit artifacts under `.planning/` and `sanity/migrations/out/` unless they actively break the app or tooling

### 4. Image/deployment cleanup should target active assumptions, not just remove settings at random

`MIG-03` is about supporting the Sanity-backed experience cleanly. That likely means:

- removing Cloudinary allowlisting if no active route depends on it after `app/portfolio/page.tsx` is gone
- re-evaluating whether `images.unoptimized: true` is still necessary with the current Netlify image setup
- confirming Netlify redirects/config still match the active image strategy

This should be treated as a verification-and-cleanup plan, not just a config delete.

### 5. README and docs need to reflect the real editorial workflow

Once Decap is removed, docs that still mention `public/admin` or imply the old CMS flow become operationally misleading.

Phase 5 should leave the repo telling one coherent story:

- Sanity Studio at `/studio`
- category/gallery/home-curation managed in Sanity
- no active markdown/Decap Work management path

## Risks

- Removing the wrong pieces from `sanity/lib/work.ts` could break current category/gallery routes if cleanup is not scoped carefully.
- Deleting `public/admin` without removing rewrites/scripts/widget glue leaves dead config and confusing runtime behavior.
- Narrowing image config too aggressively could break surviving assets or deployed image delivery.
- README drift after cleanup would make future setup harder even if the app code is correct.

## Dependencies

- Phase 4 UAT approval is the gate that makes Decap/legacy cleanup safe.
- The category-gallery route and homepage curation flow must remain untouched as the active public experience.
- Any final image config changes must still work with Sanity CDN assets in production.

## Recommended Plan Slices

- `05-01-PLAN.md`
  - Remove obsolete Work routes/components and legacy runtime bridge code
  - Keep `/work` and category routes stable
  - Remove app/runtime dependence on legacy project helpers

- `05-02-PLAN.md`
  - Remove Decap assets, rewrites, scripts, and Netlify Identity integration
  - Update docs to describe Sanity as the only active Work CMS path

- `05-03-PLAN.md`
  - Finalize image/deployment cleanup
  - Trim leftover markdown Work content and obsolete assumptions
  - Run regression verification across `/`, `/work`, `/work/[slug]`, and `/studio`

## Recommendation

Phase 5 should be treated as a cleanup-and-hardening pass, not a redesign. The safest path is to first remove the legacy Work runtime bridge, then remove Decap and Netlify Identity together, and finally tighten image/config/docs with a regression pass that proves the Sanity-backed experience still holds end to end.

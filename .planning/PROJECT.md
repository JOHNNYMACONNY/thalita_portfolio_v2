# Thalita Portfolio Content Migration

## What This Is

This project is an editorial portfolio site for Thalita Bueno built in Next.js. The current site already ships a file-based portfolio, services, about, and contact experience; the active initiative is to replace the project-centric Work implementation with a Sanity-backed, category-and-image-centric gallery while preserving the site's visual identity.

The intended end state is a home page that shows a curated set of images, a dedicated Work landing page with three category cards, and category pages that display all images in each category. Decap CMS and the old markdown project model will be retired once the Sanity-backed flow is live and verified.

## Core Value

Editors can manage a polished portfolio gallery through Sanity while visitors browse a cleaner, category-driven Work experience without losing the site's existing aesthetic quality.

## Requirements

### Validated

- ✓ Home, about, services, and contact pages render in the current Next.js App Router site — existing
- ✓ The current site can display portfolio cards and project detail pages from local markdown content — existing
- ✓ The site already supports editorial image presentation, custom typography, and animated navigation patterns — existing
- ✓ Contact form submission is wired through Netlify forms — existing

### Active

- [ ] Replace markdown project loading with a Sanity-backed content model for categories and gallery items
- [ ] Convert Work into a landing page with three category cards and dedicated category gallery pages
- [ ] Curate homepage gallery content through a CMS flag instead of rendering every project
- [ ] Remove legacy project detail pages and Decap CMS once the new flow is stable

### Out of Scope

- Keeping `/work/[slug]` project story pages — the new information architecture is category/image-centric
- Rebuilding About, Services, or Contact around Sanity in this initiative — those can remain on current content storage unless later prioritized
- Redesigning the site's established editorial visual language — preserve the current look while changing data flow and route structure
- Expanding the Work taxonomy beyond three canonical categories during this migration — lock scope so route and CMS work stay focused

## Context

This is a brownfield Next.js 16 portfolio using App Router, TypeScript, Tailwind v4, and Framer Motion. Today the portfolio content is stored as markdown files in `content/projects/*.md` and read synchronously via `lib/api.ts`, while Decap CMS under `public/admin/` writes those markdown and JSON files through Netlify Git Gateway and Netlify Identity.

The current Work experience is project-centric: the home page renders all visible projects, each card links to `/work/[slug]`, and the detail page renders project metadata plus any gallery images attached to that markdown document. There is also an older disconnected `app/portfolio/page.tsx` route with hardcoded Cloudinary content that should be removed during the migration.

The approved direction is category/image-centric: home page stays visually familiar but becomes curated through a `showOnHomePage`-style flag, navigation points to a new `/work` landing page, category cards lead to category-specific image galleries, and Sanity becomes the source of truth for categories and gallery items. The migration should also remove Decap CMS, Netlify Identity usage tied to Decap, and the old markdown portfolio content after parity is verified.

## Constraints

- **Tech stack**: Continue using the existing Next.js App Router site — the migration should fit the current frontend architecture rather than replace the app shell
- **Visual continuity**: Preserve the established editorial styling and motion language — this is a content architecture migration, not a visual redesign
- **Route simplicity**: Work should resolve to `/work` plus category pages — avoid ambiguous coexistence with legacy `/work/[slug]`
- **CMS scope**: Sanity must manage categories and gallery items as first-class content — category cover images and homepage curation cannot remain hardcoded
- **Migration safety**: Remove Decap only after the Sanity-backed routes are working — avoid a gap where editors lose content management before the new path is live
- **Image delivery**: Next image configuration must support Sanity CDN assets — remote image handling needs to be updated during the migration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use a category/image-centric model instead of the current project-centric model | Matches the desired visitor flow and simplifies Work into landing + category pages | — Pending |
| Remove legacy `/work/[slug]` detail pages | They conflict with the new IA and add migration complexity without serving the approved end state | — Pending |
| Use Sanity for `category` and `galleryItem` documents | Editors need first-class category management, cover images, and homepage curation | — Pending |
| Keep non-Work content on current storage for now | Limits scope so the migration can focus on Work architecture and CMS replacement | — Pending |
| Treat homepage curation as CMS-driven via a boolean flag and explicit ordering | Prevents the home page from rendering the full gallery while giving editorial control | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-13 after initialization*

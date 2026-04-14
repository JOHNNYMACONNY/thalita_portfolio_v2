# Roadmap: Thalita Portfolio Content Migration

## Overview

This roadmap moves the existing portfolio from markdown-backed project pages to a Sanity-backed category and image gallery without discarding the current site shell or editorial presentation. The work starts by establishing Sanity as a safe parallel content source, then migrates Work routing and homepage curation, and finally removes legacy project and Decap infrastructure once the new flow is proven.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Sanity Foundation** - Add Sanity Studio, schema, and client configuration for category and gallery item content
- [ ] **Phase 2: Data Layer Migration** - Replace markdown portfolio reads with Sanity queries and import legacy content
- [ ] **Phase 3: Category Work Experience** - Build the new Work landing page and category gallery routes
- [ ] **Phase 4: Home Curation And Navigation** - Shift homepage Work content to curated gallery items and repoint navigation
- [ ] **Phase 5: Legacy CMS Removal** - Remove old project routes, Decap CMS, and leftover Work-specific legacy dependencies

## Phase Details

### Phase 1: Sanity Foundation
**Goal**: Sanity Studio is available inside the project, and the repo has a stable schema/config foundation for categories and gallery items.
**Depends on**: Nothing (first phase)
**Requirements**: SAN-01, SAN-02
**Success Criteria** (what must be TRUE):
1. Editor can create and edit category documents with title, slug, cover image, and order in Sanity
2. Editor can create and edit gallery item documents with image, alt text, category references, visibility, and home page curation fields
3. The repo contains Sanity client, schema, and environment wiring ready for frontend queries
**Plans**: 3 plans

Plans:
- [ ] 01-01: Install Sanity dependencies and add Studio/client configuration files
- [ ] 01-02: Define and register `category` and `galleryItem` schema types
- [ ] 01-03: Add environment documentation and baseline Studio access verification

### Phase 2: Data Layer Migration
**Goal**: The Work content source moves from local markdown parsing to Sanity queries, and legacy content is imported into the new model.
**Depends on**: Phase 1
**Requirements**: SAN-03, MIG-01
**Success Criteria** (what must be TRUE):
1. Next.js data helpers can fetch visible categories and gallery items from Sanity
2. Existing markdown portfolio content has been migrated into Sanity with preserved category assignments and required imagery
3. The app no longer depends on `content/projects/*.md` for active Work data
**Plans**: 3 plans

Plans:
- [ ] 02-01: Refactor shared types and data helpers to use Sanity for Work content
- [ ] 02-02: Create and run a one-off migration path from markdown content into Sanity documents
- [ ] 02-03: Verify migrated content completeness and document any manual editorial cleanup needed

### Phase 3: Category Work Experience
**Goal**: Visitors can browse Work through a landing page of category cards and category-specific image galleries.
**Depends on**: Phase 2
**Requirements**: WORK-01, CAT-01, CAT-02, CAT-03
**Success Criteria** (what must be TRUE):
1. Visitor can open `/work` and see three category cards with cover images
2. Visitor can open each category page and see all visible images assigned to that category
3. The Work landing and category pages feel visually consistent with the current editorial design system
**Plans**: 3 plans

Plans:
- [ ] 03-01: Add `/work` landing route and category card presentation
- [ ] 03-02: Add category gallery route and gallery rendering components
- [ ] 03-03: Tune responsive behavior, empty states, and loading/error handling for new Work routes

### Phase 4: Home Curation And Navigation
**Goal**: The homepage and site navigation reflect the new Work structure without changing the site's overall aesthetic.
**Depends on**: Phase 3
**Requirements**: WORK-02, HOME-01, HOME-02
**Success Criteria** (what must be TRUE):
1. Home page shows only Sanity-curated gallery items flagged for home display
2. Header, overlay navigation, and hero CTA all send visitors to `/work`
3. Editors can reorder curated home items through Sanity and see that order reflected on the home page
**Plans**: 3 plans

Plans:
- [ ] 04-01: Replace the home Work grid data source with curated Sanity gallery items
- [ ] 04-02: Update navigation and CTA links away from `/#portfolio`
- [ ] 04-03: Verify homepage curation behavior across desktop and mobile layouts

### Phase 5: Legacy CMS Removal
**Goal**: The repo is cleaned of obsolete Work routes and Decap CMS infrastructure after the Sanity-backed flow is verified.
**Depends on**: Phase 4
**Requirements**: MIG-02, MIG-03
**Success Criteria** (what must be TRUE):
1. Legacy `/work/[slug]` and `app/portfolio/page.tsx` routes are removed without leaving broken navigation paths
2. Decap admin files, Netlify Identity usage tied to Decap, and obsolete config/scripts are removed
3. Next image configuration and deployment settings support the Sanity-backed Work experience cleanly
**Plans**: 3 plans

Plans:
- [ ] 05-01: Remove obsolete Work routes and unused presentation components
- [ ] 05-02: Remove Decap CMS assets, scripts, rewrites, and identity integration no longer needed
- [ ] 05-03: Finalize image config, cleanup leftover markdown portfolio content, and run regression verification

## Progress

**Execution Order:**
Phases execute in numeric order: 2 → 2.1 → 2.2 → 3 → 3.1 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Sanity Foundation | 0/3 | Not started | - |
| 2. Data Layer Migration | 0/3 | Not started | - |
| 3. Category Work Experience | 0/3 | Not started | - |
| 4. Home Curation And Navigation | 0/3 | Not started | - |
| 5. Legacy CMS Removal | 0/3 | Not started | - |

# Requirements: Thalita Portfolio Content Migration

**Defined:** 2026-04-13
**Core Value:** Editors can manage a polished portfolio gallery through Sanity while visitors browse a cleaner, category-driven Work experience without losing the site's existing aesthetic quality.

## v1 Requirements

### Sanity Foundation

- [x] **SAN-01**: Editor can manage exactly three visible Work categories in Sanity with title, slug, description, cover image, and display order
- [x] **SAN-02**: Editor can manage gallery items in Sanity with image, alt text, category references, visibility, and home page curation fields
- [x] **SAN-03**: Next.js app can fetch categories and gallery items from Sanity in production without relying on markdown project files

### Work Landing

- [x] **WORK-01**: Visitor can open `/work` and see three category cards with cover images and links to category pages
- [ ] **WORK-02**: Work navigation from header, overlay, and hero CTA routes to `/work` instead of `/#portfolio`

### Category Galleries

- [x] **CAT-01**: Visitor can open a category page and view all visible gallery images assigned to that category
- [x] **CAT-02**: Category page shows category identity clearly enough that visitors know which body of work they are browsing
- [ ] **CAT-03**: Category gallery pages render using the existing editorial visual language on desktop and mobile

### Home Curation

- [ ] **HOME-01**: Home page renders only gallery items flagged for home page display instead of all portfolio entries
- [ ] **HOME-02**: Editor can control the order of curated home page gallery items through Sanity

### Migration and Cleanup

- [x] **MIG-01**: The Work experience can start from an intentionally empty Sanity gallery dataset, with editors adding new categories and gallery items manually without relying on legacy markdown photo import
- [ ] **MIG-02**: Legacy `/work/[slug]` pages, `app/portfolio/page.tsx`, and Decap CMS admin assets are removed after replacement routes are verified
- [ ] **MIG-03**: Next.js image configuration supports Sanity-hosted images and no longer depends on legacy CMS assumptions for Work content

## v2 Requirements

### Extended CMS Coverage

- **CMS-01**: Editor can manage About, Services, and other site settings through Sanity
- **CMS-02**: Editor can manage richer gallery metadata such as captions, credits, or client stories if needed later

### Visitor Experience Extensions

- **EXP-01**: Visitor can filter or search within category galleries
- **EXP-02**: Visitor can open a lightbox or fullscreen gallery browsing experience

## Out of Scope

| Feature | Reason |
|---------|--------|
| Legacy project detail pages under `/work/[slug]` | The approved IA replaces project pages with category gallery pages |
| Additional Work taxonomy beyond three categories | Scope needs to stay constrained while route and CMS architecture change together |
| Full-site CMS migration for About/Services/Contact | Not necessary to achieve the Work migration goal |
| New visual redesign for the entire portfolio | Existing editorial styling should be preserved during this migration |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SAN-01 | Phase 1 | Complete |
| SAN-02 | Phase 1 | Complete |
| SAN-03 | Phase 2 | Complete |
| WORK-01 | Phase 3 | Complete |
| WORK-02 | Phase 4 | Pending |
| CAT-01 | Phase 3 | Complete |
| CAT-02 | Phase 3 | Complete |
| CAT-03 | Phase 3 | Pending |
| HOME-01 | Phase 4 | Pending |
| HOME-02 | Phase 4 | Pending |
| MIG-01 | Phase 2 | Complete |
| MIG-02 | Phase 5 | Pending |
| MIG-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 after initial definition*

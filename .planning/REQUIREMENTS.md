# Requirements: Thalita Portfolio Content Migration

**Defined:** 2026-04-16
**Core Value:** Editors can confidently upload, organize, and publish portfolio imagery without technical friction while visitors keep the polished category-first browsing experience.

## v1 Requirements

### Upload Workflow

- [x] **UPL-01**: Editor can batch upload multiple images into the Work library in one session
- [x] **UPL-02**: Upload flow shows thumbnail previews, progress, and failed-upload feedback clearly enough that the editor knows what happened
- [x] **UPL-03**: Newly uploaded images can land in an obvious `Unassigned` state instead of requiring immediate category decisions

### Organization

- [ ] **ORG-01**: Editor can see the three Work categories as obvious visual destinations when sorting photos
- [ ] **ORG-02**: Editor can bulk assign, reassign, or remove images from categories without opening every image individually
- [ ] **ORG-03**: Editor can quickly find unassigned or uncategorized images and understand which photos still need organization

### Placement And Publishing

- [ ] **PLC-01**: Editor can tell whether an image is visible on the site, hidden, or featured on the homepage
- [ ] **PLC-02**: Editor can reorder homepage and category image placement through a visual interaction rather than manual order-number editing
- [ ] **PLC-03**: Editor can review where an image will appear before publishing changes

### Editor Experience

- [x] **EDT-01**: The image-management workflow uses plain-language labels and guardrails so a non-technical editor does not need to understand Sanity internals

## v2 Requirements

### Extended Editorial Workflow

- **EDT-02**: Editor can upload directly from mobile-friendly flows optimized for phone photo management
- **EDT-03**: Editor can add richer image metadata such as captions, credits, or notes without cluttering the core upload workflow

### Public Experience Enhancements

- **EXP-01**: Visitor can open a richer lightbox or slideshow experience for category galleries
- **EXP-02**: Visitor can browse more advanced gallery filtering or search experiences later if needed

## Out of Scope

| Feature | Reason |
|---------|--------|
| Public-site redesign during this milestone | The user pain is editor workflow complexity, not the live portfolio presentation |
| More than three Work categories | This milestone should simplify the existing IA, not expand taxonomy complexity |
| Full-site CMS migration for About/Services/Contact | This cycle is specifically about photo management inside Work |
| Replacing Sanity Studio with a separate admin product | The goal is to improve the existing editorial system, not introduce a second one |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UPL-01 | Phase 6 | Complete |
| UPL-02 | Phase 6 | Complete |
| UPL-03 | Phase 6 | Complete |
| ORG-01 | Phase 7 | Pending |
| ORG-02 | Phase 7 | Pending |
| ORG-03 | Phase 7 | Pending |
| PLC-01 | Phase 8 | Pending |
| PLC-02 | Phase 8 | Pending |
| PLC-03 | Phase 8 | Pending |
| EDT-01 | Phase 6 | Complete |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-16*
*Last updated: 2026-04-17 after completing Phase 06 Upload Workflow Foundation*

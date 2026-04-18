# Thalita Portfolio Content Migration

## What This Is

This project is now a Sanity-backed editorial portfolio site for Thalita Bueno built in Next.js. The public site already ships a category-first Work experience with curated homepage imagery, and the new initiative is to make photo uploading and organization simple enough for a non-technical editor to manage confidently.

The next milestone focuses on editor experience rather than visitor-facing redesign: faster batch uploads, clearer category placement, and a much more intuitive way to control which images appear where on the site.

## Core Value

Editors can confidently upload, organize, and publish portfolio imagery without technical friction while visitors keep the polished category-first browsing experience.

## Current Milestone: v1.1 Simple Photo Management

**Goal:** Make image uploading and placement so intuitive that Thalita can manage the site comfortably without needing CMS expertise.

**Target features:**
- Batch upload many images in one session with clear progress and recovery feedback
- Show the three category destinations as obvious visual slots instead of abstract CMS fields
- Support fast bulk organization, reassignment, and cleanup of uploaded photos
- Make homepage/category placement and ordering visible enough that editors always know what is live on the site

## Requirements

### Validated

- ✓ Home, about, services, and contact pages render in the current Next.js App Router site — existing
- ✓ Contact form submission is wired through Netlify forms — existing
- ✓ Visitors can browse Work through `/work` and category-specific gallery pages — Phase 03
- ✓ Editors can manage Work categories and gallery items in Sanity Studio — Phase 01
- ✓ The homepage renders curated Sanity gallery items and shared Work navigation points to `/work` — Phase 04
- ✓ Legacy markdown Work routes, Decap CMS, and obsolete Work bridge code have been removed — Phase 05

### Active

- [ ] Batch upload photos into the Work library with clear progress, thumbnail feedback, and failure recovery
- [ ] Show uploaded images in a visual organizer with clear `Unassigned` and category-slot states
- [ ] Let editors bulk assign, reassign, hide, and organize images without editing one document at a time
- [ ] Make homepage/category placement and ordering obvious enough that editors always know what will show on the live site

### Out of Scope

- Redesigning the public portfolio UI during this milestone — the current site experience is already in a good place and this work is editor-facing
- Expanding beyond the three current Work categories — the editor UX should simplify the existing IA, not reopen taxonomy scope
- Moving About, Services, or Contact content into Sanity during this milestone — this cycle is focused on image-management friction inside Work
- Replacing Sanity Studio with a separate admin app — the goal is to simplify the existing system, not create a second CMS

## Context

The site has completed its migration from markdown-backed Work content to a Sanity-backed category and gallery model. The public browsing experience is now stable: homepage curation is live, `/work` is category-first, and legacy `/admin`, markdown project files, and temporary bridge code have been removed.

The remaining problem is editor usability. Thalita is non-technical and will likely be updating images, category assignments, and homepage visibility herself. The current data model works, but the default CMS experience still asks the editor to think in document/reference terms rather than in the natural mental model of "upload photos, sort them into categories, and choose what shows on the site."

The next milestone should therefore concentrate on custom editorial affordances inside the existing Studio workflow: batch intake, clear category slots, bulk operations, and placement clarity. Research references for this direction are captured in `.planning/research/v1.1-simple-photo-management.md`.

## Constraints

- **Tech stack**: Stay inside the existing Next.js + Sanity setup — simplify the current editor workflow instead of introducing a separate management product
- **Public-site stability**: Keep the live visitor experience stable while editor tooling evolves — this milestone should improve maintenance without reopening finished frontend migration work
- **Non-technical editor UX**: Optimize for plain-language actions and thumbnail-driven organization — Thalita should not need to understand slugs, references, or CMS internals
- **Scope discipline**: Preserve the existing three-category Work information architecture — the milestone is about easier management, not broader content modeling
- **Image-led interaction**: Prefer drag-and-drop, bulk actions, and visual placement cues — numerical ordering and single-record editing should be implementation details, not the primary workflow

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use a category/image-centric model instead of the old project-centric Work model | Matches the approved visitor flow and simplified Work IA | ✓ Good |
| Remove legacy `/work/[slug]` detail pages and Decap CMS | Avoids duplicate systems and keeps the live stack coherent | ✓ Good |
| Keep non-Work content on current storage for now | Limited the migration scope so Work could land cleanly first | ✓ Good |
| Treat homepage curation as CMS-driven and explicitly ordered | Gave editorial control without cluttering the public site | ✓ Good |
| Build the next milestone around editor workflow, not public redesign | The primary remaining pain is maintenance friction for a non-technical editor | — Pending |
| Prefer a custom Studio management surface over raw document editing for images | The natural workflow is photo-first and bulk-oriented rather than form-first | — Pending |

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
*Last updated: 2026-04-16 after starting milestone v1.1 Simple Photo Management*

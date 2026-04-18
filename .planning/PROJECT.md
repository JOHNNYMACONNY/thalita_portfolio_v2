# Thalita Portfolio Content Migration

## What This Is

This project is a Sanity-backed editorial portfolio site for Thalita Bueno built in Next.js. The public site now ships a category-first Work experience with curated homepage imagery, and the active effort is to make the Studio workflow complete enough that editors can publish finished photo changes without leaving the upload-and-organize flow.

## Core Value

Editors can confidently manage portfolio imagery from Studio without technical friction while visitors keep the polished category-first browsing experience.

## Requirements

### Validated

- ✓ Editors can upload many Work photos in one session and keep them safely unassigned until ready — `v1.1`
- ✓ Editors can visually organize Work photos across the three category slots and homepage rail — `v1.1`
- ✓ Editors can understand placement, visibility, and ordering before anything appears on the public site — `v1.1`

### Active

- [ ] Let editors understand draft versus published state from the Studio photo workflow itself
- [ ] Let editors publish ready Work photo changes without opening every document individually
- [ ] Preserve the published-only public site contract while making publish completion easier to verify

### Out of Scope

- Non-Work editorial content management such as About/profile imagery — defer until the Work publish workflow is complete
- Public-facing gallery redesign or richer visitor interactions — current milestone is editorial tooling, not visual redesign
- Scheduled releases or complex approval workflows — too much workflow surface for the immediate editor pain point

## Context

- `v1.1 Simple Photo Management` is complete and archived in [.planning/milestones/v1.1-ROADMAP.md](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/.planning/milestones/v1.1-ROADMAP.md).
- The Studio already supports batch upload, an `Unassigned` holding state, a visual organizer with category slots and homepage rail, bulk organization, visibility controls, and visual ordering.
- The remaining friction is publish handoff: uploads are intentionally created as drafts, the organizer helps the editor review placement before publishing, and the public site continues to read published content only.
- Official Sanity guidance still centers draft/published behavior around the platform's document actions and draft model, so any custom publish flow should align with that model instead of bypassing it.

## Constraints

- **Tech stack**: Stay inside the existing Next.js + embedded Sanity Studio setup — avoid introducing a second admin surface
- **Public safety**: Keep the frontend on published content only — draft content must not leak to the public site
- **Editorial UX**: Preserve the photo-first, non-technical Studio language established in `v1.1` — publishing should feel like the next step in the same workflow
- **Information architecture**: Keep the three-category Work model stable unless a later milestone explicitly changes it

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use a category/image-centric model instead of the old project-centric Work model | Matches the approved visitor flow and simplified Work IA | ✓ Good |
| Remove legacy `/work/[slug]` detail pages and Decap CMS | Avoids duplicate systems and keeps the live stack coherent | ✓ Good |
| Keep non-Work content on current storage for now | Limited the migration scope so Work could land cleanly first | ✓ Good |
| Treat homepage curation as CMS-driven and explicitly ordered | Gave editorial control without cluttering the public site | ✓ Good |
| Build the editor milestone around custom Studio workflow improvements, not public redesign | The primary remaining pain was maintenance friction for a non-technical editor | ✓ Good |
| Keep placement review and ordering inside the organizer instead of the raw document form | Editors need one thumbnail-led surface for upload, organization, and publish confidence | ✓ Good |
| Start `v1.2` by closing the publish handoff gap inside Studio before broadening CMS scope elsewhere | The current blocker is not upload or organization anymore; it is getting ready photos live with confidence | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `$gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `$gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-18 after starting milestone v1.2*

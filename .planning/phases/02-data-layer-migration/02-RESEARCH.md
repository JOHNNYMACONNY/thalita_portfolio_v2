# Phase 2: Data Layer Migration - Research

**Researched:** 2026-04-14
**Domain:** Sanity-backed Work data helpers and a fresh-start Work dataset workflow for a Next.js App Router portfolio
**Confidence:** MEDIUM

## User Constraints

- The site should start fresh with no migrated legacy photos.
- Work content should be managed in Sanity going forward rather than imported from markdown.
- Non-Work JSON/settings reads should remain stable in this phase.
- The single-category, image-centric Work model from Phase 1 stays intact.
- The About page profile image should not be modeled as a Work image or Work category.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAN-03 | Next.js app can fetch categories and gallery items from Sanity in production without relying on markdown project files | Use dedicated Sanity query modules built on `next-sanity`, keep `lib/api.ts` only for non-Work JSON content, and query categories/gallery items through typed GROQ helpers. |
| MIG-01 | The Work experience can start from an intentionally empty Sanity gallery dataset, with editors adding new categories and gallery items manually without relying on legacy markdown photo import | Verify empty-state-safe query helpers, add a fresh-start bootstrap/receipt flow, and document the manual editorial workflow instead of importing legacy photos. |
</phase_requirements>

## Summary

Phase 2 should still split Work data access away from `lib/api.ts`, but the migration half of the phase changes materially: instead of importing existing markdown portfolio images, the repo should treat legacy markdown as retired input and support a clean Sanity-backed starting point with empty galleries. That means the critical verification target is no longer “did every old image migrate,” but “does the app, helper layer, and editorial workflow behave correctly when categories exist and gallery items are initially empty.”

The safest implementation path is:
- keep `lib/api.ts` for `content/settings/*.json`
- route active Work reads through `sanity/lib/queries.ts` and `sanity/lib/work.ts`
- ensure the homepage and overlap `/work/[slug]` route fail closed or show empty-safe behavior when Sanity has no gallery items yet
- replace legacy-import tooling with a fresh-start receipt/bootstrap flow that records the intended zero-photo starting state rather than writing imported gallery items into the dataset

**Primary recommendation:** keep the Sanity-first Work helper layer from the original plan, but pivot the “migration” work into a fresh-start bootstrap and audit flow that verifies categories, empty gallery states, helper behavior, and the editor runbook instead of importing old photos.

## Architecture Patterns

### Pattern 1: Split Work data access out of `lib/api.ts`
- Keep settings/about/services filesystem reads in `lib/api.ts`
- Move active Work reads into `sanity/lib/work.ts`
- Treat markdown project files as legacy reference only, not active Work content

### Pattern 2: Empty-state-safe Sanity helpers
- Query categories and gallery items from Sanity
- Return stable empty arrays/nulls when no gallery items exist
- Keep overlap routes alive without crashing even when the fresh-start dataset has sparse or zero Work content

### Pattern 3: Fresh-start bootstrap receipt instead of legacy photo import
- Replace legacy import assumptions with a command/report that confirms the intended starting dataset state
- Record the approved category slots and whether the Work gallery is intentionally empty
- Avoid writing legacy photos into the canonical Sanity dataset

### Pattern 4: Keep non-Work editorial images separate from Work
- The About/profile photo should live on an About or site-settings document in a later CMS phase
- Do not model that profile image as a Work `galleryItem` or as a fake Work category

## Anti-Patterns to Avoid

- Importing legacy markdown photos just to satisfy an old migration assumption
- Treating the About/profile image as part of the Work taxonomy
- Expanding Phase 2 into About/Services CMS migration
- Breaking legacy overlap routes when Sanity returns zero gallery items

## Resolved Planning Decisions

1. **Legacy photo import**
   - Resolution: skipped. Phase 2 now supports a fresh-start Work dataset with no migrated legacy gallery photos.

2. **Traceability**
   - Resolution: keep only minimal provenance fields already introduced for overlap safety; do not restore full legacy project metadata as first-class Work UI content.

3. **Canonical categories**
   - Resolution: categories remain the three fixed Phase 1 slots, but the phase no longer needs legacy-category-to-image import mapping as a gate for dataset writes.

## Environment Availability

| Dependency | Required By | Available | Notes |
|------------|-------------|-----------|-------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | Sanity read helpers | Yes | Already configured from Phase 1 |
| Embedded Studio at `/studio` | Manual verification | Yes | Verified in Phase 1 |
| Sanity CLI auth | Optional bootstrap/report tooling | Optional | No legacy image import is required anymore |

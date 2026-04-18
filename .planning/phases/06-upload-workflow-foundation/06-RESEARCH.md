# Phase 06 Research

## Goal

Plan the first editor-experience phase that makes photo upload and intake feel simple for a non-technical editor, without destabilizing the finished public Work experience.

## Inputs Reviewed

- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/research/v1.1-simple-photo-management.md`
- `sanity.config.ts`
- `sanity/structure.ts`
- `sanity/schemaTypes/documents/galleryItem.ts`
- `sanity/schemaTypes/documents/category.ts`
- `sanity/lib/work.ts`
- `sanity/lib/queries.ts`
- `app/studio/[[...tool]]/page.tsx`
- `app/work/page.tsx`
- `app/work/[slug]/page.tsx`

## Current State

- The public site is stable and category-first:
  - `/work` lists the three categories
  - `/work/[slug]` renders category galleries
  - `/` shows curated home-gallery items
- Sanity Studio is embedded successfully at `/studio`, but the editorial UX is still close to the raw document model:
  - fixed category slots appear in the desk structure
  - `galleryItem` documents appear as a flat document list
  - the `category` field is currently required on every `galleryItem`
  - homepage visibility is controlled with booleans and a numeric `homePageOrder`
- This means the current upload path still expects the editor to think like a CMS operator:
  - create a document
  - upload an image into that document
  - assign category immediately
  - manage placement through per-document editing

## Official Studio Capabilities Relevant To This Phase

Official Sanity references reviewed:

- Form Components:
  - https://www.sanity.io/docs/studio/form-components
  - https://www.sanity.io/docs/form-components-reference
- Structure Builder / filtered document lists:
  - https://www.sanity.io/docs/structure-builder-introduction
  - https://www.sanity.io/docs/structure-filter-required
- Custom tools:
  - https://www.sanity.io/docs/studio-tools
  - https://www.sanity.io/docs/studio/tools-cheat-sheet
- Image type / asset behavior:
  - https://www.sanity.io/docs/studio/image-type
  - https://www.sanity.io/docs/assets

Key takeaways from the docs:

### 1. Studio structure can expose filtered editor workflows

Sanity's Structure Builder can create filtered document lists, which makes an `Unassigned Photos` or `Ready to Sort` pane technically straightforward.

Implication:
- We do not need a separate admin app just to make the first improvement.
- Phase 6 can likely ship meaningful usability wins by reorganizing Studio navigation around editor tasks instead of document types.

### 2. Form components can make fields friendlier without replacing the whole Studio

Sanity supports custom field/input rendering at the schema or config level.

Implication:
- We can keep the underlying content model but present plain-language guidance, badges, or warnings directly in the upload/edit form.
- This is a better fit for Phase 6 than building a large custom tool immediately.

### 3. Image fields remain document-bound by default

Sanity's default upload behavior is still tied to document/image fields, even though assets exist as first-class stored media behind the scenes.

Implication:
- A "batch upload gallery items" workflow still needs an editorial document strategy.
- The simplest Phase 6 path is to let `galleryItem` documents exist without immediate category assignment, so upload-first becomes safe.

### 4. Custom tools remain available if desk customization is not enough

Studio tools can create a top-level custom view when the desk structure becomes too cramped.

Implication:
- Phase 6 should start with structure/schema/form customization first.
- If the upload flow still feels too buried after that, a custom organizer tool becomes a clean Phase 7 extension.

## Product Planning Implications

### 1. `Unassigned` must become a valid content state

This is the most important foundational change.

Right now `category` is required, which prevents a clean upload-first workflow. If the editor must choose a category at upload time, the UX remains cognitively heavy.

Recommended direction:
- make category optional at the schema level for Phase 6
- treat `category === undefined` as an intentional `Unassigned` intake state
- keep frontend reads fail-closed so unassigned items never leak to `/work`, `/work/[slug]`, or the homepage

### 2. Structure should be task-oriented instead of type-oriented

The current structure is:
- Work Categories
- Gallery Items

That is clean for developers but not ideal for Thalita.

Recommended direction:
- keep Work Categories
- replace raw Gallery Items emphasis with editor-language buckets such as:
  - `Upload Queue` or `Unassigned Photos`
  - `All Photos`
  - maybe `Homepage Picks` later

### 3. Upload polish should focus on confidence, not power features

For this phase, "better upload" does not need a complex DAM.

The most valuable improvements are:
- obvious upload entry point
- clear preview/thumbnail feedback
- safe unassigned landing state
- editor-language descriptions telling the user what happens next

### 4. Placement controls should stay secondary in Phase 6

Homepage/category ordering is important, but Phase 6 is the intake foundation.

Recommended split:
- Phase 6: upload-first, unassigned-safe, plain-language guidance
- Phase 7: visual category assignment and bulk organization
- Phase 8: explicit placement and ordering controls

## Risks

- Making `category` optional could accidentally expose unassigned items if helper queries or frontend assumptions are not guarded carefully.
- A purely structural cleanup without better form guidance could still feel too technical for the editor.
- Overbuilding a custom Studio tool too early could create more implementation risk than needed for the first phase.
- Any schema changes must preserve the three-category model and keep public category routes stable.

## Dependencies

- Depends on Phase 5 cleanup so `/studio` is the only CMS path.
- Relies on existing fail-closed public Work queries to keep uncategorized items off the site.
- Sets up the editor-state foundation needed by Phase 7 bulk organization and Phase 8 placement controls.

## Recommended Plan Slices

- `06-01-PLAN.md`
  - Define the new upload-safe content state and plain-language editor model
  - Rework Studio structure/schema/preview surface so upload-first is understandable

- `06-02-PLAN.md`
  - Build the batch upload intake flow around `Unassigned` items
  - Add the main upload-facing editor affordances

- `06-03-PLAN.md`
  - Verify the new upload workflow with lint/build plus a blocking Studio UAT
  - Polish copy, empty states, and recovery cues for non-technical use

## Recommendation

Phase 6 should avoid a separate admin rewrite and instead use the customization points Sanity already provides: schema changes, structure filtering, and editor-facing form polish. The key architectural move is to formalize `Unassigned` as a safe intake state so upload comes before categorization. That unlocks the simpler mental model the milestone needs while keeping the public site stable.

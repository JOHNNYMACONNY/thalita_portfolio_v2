# Phase 1: Sanity Foundation - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Add Sanity Studio, schema, and client/environment wiring for the new Work content model so editors can manage categories and gallery items inside the project. This phase establishes the CMS foundation only; it does not migrate frontend routes or render the new Work experience yet.

</domain>

<decisions>
## Implementation Decisions

### Category model
- **D-01:** Phase 1 will support exactly three canonical Work categories.
- **D-02:** The five categories from the old site will not be carried forward into the new Sanity model.
- **D-03:** The schema should be extendable later, but this phase should not create hidden or extra categories beyond the three canonical ones.

### Gallery item granularity
- **D-04:** Each image will become its own `galleryItem` document.
- **D-05:** The new model will not preserve project-level gallery groupings as first-class Work content.

### Category assignment
- **D-06:** Each `galleryItem` belongs to a single category only.
- **D-07:** Cross-listing across multiple categories is intentionally out of scope for the initial model to keep navigation and editorial decisions simple.

### Home curation controls
- **D-08:** Home page curation will use a simple `showOnHomePage` boolean plus an explicit order field.
- **D-09:** This Phase 1 schema should preserve the current simple editorial workflow rather than introducing a more complex curation system.

### Sanity access model
- **D-10:** The initial Sanity setup may assume two Administrator users on the Free plan for Thalita and her collaborator.
- **D-11:** The phase does not need extra role modeling beyond what the Free plan supports today.

### the agent's Discretion
- The exact Sanity schema field names may follow repo conventions as long as they preserve the locked decisions above.
- The implementation may choose whether to seed the three canonical categories during setup or document them for manual creation, provided the Studio is ready to manage only those three categories.
- Since category names, slugs, and cover images were not locked during discussion, the schema should support editor-authored values for those fields rather than hardcoding editorial content assumptions.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, and plan breakdown for Sanity Foundation.
- `.planning/REQUIREMENTS.md` — `SAN-01` and `SAN-02` define the required category and gallery item capabilities for this phase.
- `.planning/PROJECT.md` — Migration constraints, visual continuity, route simplicity, and CMS scope decisions that shape the Sanity foundation.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/api.ts`: Centralized content access layer that currently reads markdown and JSON; this is the clearest place to mirror with Sanity client wiring in later phases.
- `app/types/index.ts`: Existing `Project`-centric TypeScript shapes can guide naming and identify where the new category/gallery model will eventually replace legacy assumptions.
- `public/admin/config.yml`: Current Decap collections show which editorial fields the old system managed and which fields need Sanity counterparts or intentional replacement.

### Established Patterns
- Route files compose pages from shared helpers and components instead of embedding data access logic directly.
- Content reads are currently synchronous and filesystem-based, so Sanity integration introduces the project's first remote content client and environment-based configuration.
- The existing homepage uses simple featured toggles and ordering, which aligns with the locked `showOnHomePage` plus order decision.

### Integration Points
- `app/layout.tsx` currently includes the Netlify Identity script tied to Decap; Sanity Studio setup should coexist with the current shell without removing legacy CMS pieces yet.
- `next.config.ts` already manages remote image domains and will later need to expand to Sanity CDN assets.
- `content/settings/categories.json` currently holds five categories, which is a migration contrast point against the new three-category Sanity model.

</code_context>

<specifics>
## Specific Ideas

- Keep the information architecture intentionally narrow in Phase 1: exactly three categories, single-category image assignment, and no hidden extra categories.
- Favor an image-centric content model over preserving the old project/story grouping structure.
- Keep homepage curation editorially lightweight by mirroring the current featured-toggle mental model with clearer field naming.

</specifics>

<deferred>
## Deferred Ideas

- Additional categories beyond the three canonical ones — reconsider only if the Work information architecture expands in a later phase.
- Multi-category assignment for a single image — revisit only if navigation or editorial needs become more complex later.
- More complex home curation workflows beyond a boolean plus order field — future enhancement, not needed for initial migration.

</deferred>

---

*Phase: 01-sanity-foundation*
*Context gathered: 2026-04-14*

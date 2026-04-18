# Phase 9: Publish Readiness Visibility - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Make draft-versus-published state and publish readiness obvious inside the existing Studio photo workflow. This phase clarifies status and readiness only; it does not need to ship the final publish action itself.

</domain>

<decisions>
## Implementation Decisions

### Primary publish-readiness surface
- **D-01:** `Organize Photos` is the primary surface for publish readiness because it already acts as the thumbnail-led review space for placement, visibility, and ordering.
- **D-02:** `Upload Photos` should reinforce that new items start as drafts and hand the editor toward the organizer for readiness review instead of duplicating the full readiness UI there.

### Status vocabulary and visibility
- **D-03:** Photo cards should expose draft-versus-published state in plain language alongside the existing placement badges, so an editor can understand "saved in Studio" versus "live on site" at a glance.
- **D-04:** Readiness cues should appear both per photo card and at the current selection level so bulk workflows stay understandable.

### Readiness rules
- **D-05:** A photo is not publish-ready when it is still unassigned or missing required document content needed by the existing schema and public site contract.
- **D-06:** Hidden photos may still be publishable if their document state is otherwise valid, but the UI must explain that publishing a hidden photo does not make it visible on the site.
- **D-07:** Readiness messaging must explain why an item is blocked in editor language, not raw schema terminology.

### the agent's Discretion
- Exact badge tone, icon choice, and layout treatment
- Whether readiness explanation lives in helper text, badges, a side panel, or a compact bulk summary block
- Whether upload-tool follow-up uses inline messaging, a CTA, or a lightweight result summary link back to the organizer

</decisions>

<specifics>
## Specific Ideas

- Keep the mental model introduced in `v1.1`: upload first, organize visually, then review publish readiness in the same photo-first workspace.
- The editor should be able to answer three questions without opening a document:
  - Is this still only a draft?
  - If I publish it later, where will it appear?
  - If I cannot publish it yet, what is missing?

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and requirements
- `.planning/PROJECT.md` — Active milestone goal, constraints, and current decisions for Studio publishing workflow
- `.planning/REQUIREMENTS.md` — `PUB-01` and `SAFE-01` definitions for Phase 9
- `.planning/ROADMAP.md` — Phase 9 goal, success criteria, and plan slices

### Existing Studio workflow
- `sanity/components/PhotoOrganizerTool.tsx` — Current organizer surface, placement summaries, filters, and bulk workflow patterns
- `sanity/components/PhotoUploadTool.tsx` — Current draft-first upload flow and editor-facing copy about unassigned drafts
- `sanity/schemaTypes/documents/galleryItem.ts` — Existing required fields and editorial field language that readiness rules must align with
- `sanity/structure.ts` — Current desk structure and supporting Studio navigation context

### Public-site contract
- `sanity/lib/client.ts` — Frontend uses published perspective only
- `sanity/lib/queries.ts` — Work queries that must continue to exclude draft-only states from the public site
- `sanity/lib/work.ts` — Helper layer that normalizes published Work data for the app

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sanity/components/PhotoOrganizerTool.tsx`: already has card badges, placement summaries, bulk-selection state, and status copy patterns that can absorb publish-readiness UI
- `sanity/components/PhotoUploadTool.tsx`: already teaches the draft-first mental model and can provide a lighter publish-readiness handoff

### Established Patterns
- Studio copy favors plain-language editor guidance rather than raw CMS vocabulary
- The organizer is the established home for visual review and multi-photo actions
- The public site remains fail-closed by reading published content only

### Integration Points
- Organizer fetch layer is the main place to enrich card state with publish-status information
- Existing card badges and bulk action sections are the natural insertion points for readiness status
- Upload results can hand off to organizer review without adding a second fully featured publish workspace

</code_context>

<deferred>
## Deferred Ideas

- Bulk publish execution itself belongs to Phase 10
- Scheduled publishing, approvals, or release-style workflows remain out of scope for this milestone
- Non-Work image management remains a later milestone

</deferred>

---

*Phase: 09-publish-readiness-visibility*
*Context gathered: 2026-04-18*

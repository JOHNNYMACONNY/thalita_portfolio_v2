# Phase 07: Category Assignment And Organization - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning
**Mode:** Autonomous follow-through from completed Phase 06 upload workflow

<domain>
## Phase Boundary

Phase 06 already introduced a basic `Organize Photos` tool for moving unassigned photos into category slots. Phase 07 needs to turn that starter surface into the real day-to-day organizer: all three categories visible at once, bulk reassignment instead of one-way assignment only, and fast ways to find the photos that still need attention.

</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- Keep the work inside the existing Sanity Studio custom-tool surface instead of adding a second admin app.
- Keep the three fixed category slots as the primary organization destinations.
- Treat `Unassigned` as a safe holding tray, not as an error state or fake fallback category.

### Agent Discretion

- The organizer can use cards, trays, rails, badges, and bulk-action controls as long as the experience stays plainly labeled and thumbnail-led.
- Filtering/search interactions can stay lightweight if they materially speed up finding unsorted or misplaced photos.

</decisions>

<code_context>
## Existing Code Insights

- `sanity/components/PhotoOrganizerTool.tsx` already supports bulk assignment from `Unassigned` into one category at a time.
- `sanity/components/PhotoUploadTool.tsx` already feeds new uploads into the workflow, usually through `Unassigned`.
- `sanity/schemaTypes/documents/galleryItem.ts` already allows blank categories, which makes visual organization safe.

</code_context>

<specifics>
## Specific Ideas

- Show the three category slots and the `Unassigned` tray in the same workspace.
- Let editors move photos back out of categories, not just into them.
- Add search/filter helpers so the editor can quickly isolate `Unassigned`, `Hidden`, or home-featured photos.
- Keep the UI centered on thumbnails and plain-language actions rather than raw Sanity form concepts.

</specifics>

# Phase 08: Placement And Publishing Controls - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning
**Mode:** Autonomous continuation after Phase 07 organizer upgrade

<domain>
## Phase Boundary

After organization becomes easy, the remaining editor risk is placement uncertainty. Thalita needs to know whether a photo is hidden, visible in a category, or featured on the home page, and she needs visual ordering controls instead of manual number editing.

</domain>

<decisions>
## Implementation Decisions

### Locked Decisions

- Placement controls should extend the existing organizer rather than create a separate placement screen.
- Ordering fields can remain in the schema, but the primary editor interaction should be visual.

### Agent Discretion

- Placement review can be expressed through badges, summaries, rails, and reorder controls as long as the live-site outcome is easy to infer.

</decisions>

<code_context>
## Existing Code Insights

- Public category pages currently sort by `homePageOrder` fallback rather than a category-specific ordering field.
- The schema already carries `showOnHomePage` and `homePageOrder`, but those controls are still document-centric.
- The organizer is the right place to surface placement state because it already centralizes thumbnails and bulk actions.

</code_context>

<specifics>
## Specific Ideas

- Show placement badges directly on every photo card.
- Add a dedicated home-page rail with visual reorder controls.
- Add category-specific order management so `/work/[slug]` is no longer piggy-backing on home-page order.
- Keep the underlying order fields as implementation details managed from the organizer.

</specifics>

# Phase 1: Sanity Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-14
**Phase:** 1-Sanity Foundation
**Areas discussed:** Category model, Gallery item granularity, Category assignment, Home curation controls, Sanity plan assumptions

---

## Category model

| Option | Description | Selected |
|--------|-------------|----------|
| Exactly three canonical categories | Lock Phase 1 to the three-category IA and do not carry forward extra or hidden categories | ✓ |
| Allow extra category docs but only show three | Keep the model looser now while enforcing only three visible categories in the UI | |
| Preserve legacy category count temporarily | Bring old categories forward first and narrow later during migration | |

**User's choice:** Exactly three canonical categories with no hidden extras and no carryover of the old five-category set.
**Notes:** The schema should remain extendable later, but Phase 1 should focus only on the approved three-category model.

---

## Gallery item granularity

| Option | Description | Selected |
|--------|-------------|----------|
| One image per `galleryItem` | Make the Work model image-centric and allow each image to be curated independently | ✓ |
| Project/story grouping with nested images | Preserve a project wrapper and keep multiple images under one parent entry | |
| Mixed model | Support both image-level and grouped content from the start | |

**User's choice:** Each image becomes its own `galleryItem` document.
**Notes:** This intentionally drops project-level groupings from the new Work model.

---

## Category assignment

| Option | Description | Selected |
|--------|-------------|----------|
| Single category per image | Keep navigation clean and make categorization decisions explicit | ✓ |
| Multiple categories per image | Allow cross-listing for broader discoverability | |
| Primary category plus secondary tags | Keep one main bucket while allowing softer relationships | |

**User's choice:** Each `galleryItem` belongs to a single category.
**Notes:** Cross-listing is intentionally deferred to avoid muddying the three-category navigation model.

---

## Home curation controls

| Option | Description | Selected |
|--------|-------------|----------|
| `showOnHomePage` + order field | Lightweight curation flow that mirrors the current featured-toggle pattern | ✓ |
| Dedicated homepage collection or manual list | More explicit curation object with more setup overhead | |
| Automatic curation rules | Derive homepage items from categories or metadata instead of editor picks | |

**User's choice:** Use a `showOnHomePage` boolean and an order number.
**Notes:** The user wants the simplest possible editorial workflow for homepage curation.

---

## Sanity plan assumptions

| Option | Description | Selected |
|--------|-------------|----------|
| Free plan with two Administrator users | Use the Free tier as-is for Thalita and one collaborator | ✓ |
| Paid plan with editor-specific roles | Upgrade early for more granular role separation | |
| Decide later | Leave plan assumptions out of Phase 1 context entirely | |

**User's choice:** Proceed assuming the Free tier with two Administrator users.
**Notes:** This fits the current team size and avoids adding role complexity to Phase 1.

---

## the agent's Discretion

- Exact schema field naming and document registration structure
- Whether the implementation seeds the three categories automatically or documents manual creation
- How strongly Studio validation enforces the three-category workflow

## Deferred Ideas

- Additional categories beyond the three canonical ones
- Multi-category assignment for a single image
- A more advanced homepage curation workflow than boolean plus ordering

---
phase: 08
slug: placement-and-publishing-controls
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-18
---

# Phase 08 - Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | ESLint and Next.js production build plus organizer/public-route verification |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |

## Verification Focus

- `PLC-01`: Placement state is legible at thumbnail level.
- `PLC-02`: Homepage and category ordering can be changed through a visual interaction.
- `PLC-03`: Editors can review likely live placement before publishing.

## Manual-Only Verifications

- Open `/studio` → `Organize Photos` and confirm placement badges are readable on every card.
- Reorder at least one category photo and at least one homepage photo through the organizer controls.
- Confirm `/work/[slug]` and the homepage reflect the intended order model after publish.

## Approval

Approved for execution.

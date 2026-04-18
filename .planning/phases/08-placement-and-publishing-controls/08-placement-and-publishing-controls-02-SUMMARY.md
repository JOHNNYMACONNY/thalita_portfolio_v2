---
phase: 08-placement-and-publishing-controls
plan: 02
subsystem: ordering-and-data-layer
tags: [sanity, studio, ordering, queries]
provides:
  - Category-specific ordering model
  - Visual ordering controls for homepage and category placements
requirements-completed: [PLC-02]
completed: 2026-04-18
---

# Phase 08 Plan 02: Visual Ordering Summary

- Added organizer controls for moving photos earlier or later inside category slots and the homepage rail.
- Added `categoryOrder` as a schema/data-layer detail so category galleries no longer depend on homepage order.
- Updated the public Work query layer to honor the organizer-managed category sequence.

# Phase 02 Source Audit

## Inputs Used

- Goal and phase framing from `.planning/ROADMAP.md`
- Requirement IDs from `.planning/REQUIREMENTS.md`
- Current state and carry-forward decisions from `.planning/STATE.md`
- Phase 2 implementation research from `.planning/phases/02-data-layer-migration/02-RESEARCH.md`
- Phase 1 outputs from `01-01-SUMMARY.md`, `01-02-SUMMARY.md`, and `01-03-SUMMARY.md`
- Current code/data sources from `lib/api.ts`, `app/types/index.ts`, `content/projects/*.md`, and `sanity/`

## Constraint Register

- `C-01`: Keep non-Work JSON/settings reads stable; do not broaden scope into About/Services migration.
- `C-02`: Keep the target model category/image-centric with one `galleryItem` per image and a single category reference.
- `C-03`: Do not remove legacy routes in Phase 2; migrate data safely first.
- `C-04`: Do not import legacy markdown photos into the fresh-start Sanity dataset.
- `C-05`: Include fresh-start data behavior verification and a durable audit artifact.
- `C-06`: Preserve only minimal provenance fields for traceability; do not restore full legacy project metadata as first-class Work UI data.
- `C-07`: Keep non-Work editorial images, such as the About/profile photo, out of the Work taxonomy.

## Coverage Map

| Source Type | ID | Required Outcome | Covered By |
|-------------|----|------------------|------------|
| GOAL | G-01 | Work content source moves from markdown parsing to Sanity queries | `02-01-PLAN.md` |
| GOAL | G-02 | The app supports a fresh-start Sanity dataset without legacy photo import | `02-02-PLAN.md`, `02-03-PLAN.md` |
| REQ | SAN-03 | App can fetch categories and gallery items from Sanity in production without markdown dependency for Work data | `02-01-PLAN.md`, `02-03-PLAN.md` |
| REQ | MIG-01 | The Work experience can start from an intentionally empty Sanity gallery dataset, with editors adding new categories and gallery items manually without relying on legacy markdown photo import | `02-02-PLAN.md`, `02-03-PLAN.md` |
| RESEARCH | R-01 | Split Work helpers from `lib/api.ts`; keep non-Work JSON reads untouched | `02-01-PLAN.md` |
| RESEARCH | R-02 | Use typed GROQ query helpers built on `next-sanity` | `02-01-PLAN.md` |
| RESEARCH | R-03 | Keep the dataset intentionally fresh-start instead of importing legacy photos | `02-02-PLAN.md` |
| RESEARCH | R-04 | Use a bootstrap/receipt flow to record the intended empty starting state | `02-02-PLAN.md` |
| RESEARCH | R-05 | Verify empty-state-safe helper behavior and editor workflow instead of legacy parity counts | `02-03-PLAN.md` |
| RESEARCH | OQ-01 | Preserve minimal provenance fields for traceability instead of restoring full legacy project metadata as first-class UI data | `02-01-PLAN.md` |
| RESEARCH | OQ-02 | Keep the About/profile image outside the Work taxonomy | future CMS phase / out of scope |
| STATE | S-01 | Preserve the Phase 1 three-slot category governance and fixed category IDs | `02-01-PLAN.md`, `02-02-PLAN.md` |
| STATE | S-02 | Support the current overlap period before route replacement work lands | `02-01-PLAN.md` |
| USER | C-01 | Non-Work JSON/settings remain filesystem-backed | `02-01-PLAN.md` |
| USER | C-02 | Single-category, image-centric model stays intact | `02-01-PLAN.md`, `02-02-PLAN.md` |
| USER | C-03 | Legacy routes remain present in Phase 2 | `02-01-PLAN.md` |
| USER | C-04 | Legacy photos are not imported into the new Work dataset | `02-02-PLAN.md`, `02-03-PLAN.md` |
| USER | C-05 | Fresh-start data behavior is checked and documented | `02-03-PLAN.md` |
| USER | C-06 | Minimal provenance is preserved without restoring full project metadata as UI data | `02-01-PLAN.md`, `02-02-PLAN.md` |
| USER | C-07 | Non-Work editorial images stay out of Work | future CMS phase / out of scope |

## Result

All in-scope roadmap, requirements, research, state, and user-preserved constraints are covered by the Phase 2 plan set. The fresh-start revision removes the legacy-photo import assumption, keeps provenance minimal, verifies empty-state-safe Sanity behavior, and keeps non-Work editorial images out of the Work taxonomy. No deferred or out-of-scope items were added.

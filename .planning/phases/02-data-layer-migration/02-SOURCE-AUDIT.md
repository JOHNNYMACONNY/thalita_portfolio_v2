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
- `C-04`: Handle legacy category mapping ambiguity explicitly instead of guessing.
- `C-05`: Include imported-data completeness verification and a durable audit artifact.

## Coverage Map

| Source Type | ID | Required Outcome | Covered By |
|-------------|----|------------------|------------|
| GOAL | G-01 | Work content source moves from markdown parsing to Sanity queries | `02-01-PLAN.md` |
| GOAL | G-02 | Legacy markdown content is imported into the new model safely | `02-02-PLAN.md`, `02-03-PLAN.md` |
| REQ | SAN-03 | App can fetch categories and gallery items from Sanity in production without markdown dependency for Work data | `02-01-PLAN.md`, `02-03-PLAN.md` |
| REQ | MIG-01 | Legacy markdown content is migrated into Sanity with no loss of required images or category assignments | `02-02-PLAN.md`, `02-03-PLAN.md` |
| RESEARCH | R-01 | Split Work helpers from `lib/api.ts`; keep non-Work JSON reads untouched | `02-01-PLAN.md` |
| RESEARCH | R-02 | Use typed GROQ query helpers built on `next-sanity` | `02-01-PLAN.md` |
| RESEARCH | R-03 | Expand every cover/gallery image into one `galleryItem` import record | `02-02-PLAN.md` |
| RESEARCH | R-04 | Use deterministic IDs and Sanity NDJSON import flow for reruns | `02-02-PLAN.md` |
| RESEARCH | R-05 | Fail the migration on unmapped or ambiguous categories | `02-02-PLAN.md`, `02-03-PLAN.md` |
| RESEARCH | R-06 | Verify completeness with count and assignment auditing after import | `02-03-PLAN.md` |
| STATE | S-01 | Preserve the Phase 1 three-slot category governance and fixed category IDs | `02-01-PLAN.md`, `02-02-PLAN.md` |
| STATE | S-02 | Support the current overlap period before route replacement work lands | `02-01-PLAN.md` |
| USER | C-01 | Non-Work JSON/settings remain filesystem-backed | `02-01-PLAN.md` |
| USER | C-02 | Single-category, image-centric model stays intact | `02-01-PLAN.md`, `02-02-PLAN.md` |
| USER | C-03 | Legacy routes remain present in Phase 2 | `02-01-PLAN.md` |
| USER | C-04 | Category ambiguity is explicit, not implicit | `02-02-PLAN.md` |
| USER | C-05 | Imported-data completeness is checked and documented | `02-03-PLAN.md` |

## Result

All in-scope roadmap, requirements, research, state, and user-preserved constraints are covered by the Phase 2 plan set. No deferred or out-of-scope items were added.

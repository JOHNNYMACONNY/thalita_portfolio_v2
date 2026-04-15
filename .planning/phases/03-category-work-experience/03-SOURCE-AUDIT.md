# Phase 03 Source Audit

## Inputs Used

- Goal and phase framing from `.planning/ROADMAP.md`
- Requirement IDs from `.planning/REQUIREMENTS.md`
- Carry-forward decisions from `.planning/STATE.md`
- Phase 2 research and audit artifacts from `.planning/phases/02-data-layer-migration/`
- Current route and component code in `app/`, `components/`, `sanity/lib/`, and `next.config.ts`

## Constraint Register

- `C-01`: Keep Phase 3 scoped to the Work landing page and category gallery routes.
- `C-02`: Do not repoint header, hero, or overlay navigation away from `/#portfolio` in this phase; that belongs to Phase 4.
- `C-03`: Do not broaden Work back into project-detail content modeling.
- `C-04`: Preserve the category-first, one-image/one-category Sanity model from Phases 1 and 2.
- `C-05`: Empty-state behavior is required because the fresh-start dataset currently has zero gallery items.
- `C-06`: The three seeded categories are now the editorial source of truth for `/work`.
- `C-07`: About/profile imagery remains outside the Work taxonomy.
- `C-08`: If Sanity CDN images are blocked by current config, Phase 3 may make the minimum enabling change needed for route rendering without expanding into full legacy cleanup.

## Coverage Map

| Source Type | ID | Required Outcome | Covered By |
|-------------|----|------------------|------------|
| GOAL | G-01 | `/work` becomes a category landing page backed by Sanity | `03-01-PLAN.md` |
| GOAL | G-02 | `/work/[slug]` becomes a category gallery route backed by Sanity | `03-02-PLAN.md` |
| GOAL | G-03 | New Work routes preserve the editorial visual language and handle fresh-start states cleanly | `03-03-PLAN.md` |
| REQ | WORK-01 | Visitor can open `/work` and see three category cards with cover images and links | `03-01-PLAN.md` |
| REQ | CAT-01 | Visitor can open a category page and view visible images assigned to that category | `03-02-PLAN.md`, `03-03-PLAN.md` |
| REQ | CAT-02 | Category page clearly communicates which body of work is being browsed | `03-02-PLAN.md` |
| REQ | CAT-03 | Category galleries preserve editorial quality across desktop and mobile | `03-03-PLAN.md` |
| STATE | S-01 | Work dataset starts fresh; empty states are expected behavior | `03-01-PLAN.md`, `03-02-PLAN.md`, `03-03-PLAN.md` |
| STATE | S-02 | Categories `editorial`, `commercial`, and `personal-styling` are seeded and published | `03-01-PLAN.md`, `03-02-PLAN.md` |
| STATE | S-03 | About/profile image remains out of scope for Work | out of scope / later CMS phase |
| CODE | K-01 | `app/page.tsx` still owns the homepage legacy Work section | preserved until Phase 4 |
| CODE | K-02 | `app/work/[slug]/page.tsx` is the only existing Work route file path | `03-02-PLAN.md` |
| CODE | K-03 | `next.config.ts` may block Sanity-hosted images | `03-01-PLAN.md` or `03-03-PLAN.md` if needed |

## Result

All in-scope roadmap and requirement obligations for Phase 3 map cleanly to a three-plan structure:

- build the `/work` landing page
- repurpose `/work/[slug]` into category galleries
- harden presentation, empty states, and verification

The main cross-phase guardrails are clear: Phase 3 should not repoint global navigation, should not restore legacy project-detail behavior, and should not force non-Work content such as the About/profile image into Work.

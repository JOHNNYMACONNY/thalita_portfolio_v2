---
phase: 03
slug: category-work-experience
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 03 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js lint/build checks plus route-level manual Studio verification |
| **Config file** | `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~45-180 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite plus route UAT must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Evidence Artifact | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|------------------|--------|
| 03-01-01 | 01 | 1 | WORK-01 | T-03-01 | `/work` renders from `getWorkCategories()` without reviving markdown or project-detail assumptions | lint | `npm run lint -- app/work/page.tsx components/WorkCategoryCard.tsx app/types/index.ts` | route and card files in repo | ⬜ pending |
| 03-01-02 | 01 | 1 | WORK-01 | T-03-02 | Category cover images render safely from the configured remote image source | build | `npm run build` | build output | ⬜ pending |
| 03-02-01 | 02 | 2 | CAT-01, CAT-02 | T-03-03 | `/work/[slug]` resolves only to known categories and shows category-owned visible gallery items | lint + build | `npm run lint -- 'app/work/[slug]/page.tsx' sanity/lib/work.ts && npm run build` | route build output | ⬜ pending |
| 03-02-02 | 02 | 2 | CAT-01, CAT-02 | T-03-04 | Unknown category slugs fail closed with `notFound()` rather than leaking legacy route behavior | build | `npm run build` | build output | ⬜ pending |
| 03-03-01 | 03 | 3 | CAT-03 | T-03-05 | Empty categories render a polished editorial state instead of a broken or blank gallery | lint + build | `npm run lint && npm run build` | build output plus visual review | ⬜ pending |
| 03-03-02 | 03 | 3 | CAT-01, CAT-03 | T-03-06 | Manual Studio entry of at least one visible gallery item proves category gallery rendering end to end | blocking checkpoint + build | `npm run build` | `.planning/phases/03-category-work-experience/03-UAT.md` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Execution Checkpoints

- [x] Every implementation task has an automated verification command
- [x] The final human-checkpoint task is blocking and produces `.planning/phases/03-category-work-experience/03-UAT.md`
- [x] Empty-state behavior is explicitly verified because the dataset starts with zero gallery items
- [x] Category-gallery verification includes a manual editor flow with at least one visible item

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Confirm `/work` shows the three published categories with the expected titles and cover images | WORK-01 | Requires browser verification against the live Sanity dataset | Open `/work` and confirm `Editorial`, `Commercial`, and `Personal Styling` appear as cards with correct imagery |
| Confirm empty categories are still polished | CAT-03 | Visual/editorial quality cannot be fully asserted by automation | Visit each category page before adding photos and confirm the empty state still feels intentional |
| Confirm gallery rendering with real CMS content | CAT-01, CAT-02, CAT-03 | Requires live editor action in Studio | Add at least one visible `galleryItem` to one category in `/studio`, publish it, verify it appears on the matching `/work/[slug]`, and record the tested category slug in `03-UAT.md` |

---

## Validation Sign-Off

- [x] All implementation tasks have `<automated>` verify
- [x] Sampling continuity: no 3 consecutive implementation tasks without automated verify
- [x] The blocking human checkpoint covers the manual-only editor workflow risk
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

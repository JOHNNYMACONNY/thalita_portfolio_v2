---
phase: 04
slug: home-curation-and-navigation
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-16
---

# Phase 04 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js lint/build checks plus manual browser and Studio verification |
| **Config file** | `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~45-180 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite plus homepage/nav UAT must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Evidence Artifact | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|------------------|--------|
| 04-01-01 | 01 | 1 | HOME-01 | T-04-01 | Homepage Work section reads only curated Sanity gallery items instead of legacy project bridge data | lint | `npm run lint -- app/page.tsx components/HomeGalleryGrid.tsx sanity/lib/work.ts` | homepage route and gallery component in repo | ⬜ pending |
| 04-01-02 | 01 | 1 | HOME-01, HOME-02 | T-04-02 | Curated home item order is preserved from `getHomeGalleryItems()` and empty curated state fails closed | build | `npm run build` | build output | ⬜ pending |
| 04-02-01 | 02 | 2 | WORK-02 | T-04-03 | Header, hero CTA, and mobile overlay all point visitors to `/work` instead of legacy anchors | lint | `npm run lint -- components/Header.tsx components/Hero.tsx components/NavigationOverlay.tsx lib/api.ts` | nav component diffs in repo | ⬜ pending |
| 04-02-02 | 02 | 2 | WORK-02 | T-04-04 | No reachable shared navigation source still carries `/#portfolio` or `#portfolio` for Work discovery | lint + grep | `npm run lint && rg -n '/#portfolio|#portfolio' app components lib` | command output plus repo search | ⬜ pending |
| 04-03-01 | 03 | 3 | HOME-01, WORK-02 | T-04-05 | Homepage curated section and `/work` discovery path remain composed on desktop and mobile | lint + build | `npm run lint && npm run build` | build output plus responsive visual review | ⬜ pending |
| 04-03-02 | 03 | 3 | HOME-02 | T-04-06 | Manual Studio reorder of curated home items changes homepage order without code changes or workaround refreshes | blocking checkpoint + build | `npm run build` | `.planning/phases/04-home-curation-and-navigation/04-UAT.md` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Execution Checkpoints

- [x] Every implementation task has an automated verification command
- [x] The final human-checkpoint task is blocking and produces `.planning/phases/04-home-curation-and-navigation/04-UAT.md`
- [x] The navigation sweep explicitly checks for leftover `#portfolio` anchors
- [x] Home-page ordering is verified against a real Studio reorder flow

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Confirm the homepage shows only curated home items | HOME-01 | Requires visual confirmation against the live Sanity dataset and current editorial content | Open `/` and confirm every visible Work image is from the curated home selection, not the full category inventory |
| Confirm all primary Work discovery links route to `/work` | WORK-02 | Route correctness across responsive navigation needs browser confirmation | From desktop header, mobile menu, and hero CTA, click the Work entry path and confirm each lands on `/work` |
| Confirm home-page order follows Sanity editor controls | HOME-02 | Requires live content edit in Studio | In `/studio`, change `homePageOrder` across at least two curated items, publish, refresh `/`, and confirm the new order appears exactly as set |

---

## Validation Sign-Off

- [x] All implementation tasks have `<automated>` verify
- [x] Sampling continuity: no 3 consecutive implementation tasks without automated verify
- [x] The blocking human checkpoint covers the real editorial reorder loop
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

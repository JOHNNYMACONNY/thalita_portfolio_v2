---
phase: 05
slug: legacy-cms-removal
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-16
---

# Phase 05 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js lint/build checks plus route-level manual regression verification |
| **Config file** | `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~45-180 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite plus route/CMS regression UAT must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Evidence Artifact | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|------------------|--------|
| 05-01-01 | 01 | 1 | MIG-02 | T-05-01 | Legacy Work route code is removed without breaking `/work` or `/work/[slug]` category browsing | lint | `npm run lint -- app/work app app/types/index.ts sanity/lib/work.ts sanity/lib/queries.ts` | route/helper diffs in repo | ⬜ pending |
| 05-01-02 | 01 | 1 | MIG-02 | T-05-02 | No active runtime code depends on legacy project bridge helpers or obsolete presentation components | build | `npm run build` | build output | ⬜ pending |
| 05-02-01 | 02 | 2 | MIG-02 | T-05-03 | Decap admin assets, scripts, rewrites, and Netlify Identity glue are removed together without leaving dead references | lint + grep | `npm run lint && rg -n 'admin|decap|netlify-identity|identity-widget' app public next.config.ts netlify.toml package.json README.md` | repo search output | ⬜ pending |
| 05-02-02 | 02 | 2 | MIG-02 | T-05-04 | Repo documentation reflects Sanity Studio as the active Work CMS path | lint | `npm run lint -- README.md app/layout.tsx next.config.ts` | docs/config diffs in repo | ⬜ pending |
| 05-03-01 | 03 | 3 | MIG-03 | T-05-05 | Image and deployment config support only the active Sanity-backed Work experience cleanly | lint + build | `npm run lint && npm run build` | config diffs and build output | ⬜ pending |
| 05-03-02 | 03 | 3 | MIG-02, MIG-03 | T-05-06 | Manual regression confirms `/`, `/work`, `/work/[slug]`, and `/studio` still behave after cleanup | blocking checkpoint + build | `npm run build` | `.planning/phases/05-legacy-cms-removal/05-UAT.md` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Execution Checkpoints

- [x] Every implementation task has an automated verification command
- [x] The final human-checkpoint task is blocking and produces `.planning/phases/05-legacy-cms-removal/05-UAT.md`
- [x] Cleanup verification includes both route regression and CMS access regression
- [x] The image/deployment cleanup is explicitly validated with a production build

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Confirm homepage and Work browsing still function after cleanup | MIG-02, MIG-03 | Requires browser verification across the cleaned route surface | Open `/`, `/work`, and at least one `/work/[slug]` category page and confirm the current Sanity-backed experience still renders normally |
| Confirm `/studio` remains the only active CMS entry path | MIG-02 | Requires real browser access rather than static file inspection alone | Open `/studio` and confirm the embedded Sanity Studio still loads after Decap/admin cleanup |
| Confirm the old `/admin` path is gone or no longer resolves as an active CMS surface | MIG-02 | Requires live routing verification | Visit `/admin` after cleanup and confirm the legacy Decap surface no longer serves the old CMS UI |

---

## Validation Sign-Off

- [x] All implementation tasks have `<automated>` verify
- [x] Sampling continuity: no 3 consecutive implementation tasks without automated verify
- [x] The blocking human checkpoint covers the manual-only route/CMS regression risk
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

---
phase: 06
slug: upload-workflow-foundation
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-16
---

# Phase 06 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js lint/build checks plus Studio-focused manual verification |
| **Config file** | `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~45-180 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite plus Studio upload UAT must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Evidence Artifact | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|------------------|--------|
| 06-01-01 | 01 | 1 | UPL-03, EDT-01 | T-06-01 | `galleryItem` documents can exist in a safe unassigned state without exposing uncategorized content on the public site | lint | `npm run lint -- sanity.config.ts sanity/structure.ts sanity/schemaTypes/documents/galleryItem.ts sanity/lib/work.ts sanity/lib/queries.ts` | schema/structure/helper diffs in repo | ⬜ pending |
| 06-01-02 | 01 | 1 | EDT-01 | T-06-02 | Studio navigation and field copy speak in editor-language rather than raw document taxonomy | build | `npm run build` | build output plus Studio config diff | ⬜ pending |
| 06-02-01 | 02 | 2 | UPL-01, UPL-02 | T-06-03 | Editor can batch upload photos into the new intake surface and see immediate thumbnail/progress feedback | lint + build | `npm run lint && npm run build` | upload-surface code and build output | ⬜ pending |
| 06-02-02 | 02 | 2 | UPL-03 | T-06-04 | Newly uploaded images land in a clear `Unassigned` workflow instead of forcing immediate category placement | lint | `npm run lint -- sanity.config.ts sanity/structure.ts sanity/schemaTypes/documents/galleryItem.ts` | Studio workflow diffs in repo | ⬜ pending |
| 06-03-01 | 03 | 3 | UPL-02, EDT-01 | T-06-05 | Upload empty states, help text, and recovery cues are clear enough for a non-technical editor | lint + build | `npm run lint && npm run build` | polished UI copy/config plus build output | ⬜ pending |
| 06-03-02 | 03 | 3 | UPL-01, UPL-02, UPL-03, EDT-01 | T-06-06 | Manual Studio verification confirms the new upload flow is understandable and does not leak uncategorized images into the public routes | blocking checkpoint + build | `npm run build` | `.planning/phases/06-upload-workflow-foundation/06-UAT.md` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Execution Checkpoints

- [x] Every implementation task has an automated verification command
- [x] The final human-checkpoint task is blocking and produces `.planning/phases/06-upload-workflow-foundation/06-UAT.md`
- [x] Validation explicitly checks that uncategorized items remain fail-closed on the public site
- [x] Upload-flow verification includes both automation and real Studio editor interaction

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Confirm the editor can batch upload multiple photos in one session | UPL-01, UPL-02 | Requires live Studio interaction with real image upload behavior | Open `/studio`, use the new upload flow, upload multiple images, and confirm progress plus thumbnail feedback make the result obvious |
| Confirm newly uploaded items land in a clear `Unassigned` state | UPL-03 | Requires visual/editorial confirmation rather than static code inspection | After upload, verify the new images are visible in the unassigned intake surface without needing immediate category assignment |
| Confirm uncategorized images do not leak to the public site | UPL-03 | Requires live route verification after creating real intake-state content | With at least one unassigned uploaded image present, verify `/`, `/work`, and one `/work/[slug]` page still show only assigned, visible items |
| Confirm the editor language feels understandable for a non-technical user | EDT-01 | Requires human judgment on labels, instructions, and workflow cues | Review the upload and intake screens in Studio and confirm the labels/actions make sense without CMS expertise |

---

## Validation Sign-Off

- [x] All implementation tasks have `<automated>` verify
- [x] Sampling continuity: no 3 consecutive implementation tasks without automated verify
- [x] The blocking human checkpoint covers the editor-experience and uncategorized-leakage risks
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

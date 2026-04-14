---
phase: 02
slug: data-layer-migration
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-14
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js lint/build checks plus TypeScript Sanity helper/bootstrap scripts run via `tsx` |
| **Config file** | `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~45-180 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | SAN-03 | T-02-02 | Minimal provenance fields are added without reintroducing full legacy project metadata or breaking the single-category model | lint | `npx eslint app/types/index.ts sanity/schemaTypes/documents/galleryItem.ts` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | SAN-03 | T-02-01 / T-02-03 | Server-side Sanity helpers replace active markdown Work reads while non-Work JSON readers remain stable | build | `npm run lint && npm run build` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | MIG-01 | T-02-04 | Fresh-start bootstrap tooling records the intended zero-photo starting state and refuses legacy import assumptions | script | `npm run work:fresh-start -- --dry-run --strict --receipt .planning/phases/02-data-layer-migration/02-FRESH-START-RECEIPT.md` | ❌ W0 |
| 02-02-02 | 02 | 2 | MIG-01 | T-02-04 | Human verification confirms the dataset should remain empty and categories are the intended three slots | manual checkpoint | `N/A — blocking checkpoint uses /studio plus the generated fresh-start receipt` | ❌ W0 |
| 02-03-01 | 03 | 3 | SAN-03, MIG-01 | T-02-07 / T-02-09 | Audit verifies helper behavior and empty-state-safe Sanity reads for a fresh-start dataset | script | `npx tsx sanity/migrations/work-audit.ts --report .planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md --strict` | ❌ W0 |
| 02-03-02 | 03 | 3 | SAN-03, MIG-01 | T-02-07 / T-02-08 | Runbook and checked-in artifacts document the fresh-start editorial workflow and manual cleanup expectations | grep | `rg -n "Phase 2 fresh start|work:fresh-start|work-audit|manual cleanup|02-FRESH-START-AUDIT|02-FRESH-START-RECEIPT" README.md .planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md .planning/phases/02-data-layer-migration/02-FRESH-START-RECEIPT.md` | ❌ W0 |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Every task has automated verification or an explicit Wave 0 manual checkpoint
- [x] The fresh-start bootstrap receipt is part of the phase artifact set
- [x] The final audit/report step covers helper behavior plus empty-state-safe dataset checks

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Confirm the Work dataset should start with no gallery photos | MIG-01 | Requires editorial intent confirmation, not code-only validation | Open `/studio`, inspect the three category slots, and confirm the intended starting state is zero gallery items rather than imported legacy photos |
| Confirm empty-state-safe behavior in Studio and app data flow | SAN-03, MIG-01 | Requires browser interaction and editor workflow inspection | After the fresh-start receipt is generated, verify the app still builds, Studio categories exist, and gallery-item creation remains manual/editorial |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 180s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved

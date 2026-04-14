---
phase: 01
slug: sanity-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-14
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js lint/build checks (no dedicated unit test runner detected yet) |
| **Config file** | `eslint.config.mjs` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~45-120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | SAN-01, SAN-02 | T-01-01 / env exposure | Sanity packages and base config add no secret values to tracked files and preserve a buildable app shell | lint | `npm run lint` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | SAN-01, SAN-02 | T-01-02 / schema drift | Category and gallery schemas enforce required editorial fields and single-category references | lint | `npm run lint` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 2 | SAN-01, SAN-02 | T-01-03 / misconfigured access | Environment docs and Studio verification steps prove local/editor access without exposing secrets | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/` strategy not present — rely on `npm run lint` and `npm run build` as baseline validation for this phase
- [ ] Studio access verification checklist in phase docs — covers `/studio` route load, env var presence, and CORS/auth setup steps
- [ ] Plan tasks must include grep/file-read acceptance criteria for schema fields, config files, and env documentation because no dedicated automated tests exist yet

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Embedded Studio route loads at `/studio` | SAN-01, SAN-02 | Requires browser interaction and Sanity auth/project setup | Run `npm run dev`, open `/studio`, confirm Studio shell renders and document creation UI is available |
| Sanity project CORS and auth allow embedded Studio usage | SAN-01, SAN-02 | Depends on external Sanity project settings outside repo-only automation | Confirm local and production origins are added in Sanity manage UI with authenticated requests enabled |
| Editors can create the three canonical categories and gallery items | SAN-01, SAN-02 | Requires live Studio interaction rather than static repo checks | In Studio, create or inspect category and gallery item docs and confirm required fields save successfully |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

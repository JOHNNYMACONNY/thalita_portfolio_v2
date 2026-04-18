# Requirements: Studio Publishing Workflow

**Defined:** 2026-04-18
**Core Value:** Editors can confidently manage portfolio imagery from Studio without technical friction while visitors keep the polished category-first browsing experience.

## v1.2 Requirements

### Publishing Experience

- [ ] **PUB-01**: Editor can tell from the Studio photo workflow whether a Work photo only exists as a draft or is already published
- [ ] **PUB-02**: Editor can publish one or more ready Work photos from the Studio workflow without opening each photo document individually
- [ ] **PUB-03**: Editor receives clear success, failure, or partial-completion feedback after running a publish action

### Publishing Safety

- [ ] **SAFE-01**: Editor gets clear guidance when a selected photo is not ready to publish because it is missing required placement or content state
- [ ] **SAFE-02**: Public Next.js routes continue to read published content only while draft items remain safely hidden

### Verification

- [ ] **VER-01**: The team can verify that a Studio publish action results in the expected live Work and homepage behavior

## v2 Requirements

### Editorial Workflow Expansion

- **EXP-01**: Editor can manage non-Work imagery such as About/profile photos from Sanity
- **EXP-02**: Editor can use scheduled publishing or approval workflows for Work photos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Public gallery redesign | This milestone is editorial workflow only |
| Non-Work CMS expansion | Keep the milestone tight around the current Work publishing gap |
| Scheduled releases or approvals | Adds workflow complexity beyond the immediate need |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PUB-01 | Phase 9 | Complete |
| SAFE-01 | Phase 9 | Complete |
| PUB-02 | Phase 10 | Complete |
| PUB-03 | Phase 10 | Complete |
| SAFE-02 | Phase 10 | Complete |
| VER-01 | Phase 11 | In Progress |

**Coverage:**
- v1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 after starting milestone v1.2*

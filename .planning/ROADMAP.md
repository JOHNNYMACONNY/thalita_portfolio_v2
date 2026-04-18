# Roadmap: Thalita Portfolio Content Migration

## Overview

Milestone `v1.2 Studio Publishing Workflow` turns the existing upload-and-organize Studio tools into a complete editorial handoff. The public Work experience is already stable; this milestone focuses on making draft status legible, enabling publish actions from the photo workflow, and proving that published changes reach the live site cleanly.

## Milestone Context

- Previous milestone archive: [.planning/milestones/v1.1-ROADMAP.md](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/.planning/milestones/v1.1-ROADMAP.md)
- Requirements archive: [.planning/milestones/v1.1-REQUIREMENTS.md](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/.planning/milestones/v1.1-REQUIREMENTS.md)
- Milestone history: [.planning/MILESTONES.md](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/.planning/MILESTONES.md)

## Phases

**Phase Numbering:**
- Integer phases continue from the previous milestone to preserve project history
- Decimal phases remain reserved for urgent insertions between planned phases

- [x] **Phase 9: Publish Readiness Visibility** - Make draft-versus-published state and publish readiness obvious inside the Studio photo workflow
- [x] **Phase 10: Studio Publish Actions** - Let the editor publish ready Work photos from the existing Studio workflow with clear feedback and safeguards
- [ ] **Phase 11: Publish Verification And Closure** - Verify live-site publishing behavior, capture UAT, and close the milestone state cleanly

## Phase Details

### Phase 9: Publish Readiness Visibility
**Goal**: The editor can understand which photos are drafts, which are already published, and which ones are ready to go live without opening individual documents.
**Depends on**: Phase 8
**Requirements**: PUB-01, SAFE-01
**Success Criteria** (what must be TRUE):
1. Editor can see draft-versus-published state from the Studio photo workflow itself
2. Editor can tell why a selected photo is or is not ready to publish
3. Publish-readiness messaging stays aligned with the existing plain-language Studio UX
**Plans**: 3 plans

Plans:
- [x] 09-01: Define the shared publish-state model and surface it in the organizer data flow
- [x] 09-02: Add draft or published badges plus readiness guidance to the Studio photo workflow
- [x] 09-03: Polish copy, edge cases, and recovery cues for publish readiness

### Phase 10: Studio Publish Actions
**Goal**: The editor can publish ready photos directly from the Studio workflow instead of hunting through individual document screens.
**Depends on**: Phase 9
**Requirements**: PUB-02, PUB-03, SAFE-02
**Success Criteria** (what must be TRUE):
1. Editor can publish one or more ready Work photos from the photo workflow
2. Publish feedback clearly reports success, failure, and partial outcomes
3. Public site behavior remains published-only and does not surface draft content accidentally
**Plans**: 3 plans

Plans:
- [x] 10-01: Implement the publish action pathway for selected Work photos
- [x] 10-02: Connect publish controls and completion feedback to the organizer and upload follow-up flow
- [x] 10-03: Harden permission checks, invalid-state handling, and public-safety guardrails

### Phase 11: Publish Verification And Closure
**Goal**: The milestone closes only after Studio publishing is verified against the live Work experience and the editorial runbook is current.
**Depends on**: Phase 10
**Requirements**: VER-01
**Success Criteria** (what must be TRUE):
1. Manual and automated verification prove that published photos appear where expected on the site
2. A checked-in UAT artifact records the intended Studio publishing workflow
3. Planning artifacts accurately show the milestone's completion state
**Plans**: 3 plans

Plans:
- [x] 11-01: Add automated and manual verification coverage for Studio-driven publishing
- [x] 11-02: Record UAT and update editorial guidance for the new publish workflow
- [ ] 11-03: Close milestone planning state after publish workflow verification passes

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 9. Publish Readiness Visibility | 3/3 | Complete | 2026-04-18 |
| 10. Studio Publish Actions | 3/3 | Complete | 2026-04-18 |
| 11. Publish Verification And Closure | 2/3 | In Progress | — |

## Backlog

No backlog items recorded.

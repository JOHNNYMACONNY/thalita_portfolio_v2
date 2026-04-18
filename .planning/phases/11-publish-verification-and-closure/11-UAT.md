# Phase 11 UAT: Studio Publishing Workflow

**Date:** 2026-04-18
**Status:** Partial
**Scope:** Publish-readiness visibility, bulk publish action, and live-site handoff verification

## Automated Verification

- `npm run lint -- sanity/components/PhotoOrganizerTool.tsx sanity/components/PhotoUploadTool.tsx sanity.config.ts`
  - Result: Passed
- `npm run build`
  - Result: Passed
  - Notes:
    - Existing warning: `@sanity/image-url` default export deprecation
    - Existing Node warning about `--localstorage-file` without a valid path during build workers

## Implemented Workflow

- Organizer now merges draft and published `galleryItem` documents by base document ID
- Photo cards now show:
  - draft-only vs draft-changes vs published state
  - ready-to-publish vs blocked vs live state
  - plain-language readiness explanation
- Organizer bulk actions now edit drafts via Sanity document actions instead of patching published documents directly
- Organizer can publish selected ready photos through Sanity document publish actions
- Upload flow now points editors back to `Organize Photos` for readiness review and publishing

## Manual Studio Verification

Manual verification is still required in an authenticated Studio session against the real Sanity dataset.

### Recommended Test Script

1. Open `/studio` and go to `Upload Photos`
2. Upload one new photo to `Unassigned`
3. Confirm the result stays draft-only and does not appear on `/work` or `/`
4. Open `Organize Photos`
5. Confirm the uploaded photo shows:
   - `Draft only`
   - `Publish blocked`
   - a message telling the editor to choose a category slot
6. Assign the photo to a category
7. Confirm the card now shows `Ready to publish`
8. Publish the selected ready photo from the organizer
9. Refresh `/work/[category]` and confirm the photo appears in the expected category
10. Optional: add the same photo to the home page rail, publish again, and confirm it appears on `/`
11. Optional hidden-state check:
    - hide a draft photo
    - publish it
    - confirm the organizer reports that it was published as hidden
    - confirm it still stays off the public site

## Open Verification Gap

- This workspace run did not include an authenticated browser session in Sanity Studio, so the live publish mutation path is implemented and build-verified but not yet human-validated end to end.

## Exit Criteria

Phase 11 can be marked complete after the manual Studio verification above is run and any mismatches are either fixed or documented.

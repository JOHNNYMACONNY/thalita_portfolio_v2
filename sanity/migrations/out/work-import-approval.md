# Work Import Approval

Generated: 2026-04-14T22:44:29.015Z

## Pending Approval Reasons
- Confirm work-category-1 in Studio still represents "Editorial" with slug "editorial". Phase 1 left slot 1 title/slug editor-authored, so the live Studio document still needs confirmation.
- Confirm work-category-2 in Studio still represents "Commercial" with slug "commercial". Phase 1 left slot 2 title/slug editor-authored, so the live Studio document still needs confirmation.
- Confirm work-category-3 in Studio still represents "Personal Styling" with slug "personal-styling". The legacy taxonomy includes `Lookbook`, but the fixed three-slot model does not; the collapse into slot 3 needs editorial confirmation.
- Confirm the explicit slug override for "editorial-noir" to "work-category-1" before import.
- Confirm editorial-noir maps to work-category-1. Legacy categories `Editorial` + `Lookbook` span two canonical slots. This slug is tentatively assigned to slot 1 because the project is editorial-first, but that assignment must be approved before import.

## Checklist
1. Open `/studio` and inspect category documents `work-category-1`, `work-category-2`, and `work-category-3`.
2. Confirm the live title and slug for each slot still match the proposed mapping in `sanity/migrations/work-category-map.ts`.
3. Confirm that legacy `Lookbook` content belongs in slot 3 rather than another canonical slot.
4. Confirm the explicit `editorial-noir` override to `work-category-1`, or provide the replacement slot/document ID.
5. Review sanity/migrations/out/work-import-manifest.json and confirm each of the 6 image rows is present with the expected category and homepage flag.

## Tentative Slot Mapping
- work-category-1: proposed title "Editorial", proposed slug "editorial", legacy labels Editorial
- work-category-2: proposed title "Commercial", proposed slug "commercial", legacy labels Commercial
- work-category-3: proposed title "Personal Styling", proposed slug "personal-styling", legacy labels Lookbook, Personal Styling

## Ambiguous Records
- editorial-noir (cover) -> work-category-1: Legacy categories `Editorial` + `Lookbook` span two canonical slots. This slug is tentatively assigned to slot 1 because the project is editorial-first, but that assignment must be approved before import.
- editorial-noir (gallery) -> work-category-1: Legacy categories `Editorial` + `Lookbook` span two canonical slots. This slug is tentatively assigned to slot 1 because the project is editorial-first, but that assignment must be approved before import.

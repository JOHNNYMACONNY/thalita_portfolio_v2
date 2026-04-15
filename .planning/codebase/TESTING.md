# Testing

## Current State
- No automated test suite was found in the repository scan.
- No `__tests__` directories, `*.test.*` files, `*.spec.*` files, Playwright config, Vitest config, or Jest config were found in the inspected tree.
- [package.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/package.json) contains no `test` script.

## Existing Quality Gates
- Linting is the only explicit quality gate found:
  - `npm run lint`
  - config in [eslint.config.mjs](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/eslint.config.mjs)
- Type safety is partially relied on through TypeScript strict mode in [tsconfig.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/tsconfig.json).
- Static generation itself likely catches some content-shape issues during build, but this is indirect and incomplete.

## Manual Verification Likely Required
- Homepage render and project grid population from [app/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/page.tsx)
- Dynamic project detail pages in [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx)
- CMS/admin access under [public/admin](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin)
- Netlify form submission flow via [components/ContactForm.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ContactForm.tsx)
- Remote image rendering for the legacy/demo route [app/portfolio/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/portfolio/page.tsx)

## Risk Areas From Lack of Tests
- Content schema regressions in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts)
- Broken CMS-to-site compatibility if `config.yml` fields and parser expectations drift
- Broken detail pages if required frontmatter fields are missing or malformed
- Styling/layout regressions across mobile and desktop with no snapshot or E2E coverage

## Suggested Testing Priorities
1. Add lightweight unit coverage around [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts) for content parsing and sorting.
2. Add route-level smoke tests for homepage and `app/work/[slug]/page.tsx`.
3. Add one E2E flow covering navigation from homepage grid to a project detail page.
4. Add one form test or manual verification checklist for Netlify form markup.

## Coverage Summary
- Unit tests: none found
- Integration tests: none found
- End-to-end tests: none found
- Visual regression tests: none found

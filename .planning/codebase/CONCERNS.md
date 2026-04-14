# Concerns

## Highest-Signal Concerns

### 1. Content schema is loosely validated
- [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts) trusts JSON/frontmatter shape heavily and uses type assertions rather than runtime validation.
- A malformed CMS edit could break build-time rendering or produce incomplete UI data.
- Risk level: medium

### 2. No automated tests
- The repo has linting but no unit, integration, or E2E coverage.
- Content-driven sites often regress at the schema/render boundary, which currently has no direct safety net.
- Risk level: medium

### 3. macOS artifact files are present in content and admin assets
- Examples found:
  - `content/projects/._mariko-daisy-ep-2025.md`
  - `content/projects/._personal-elevation.md`
  - `public/admin/._config.yml`
  - `.planning/._codebase`
- `npm run dev` deletes `._*` files before startup, which implies this has been a recurring issue rather than a one-off.
- Risk level: medium

### 4. Duplicate or legacy content paths increase ambiguity
- There are duplicated-looking font assets in both [app/fonts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/fonts) and [fonts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/fonts).
- The presence of [app/portfolio/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/portfolio/page.tsx) alongside the homepage-driven portfolio flow suggests a legacy or alternate experience that may drift from the main content model.
- Risk level: low to medium

### 5. Placeholder social links are still in live content
- [content/settings/site.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content/settings/site.json) contains `"#"` URLs for Instagram, LinkedIn, and Pinterest.
- This is not a code failure, but it is a product/content integrity issue visible to users.
- Risk level: low

### 6. Netlify/plugin configuration may exceed current app usage
- [netlify.toml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify.toml) includes `@netlify/plugin-emails`, but no matching application email flow or templates were found in the inspected app source.
- This may be harmless, but it can create operational confusion.
- Risk level: low

## Specific Fragile Areas
- [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts)
  - central parser and sorter for the whole site
  - fallback-heavy normalization logic
  - synchronous filesystem access throughout
- [public/admin/config.yml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin/config.yml)
  - source of truth for editable fields
  - must stay aligned with TypeScript shapes and parser assumptions
- [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx)
  - depends on complete `Project` objects and consistent sorting/indexing

## Performance and Operational Notes
- `images.unoptimized: true` in [next.config.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/next.config.ts) may be an intentional deployment workaround, but it can reduce image optimization benefits.
- Synchronous content reads are acceptable at this scale, but would become a limitation if the site grows significantly.

## Follow-Up Ideas
1. Add runtime validation for content shapes in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts).
2. Remove `._*` files from the repo and add stronger ignore/cleanup handling.
3. Decide whether [app/portfolio/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/portfolio/page.tsx) is still needed.
4. Add a minimal automated test harness around content parsing and route smoke checks.

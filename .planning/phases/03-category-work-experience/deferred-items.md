# Deferred Items

## Out of Scope Discoveries

- 2026-04-14: `next build` warns that the default export of `@sanity/image-url` is deprecated in [sanity/lib/image.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/sanity/lib/image.ts). This predates Plan 03-01 and does not block the new `/work` landing route.
- 2026-04-14: `next build` logs `[Stability] PortfolioGrid received 0 projects` from [components/PortfolioGrid.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/PortfolioGrid.tsx) because the home page still uses the legacy empty bridge. Homepage curation is owned by Phase 4.

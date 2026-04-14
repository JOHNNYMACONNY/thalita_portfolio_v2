# Conventions

## Code Style
- React components are primarily function components with inline prop interfaces.
- The codebase uses TypeScript type annotations but relies on type assertions in places, especially in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts).
- Formatting style uses double quotes in app code and semicolons inconsistently across files.
- Indentation varies slightly between files, suggesting formatting is not fully enforced.

## Routing and Composition Patterns
- Route files compose pages from shared components and data helpers rather than embedding large amounts of logic.
- Shared layout elements such as `Header` and `Footer` are imported directly into route files instead of being fully centralized in the root layout.
- Dynamic routes use App Router conventions with `generateStaticParams()` for static generation, as in [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx).

## Data Access Conventions
- Filesystem content access is centralized in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts).
- JSON content is loaded with a small generic helper `readJsonFile<T>()`.
- Markdown project parsing normalizes several legacy field shapes:
  - `categories`
  - `category`
  - `tags`
- Fallback behavior is used rather than strict validation, for example deriving `coverImage` from gallery content when missing.

## UI and Styling Conventions
- Tailwind utility classes are the dominant styling mechanism.
- Shared design tokens are defined as CSS custom properties in [app/globals.css](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/globals.css).
- The site favors an editorial aesthetic:
  - large heading typography
  - sharp corners
  - light gradients
  - restrained hover transitions
- Comments often document design intent, especially where previous visual treatments were intentionally removed.

## Client Component Conventions
- Interactive components explicitly opt into `"use client"`.
- Framer Motion is used for reveal transitions and overlay animation in:
  - [components/Hero.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Hero.tsx)
  - [components/PortfolioGrid.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/PortfolioGrid.tsx)
  - [components/NavigationOverlay.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/NavigationOverlay.tsx)

## Error Handling Conventions
- Error handling is minimal.
- `getProjectBySlug()` in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts) catches broadly and returns `null`.
- The project grid logs a stability warning with `console.error` when it receives zero projects in [components/PortfolioGrid.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/PortfolioGrid.tsx).
- Most other content reads assume valid files and valid shapes.

## Content Conventions
- Project content uses frontmatter plus markdown body text.
- Settings content is stored in JSON instead of TypeScript or YAML.
- CMS field names in [public/admin/config.yml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin/config.yml) are expected to remain aligned with parsing logic in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts).

## Naming Conventions
- Components: PascalCase file names like `ProjectCard.tsx`
- Helpers: camelCase exports like `getProjects`
- Routes/content slugs: kebab-case like `editorial-noir`

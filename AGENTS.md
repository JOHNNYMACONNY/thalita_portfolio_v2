<!-- GSD:project-start source:PROJECT.md -->
## Project

**Thalita Portfolio Content Migration**

This project is an editorial portfolio site for Thalita Bueno built in Next.js. The current site already ships a file-based portfolio, services, about, and contact experience; the active initiative is to replace the project-centric Work implementation with a Sanity-backed, category-and-image-centric gallery while preserving the site's visual identity.

The intended end state is a home page that shows a curated set of images, a dedicated Work landing page with three category cards, and category pages that display all images in each category. Decap CMS and the old markdown project model will be retired once the Sanity-backed flow is live and verified.

**Core Value:** Editors can manage a polished portfolio gallery through Sanity while visitors browse a cleaner, category-driven Work experience without losing the site's existing aesthetic quality.

### Constraints

- **Tech stack**: Continue using the existing Next.js App Router site — the migration should fit the current frontend architecture rather than replace the app shell
- **Visual continuity**: Preserve the established editorial styling and motion language — this is a content architecture migration, not a visual redesign
- **Route simplicity**: Work should resolve to `/work` plus category pages — avoid ambiguous coexistence with legacy `/work/[slug]`
- **CMS scope**: Sanity must manage categories and gallery items as first-class content — category cover images and homepage curation cannot remain hardcoded
- **Migration safety**: Remove Decap only after the Sanity-backed routes are working — avoid a gap where editors lose content management before the new path is live
- **Image delivery**: Next image configuration must support Sanity CDN assets — remote image handling needs to be updated during the migration
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Summary
- Application type: content-driven portfolio site built with Next.js App Router.
- Primary runtime: Node.js for build/server execution and synchronous filesystem reads during render.
- Language mix: TypeScript/TSX for app code, JSON and Markdown for managed content, CSS via Tailwind CSS v4.
## Core Technologies
- Framework: `next@16.1.4` in [package.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/package.json)
- UI runtime: `react@19.2.3`, `react-dom@19.2.3`
- Styling: `tailwindcss@^4`, `@tailwindcss/postcss@^4`, theme tokens in [app/globals.css](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/globals.css)
- Motion: `framer-motion@^12.29.0`
- Content parsing: `gray-matter@^4.0.3` in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts)
- Media processing dependency: `sharp@^0.34.5`
- Utility packages: `clsx`, `tailwind-merge`
## TypeScript and Module Settings
- TypeScript is enabled with `strict: true`, path alias `@/*`, `moduleResolution: "bundler"` in [tsconfig.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/tsconfig.json).
- The codebase allows `allowJs: true`, though the active app code inspected is TypeScript-first.
## Frontend Stack Details
- App Router entrypoints live under [app](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app).
- Shared UI lives under [components](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components).
- Custom fonts are loaded with `next/font/local` and `next/font/google` in [app/layout.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/layout.tsx).
- The visual system uses Tailwind utility classes plus CSS custom properties defined in [app/globals.css](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/globals.css).
## Content and Data Layer
- Content root: [content](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content)
- JSON settings files: `content/settings/site.json`, `about.json`, `services.json`, `experience.json`
- Project entries: Markdown files in `content/projects/*.md`
- Data access is centralized in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts), which uses Node `fs` and `path` with `gray-matter`.
- Data is read synchronously at render/build time; no database or remote data client is present.
## Build and Tooling
- Scripts in [package.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/package.json):
- ESLint uses Next core web vitals + TypeScript presets in [eslint.config.mjs](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/eslint.config.mjs).
- PostCSS is configured through [postcss.config.mjs](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/postcss.config.mjs).
## Image and Asset Handling
- Local images are served from [public/images](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/images) and `public/images/uploads`.
- Remote images from `res.cloudinary.com` are allowed in [next.config.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/next.config.ts).
- `images.unoptimized: true` is enabled in [next.config.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/next.config.ts), which changes how Next handles image optimization.
## Deployment Footprint
- Netlify is the primary deployment target based on [netlify.toml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify.toml).
- Build output is `.next`, with plugin usage for `@netlify/plugin-nextjs` and `@netlify/plugin-emails`.
## Notable Configuration Files
- [package.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/package.json)
- [tsconfig.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/tsconfig.json)
- [next.config.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/next.config.ts)
- [eslint.config.mjs](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/eslint.config.mjs)
- [netlify.toml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify.toml)
- [app/layout.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/layout.tsx)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

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
- Fallback behavior is used rather than strict validation, for example deriving `coverImage` from gallery content when missing.
## UI and Styling Conventions
- Tailwind utility classes are the dominant styling mechanism.
- Shared design tokens are defined as CSS custom properties in [app/globals.css](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/globals.css).
- The site favors an editorial aesthetic:
- Comments often document design intent, especially where previous visual treatments were intentionally removed.
## Client Component Conventions
- Interactive components explicitly opt into `"use client"`.
- Framer Motion is used for reveal transitions and overlay animation in:
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
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Summary
- The architecture is a simple content-driven Next.js monolith.
- Server-rendered route modules read local content through a single filesystem-backed API layer and pass typed data into presentational components.
- The main split is between server route composition and small client-side interactive components for animation and navigation.
## High-Level Pattern
- App structure: Next.js App Router with route-level page components in [app](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app)
- Data source: local filesystem content in [content](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content)
- Data access layer: [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts)
- Presentation layer: [components](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components)
## Entry Points
- Global shell: [app/layout.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/layout.tsx)
- Home page: [app/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/page.tsx)
- Static informational pages:
- Legacy/demo page:
- Dynamic content detail page:
## Data Flow
## Server and Client Boundaries
- Server-oriented route modules:
- Client components:
## Content Modeling
- Shared interfaces live in [app/types/index.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/types/index.ts).
- `Project` is the most important domain type and is assembled from Markdown frontmatter plus body content.
- `CMSSiteSettings`, `ServicesContent`, and `AboutContent` are read from JSON files.
## Routing Model
- Homepage anchors to portfolio grid with `/#portfolio`.
- Project details are statically parameterized through `generateStaticParams()` in [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx).
- The admin interface is served from static files under `public/admin` and exposed through a rewrite.
## Architectural Characteristics
- Simple and understandable; little indirection.
- Tight coupling between content schema and render code because validation is informal and centralized in one file.
- No service layer, repository layer, or API route boundary currently exists.
- The codebase is optimized for editorial/site maintenance rather than multi-user app behavior.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

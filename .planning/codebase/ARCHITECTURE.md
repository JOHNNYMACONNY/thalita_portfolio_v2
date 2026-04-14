# Architecture

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
  - [app/about/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/about/page.tsx)
  - [app/services/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/services/page.tsx)
  - [app/contact/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/contact/page.tsx)
- Legacy/demo page:
  - [app/portfolio/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/portfolio/page.tsx)
- Dynamic content detail page:
  - [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx)

## Data Flow
1. A route component calls a helper from [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts).
2. `lib/api.ts` reads JSON or Markdown from the `content` directory using synchronous `fs` APIs.
3. Markdown frontmatter is normalized into the shared `Project` shape from [app/types/index.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/types/index.ts).
4. The route passes plain objects to reusable components such as:
   - [components/Hero.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Hero.tsx)
   - [components/PortfolioGrid.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/PortfolioGrid.tsx)
   - [components/Footer.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Footer.tsx)
5. Client-side motion and overlay interactions are handled in `"use client"` components where needed.

## Server and Client Boundaries
- Server-oriented route modules:
  - [app/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/page.tsx)
  - [app/about/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/about/page.tsx)
  - [app/services/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/services/page.tsx)
  - [app/contact/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/contact/page.tsx)
  - [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx)
- Client components:
  - [components/Header.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Header.tsx)
  - [components/NavigationOverlay.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/NavigationOverlay.tsx)
  - [components/Hero.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Hero.tsx)
  - [components/PortfolioGrid.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/PortfolioGrid.tsx)
  - [components/ProjectCard.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ProjectCard.tsx)
  - [components/ContactForm.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ContactForm.tsx)

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

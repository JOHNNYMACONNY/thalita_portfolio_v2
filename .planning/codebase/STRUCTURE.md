# Structure

## Top-Level Layout
- [app](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app): Next.js App Router routes, global styles, fonts, shared types
- [components](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components): reusable UI and interactive building blocks
- [content](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content): CMS-managed JSON settings and Markdown project content
- [lib](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib): data access helpers
- [public](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public): static assets and Decap CMS admin files
- [netlify](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify): Netlify functions directory placeholder
- [utils](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/utils): small utilities such as `cn`
- [.gsd](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/.gsd): planning/spec artifacts already in the repo
- [.planning/codebase](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/.planning/codebase): generated codebase map documents

## App Directory Breakdown
- [app/layout.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/layout.tsx): root HTML shell, font setup, metadata, Netlify Identity script
- [app/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/page.tsx): homepage composition
- [app/about/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/about/page.tsx): about page
- [app/services/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/services/page.tsx): services page
- [app/contact/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/contact/page.tsx): contact page with form
- [app/portfolio/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/portfolio/page.tsx): separate portfolio grid page using hardcoded data
- [app/work/[slug]/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/work/[slug]/page.tsx): dynamic project detail route
- [app/not-found.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/not-found.tsx): not found UI
- [app/globals.css](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/globals.css): global Tailwind/CSS theme tokens and animation
- [app/types/index.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/types/index.ts): shared TS interfaces

## Components Breakdown
- Navigation:
  - [components/Header.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Header.tsx)
  - [components/NavigationOverlay.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/NavigationOverlay.tsx)
  - [components/OverlayMenu.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/OverlayMenu.tsx)
- Homepage/editorial sections:
  - [components/Hero.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Hero.tsx)
  - [components/HomeProfileCard.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/HomeProfileCard.tsx)
- Portfolio presentation:
  - [components/PortfolioGrid.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/PortfolioGrid.tsx)
  - [components/ProjectCard.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ProjectCard.tsx)
  - [components/ProjectNavigation.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ProjectNavigation.tsx)
- Shared/footer/form:
  - [components/Footer.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/Footer.tsx)
  - [components/ContactForm.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ContactForm.tsx)

## Content Layout
- Settings:
  - [content/settings/site.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content/settings/site.json)
  - [content/settings/about.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content/settings/about.json)
  - [content/settings/services.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content/settings/services.json)
  - [content/settings/experience.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content/settings/experience.json)
  - [content/settings/categories.json](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/content/settings/categories.json)
- Projects:
  - `content/projects/*.md`

## Naming and Organization Patterns
- Route modules use Next App Router conventions: `page.tsx`, `layout.tsx`, `not-found.tsx`.
- Shared domain types are grouped under `app/types` instead of a more typical `types` or `lib/types`.
- Files generally use PascalCase for React components and camelCase for helper functions.
- Content file names use kebab-case slugs, which align with project URLs.

## Static Asset Layout
- CMS/admin assets: [public/admin](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin)
- Site images: [public/images](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/images)
- CMS uploads: [public/images/uploads](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/images/uploads)
- Fonts appear in both [app/fonts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/fonts) and [fonts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/fonts), which suggests some duplication.

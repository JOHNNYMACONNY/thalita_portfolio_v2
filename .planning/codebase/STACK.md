# Stack

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
  - `npm run dev` starts Next dev after deleting `._*` artifacts.
  - `npm run dev:admin` runs `npx decap-server`.
  - `npm run build` runs `next build`.
  - `npm run lint` runs `eslint`.
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

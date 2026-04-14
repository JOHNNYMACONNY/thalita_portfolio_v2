# Phase 1: Sanity Foundation - Research

**Researched:** 2026-04-14
**Domain:** Sanity Studio + `next-sanity` foundation inside a Next.js App Router repo
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Category model
- **D-01:** Phase 1 will support exactly three canonical Work categories.
- **D-02:** The five categories from the old site will not be carried forward into the new Sanity model.
- **D-03:** The schema should be extendable later, but this phase should not create hidden or extra categories beyond the three canonical ones.

### Gallery item granularity
- **D-04:** Each image will become its own `galleryItem` document.
- **D-05:** The new model will not preserve project-level gallery groupings as first-class Work content.

### Category assignment
- **D-06:** Each `galleryItem` belongs to a single category only.
- **D-07:** Cross-listing across multiple categories is intentionally out of scope for the initial model to keep navigation and editorial decisions simple.

### Home curation controls
- **D-08:** Home page curation will use a simple `showOnHomePage` boolean plus an explicit order field.
- **D-09:** This Phase 1 schema should preserve the current simple editorial workflow rather than introducing a more complex curation system.

### Sanity access model
- **D-10:** The initial Sanity setup may assume two Administrator users on the Free plan for Thalita and her collaborator.
- **D-11:** The phase does not need extra role modeling beyond what the Free plan supports today.

### the agent's Discretion
- The exact Sanity schema field names may follow repo conventions as long as they preserve the locked decisions above.
- The implementation may choose whether to seed the three canonical categories during setup or document them for manual creation, provided the Studio is ready to manage only those three categories.
- Since category names, slugs, and cover images were not locked during discussion, the schema should support editor-authored values for those fields rather than hardcoding editorial content assumptions.

### Deferred Ideas (OUT OF SCOPE)
- Additional categories beyond the three canonical ones — reconsider only if the Work information architecture expands in a later phase.
- Multi-category assignment for a single image — revisit only if navigation or editorial needs become more complex later.
- More complex home curation workflows beyond a boolean plus order field — future enhancement, not needed for initial migration.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAN-01 | Editor can manage exactly three visible Work categories in Sanity with title, slug, description, cover image, and display order | Category document schema, required-field validation, Studio embedding pattern, and category-governance recommendation in `Architecture Patterns` and `Common Pitfalls` |
| SAN-02 | Editor can manage gallery items in Sanity with image, alt text, category references, visibility, and home page curation fields | `galleryItem` document schema, strong single-category reference pattern, image handling guidance, and env/client wiring in `Standard Stack` and `Code Examples` |
</phase_requirements>

## Summary

This repo should add Sanity as an embedded Studio under a dedicated App Router catch-all route and keep the existing site shell intact rather than introducing a second app or separate Studio project. That matches the current Next.js App Router architecture in this repo and the official Sanity guidance for embedded Studio in Next.js. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]

The standard foundation for this phase is `sanity` for Studio configuration, `next-sanity` for the Next.js client and embedded Studio route, and `@sanity/image-url` for frontend-ready image URLs. Sanity’s current docs position `next-sanity` as the Next.js toolkit for Studio embedding and data fetching, and the npm registry confirms current package versions as `sanity@5.20.0`, `next-sanity@12.2.2`, and `@sanity/image-url@2.1.1` as of April 7, 2026, April 7, 2026, and March 30, 2026. [CITED: https://www.sanity.io/docs/nextjs] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] [VERIFIED: npm registry]

The biggest planning nuance is the "exactly three categories" constraint. Sanity’s documented primitives let you control create menus, templates, and structure, but I did not find an official built-in max-document-count rule in the docs reviewed here. The safest Phase 1 recommendation is to model `category` as a normal document type, require its editorial fields, and enforce "three canonical categories only" through Phase 1 setup plus verification, while treating stronger Studio-side caps as optional follow-up customization if needed. [CITED: https://www.sanity.io/docs/studio/new-document-options] [CITED: https://www.sanity.io/docs/initial-value-templates] [ASSUMED]

**Primary recommendation:** Embed Sanity Studio at `/studio`, add a small `sanity/` module (`env.ts`, `lib/client.ts`, `lib/image.ts`, schema files, config/CLI files), model `category` and `galleryItem` as first-class documents with strong references, and verify the three-category rule operationally in Phase 1 instead of hand-rolling custom count enforcement. [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] [CITED: https://www.sanity.io/docs/reference-type] [ASSUMED]

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sanity` | `5.20.0` | Sanity Studio, schema definition, config, CLI integration | Official package for Studio and schema work; the embedded Studio docs install `sanity@latest` directly. [VERIFIED: npm registry] [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio] |
| `next-sanity` | `12.2.2` | Next.js client, typed GROQ helpers, `NextStudio` route integration | Official Sanity toolkit for Next.js; Sanity docs use it for embedded Studio and client config. [VERIFIED: npm registry] [CITED: https://www.sanity.io/docs/nextjs] |
| `@sanity/image-url` | `2.1.1` | Build Sanity CDN image URLs from image objects | Official image builder used by Sanity’s Next.js image guidance. [VERIFIED: npm registry] [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `next-sanity/image` | bundled in `next-sanity` | Sanity-aware wrapper around `next/image` | Use when frontend rendering begins; its docs say no `remotePatterns` entry is needed for Sanity images when this loader is used. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Embedded Studio in this repo | Separate Studio project | Avoids coupling, but conflicts with this phase goal of "Studio is available inside the project" and adds deployment/context overhead. [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs] |
| `next-sanity` client | raw `@sanity/client` wiring | Possible, but Sanity’s current Next.js docs standardize on `next-sanity` for App Router integration, Studio embedding, and future preview/live features. [CITED: https://www.sanity.io/docs/nextjs] |
| String category keys on gallery items | Sanity `reference` field | Strings are simpler short-term, but strong references preserve referential integrity and match the single-category document model. [CITED: https://www.sanity.io/docs/reference-type] |

**Installation:** [VERIFIED: npm registry]
```bash
npm install sanity@5.20.0 next-sanity@12.2.2 @sanity/image-url@2.1.1
```

**Version verification:** [VERIFIED: npm registry]
```bash
npm view sanity version
npm view next-sanity version
npm view @sanity/image-url version
```

- `sanity@5.20.0` published `2026-04-07T12:48:35.345Z`. [VERIFIED: npm registry]
- `next-sanity@12.2.2` published `2026-04-07T23:25:54.805Z`. [VERIFIED: npm registry]
- `@sanity/image-url@2.1.1` published `2026-03-30T17:44:33.263Z`. [VERIFIED: npm registry]

## Architecture Patterns

### Recommended Project Structure
```text
sanity/
├── env.ts                 # shared Sanity env assertions
├── cli.ts                 # Sanity CLI project config
├── lib/
│   ├── client.ts          # next-sanity createClient()
│   └── image.ts           # urlFor() helper
├── schemaTypes/
│   ├── documents/
│   │   ├── category.ts    # category document schema
│   │   └── galleryItem.ts # gallery item document schema
│   └── index.ts           # schema export list
└── structure.ts           # optional desk structure / create-menu rules

app/
└── studio/
    └── [[...tool]]/
        └── page.tsx       # embedded Studio route

sanity.config.ts           # Studio config with basePath '/studio'
```

This structure fits the repo’s current pattern of centralized data helpers and keeps Sanity isolated from the existing filesystem-backed `lib/api.ts`, which should remain untouched in Phase 1. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]

### Pattern 1: Embed Studio with an App Router catch-all route
**What:** Mount Sanity Studio inside the existing Next.js app on `/studio` using `NextStudio` and an App Router catch-all route. [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]

**When to use:** Use this for Phase 1 because the roadmap explicitly wants Studio available inside the repo and the project already uses App Router. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]

**Example:**
```tsx
// Source: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

### Pattern 2: Centralize environment config and fail fast
**What:** Put `projectId`, `dataset`, and `apiVersion` in a dedicated Sanity env module with explicit assertions. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]

**When to use:** Always. This phase introduces the repo’s first remote CMS client, so misconfiguration should fail at startup rather than through null data later. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]

**Example:**
```ts
// Source: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs
function assertValue<T>(value: T | undefined, message: string): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-01";
```

### Pattern 3: Keep `galleryItem` single-category with a strong reference
**What:** Store one strong `reference` from `galleryItem` to `category`, not an array and not a string key. [CITED: https://www.sanity.io/docs/reference-type]

**When to use:** This matches locked decisions D-06 and D-07 and avoids modeling drift before the frontend migration begins. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md]

**Example:**
```ts
// Source: https://www.sanity.io/docs/reference-type
defineField({
  name: "category",
  title: "Category",
  type: "reference",
  to: [{ type: "category" }],
  validation: (rule) => rule.required(),
});
```

### Pattern 4: Treat image presentation as Sanity-native from the start
**What:** Add `sanity/lib/image.ts` now, even though frontend rendering lands later, so query and schema work already align with Sanity image objects. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]

**When to use:** Use this in Phase 1 because the success criteria require the repo to be frontend-query-ready, and current app code only knows local/Cloudinary URLs. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]

**Anti-Patterns to Avoid**
- **Writing Sanity config inline in route files:** Keep Studio config and client wiring in dedicated `sanity/` modules, not mixed into page components. [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]
- **Replacing `lib/api.ts` in Phase 1:** This phase is foundation only; keep legacy markdown readers in place until Phase 2/3 migration work. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md]
- **Modeling category as free text:** Use a strong document reference so editors cannot silently drift category spelling or slug semantics. [CITED: https://www.sanity.io/docs/reference-type]
- **Using a multi-reference category array on `galleryItem`:** That directly contradicts locked decisions D-06 and D-07. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Next.js Sanity client wiring | Custom `fetch()` wrappers over Sanity HTTP APIs | `createClient()` from `next-sanity` | Sanity’s Next.js docs standardize on `next-sanity`, including env structure and per-request overrides. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| Embedded Studio route plumbing | Ad hoc React mount or custom iframe shell | `NextStudio` on `app/studio/[[...tool]]/page.tsx` | Official integration already handles metadata, viewport, and Next-friendly route embedding. [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs] |
| Image URL generation | Manual string concatenation for CDN transforms | `@sanity/image-url` | Official Sanity image guidance expects a builder fed by the configured client. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] |
| Category linkage | Custom string IDs or duplicated slug fields on items | Strong `reference` to `category` | Built-in referential integrity is safer than string joins. [CITED: https://www.sanity.io/docs/reference-type] |

**Key insight:** The custom code in this phase should define content shape and local module boundaries, not recreate Studio, client, or image infrastructure that Sanity already ships. [CITED: https://www.sanity.io/docs/nextjs] [CITED: https://www.sanity.io/docs/reference-type]

## Common Pitfalls

### Pitfall 1: Embedded Studio route works locally but breaks on nested Studio URLs
**What goes wrong:** Editors can open `/studio`, but deeper routes like `/studio/structure/...` fail if the route is not catch-all. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]
**Why it happens:** Sanity’s embedded Studio expects all subroutes under `basePath` to resolve back to the mounted Studio page. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]
**How to avoid:** Use `app/studio/[[...tool]]/page.tsx` and `basePath: "/studio"`. [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]
**Warning signs:** `/studio` loads but tool navigation, inspect panes, or document URLs 404. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]

### Pitfall 2: Missing CORS origin blocks authenticated Studio/API behavior
**What goes wrong:** Embedded Studio appears mounted, but authenticated requests fail. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]
**Why it happens:** Sanity’s Studio embedding docs explicitly require the host domain to be added to project CORS origins with authenticated requests enabled. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]
**How to avoid:** Include local and production app domains in the Sanity project CORS settings during Phase 1 verification. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]
**Warning signs:** Editors can see the shell but cannot log in cleanly or fetch protected project data. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio]

### Pitfall 3: Using `useCdn: true` for every query path
**What goes wrong:** Future static generation, revalidation, or preview paths can serve stale content. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]
**Why it happens:** Sanity’s client docs recommend `useCdn: true` as a baseline, but explicitly call out build-time, webhook, and draft scenarios that should bypass the CDN. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]
**How to avoid:** Set the base client to `useCdn: true`, then use `client.withConfig({ useCdn: false })` for build-time or revalidation-sensitive fetches in later phases. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]
**Warning signs:** Published edits appear in Studio but not in statically generated pages when frontend migration begins. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]

### Pitfall 4: Weak or array-based category references drift away from the approved IA
**What goes wrong:** Gallery items can reference missing categories or multiple categories, which breaks the approved single-category model. [CITED: https://www.sanity.io/docs/reference-type] [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md]
**Why it happens:** Sanity supports both weak references and reference arrays, but those are optional modeling choices, not defaults. [CITED: https://www.sanity.io/docs/reference-type]
**How to avoid:** Use a single strong `reference` field and validate it as required. [CITED: https://www.sanity.io/docs/reference-type]
**Warning signs:** Editors can save a gallery item without a stable category target or with multiple category picks. [CITED: https://www.sanity.io/docs/reference-type]

### Pitfall 5: Planning around strict category-count enforcement without deciding the UX
**What goes wrong:** Phase 1 scope balloons into desk-structure or action customization just to prevent a fourth category. [CITED: https://www.sanity.io/docs/studio/new-document-options] [CITED: https://www.sanity.io/docs/initial-value-templates]
**Why it happens:** Sanity provides menu/template customization, but strict document-count governance is a product decision layered on top of those primitives, not a one-line schema field. [CITED: https://www.sanity.io/docs/studio/new-document-options] [CITED: https://www.sanity.io/docs/initial-value-templates] [ASSUMED]
**How to avoid:** Keep Phase 1 focused on stable schema and working Studio access; enforce the three-category rule through setup/verification unless the user explicitly wants custom Studio restrictions now. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md] [ASSUMED]
**Warning signs:** The implementation starts adding custom document actions or desk logic before basic schemas, env wiring, and Studio access are working. [ASSUMED]

## Code Examples

Verified patterns from official sources:

### Embedded Studio route
```tsx
// Source: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

### Base client and image helper
```ts
// Source: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs
// Source: https://www.sanity.io/docs/nextjs/next-sanity-image-component
import { createClient } from "next-sanity";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

### `category` schema
```ts
// Source: https://www.sanity.io/docs/studio/slug-type
// Source: https://www.sanity.io/docs/initial-value-templates
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
});
```

### `galleryItem` schema
```ts
// Source: https://www.sanity.io/docs/reference-type
// Source: https://www.sanity.io/docs/initial-value-templates
import { defineField, defineType } from "sanity";

export const galleryItemType = defineType({
  name: "galleryItem",
  title: "Gallery item",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isVisible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showOnHomePage",
      title: "Show on home page",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homePageOrder",
      title: "Home page order",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
  ],
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Decap CMS + local markdown/JSON files | Embedded Sanity Studio + Content Lake documents + `next-sanity` client | Current Sanity docs updated March 18, 2026; project roadmap targets this migration now. [CITED: https://www.sanity.io/docs/nextjs] [VERIFIED: codebase grep] | The repo gains remote content infrastructure and environment-based client config instead of synchronous filesystem reads. |
| Manual `next/image` remote host setup for Sanity URLs | `next-sanity/image` can use a Sanity-aware loader without `remotePatterns` for Sanity images | Documented in current image guide. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] | Frontend phases can avoid extra `next.config.ts` image host wiring if they adopt the Sanity loader. |
| Project-level work entries with nested galleries | Image-level `galleryItem` documents referencing `category` | Locked by current phase context. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md] | Query shape and editorial workflow become image-centric, which simplifies category pages and home curation later. |

**Deprecated/outdated:**
- Relying on Decap’s `public/admin/config.yml` as the source of truth for new Work content is outdated for this initiative; the roadmap explicitly moves Work management to Sanity. [VERIFIED: codebase grep] [VERIFIED: .planning/REQUIREMENTS.md]
- Building future Sanity image rendering around the repo’s current Cloudinary-only `remotePatterns` is outdated; current Sanity docs provide a Sanity-native image loader path. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Phase 1 should enforce the three-category rule operationally rather than through custom Studio count restrictions. | Summary, Common Pitfalls | Planner may under-scope Studio customization if the user expects hard technical enforcement now. |
| A2 | Warning-sign language around future custom actions/desk logic presumes those would be unnecessary complexity for this phase. | Common Pitfalls | Planner may deprioritize restrictions the user actually wants in Phase 1. |
| A3 | Sanity-hosted access control on the Free plan is sufficient for the two-admin setup without extra role modeling work in this phase. | Security Domain | Planner may miss permission setup work if the account/project reality differs from the discussion decision. |

## Open Questions (RESOLVED)

1. **Should Phase 1 hard-block creation of a fourth category, or is setup + manual verification enough?**
   - Resolution: Phase 1 should enforce the three-category workflow through Studio structure and plan verification, not merely through setup notes. The phase plans should prevent an open-ended extra-category creation path so the editor experience matches the locked "exactly three canonical categories" decision. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md] [RESOLVED]

2. **Will the three category names/slugs be chosen during implementation or supplied separately by the editor?**
   - Resolution: The schema should support editor-authored category names and slugs, and Phase 1 should treat category creation as a manual verification/setup step rather than automatic seeding. This stays aligned with the context decision that names/slugs are not locked yet. [VERIFIED: .planning/phases/01-sanity-foundation/01-CONTEXT.md] [RESOLVED]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js + Sanity tooling | ✓ | `v25.8.2` | — |
| npm | Package install and `npx sanity` usage | ✓ | `11.11.1` | — |
| Sanity CLI global install | Optional direct `sanity` command | ✗ | — | Use `npx sanity ...` after dependency install. [VERIFIED: local shell] |
| Sanity project/account access | Studio login and project linking | ? | — | None. Requires human credentials. [ASSUMED] |

**Missing dependencies with no fallback:**
- Sanity project/account credentials are not verifiable from this workspace, but Phase 1 execution needs them for actual Studio access and CORS/project configuration. [ASSUMED]

**Missing dependencies with fallback:**
- No global `sanity` CLI is installed, but the official docs show project-local usage and the embed guide explicitly references `npx sanity ...` workflows once the package is installed. [VERIFIED: local shell] [CITED: https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected; only ESLint is configured. [VERIFIED: codebase grep] |
| Config file | none — see Wave 0. [VERIFIED: codebase grep] |
| Quick run command | `npm run lint` [VERIFIED: codebase grep] |
| Full suite command | `npm run lint` [VERIFIED: codebase grep] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SAN-01 | Category schema is registered and Studio allows create/edit with required fields | manual + lint | `npm run lint` | ❌ Wave 0 |
| SAN-02 | Gallery item schema is registered and Studio allows create/edit with required fields and category reference | manual + lint | `npm run lint` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run lint` [VERIFIED: codebase grep]
- **Per wave merge:** `npm run lint` plus manual Studio smoke check at `/studio`. [VERIFIED: codebase grep] [ASSUMED]
- **Phase gate:** `npm run lint` clean and manual confirmation that category/gallery documents can be created and edited in Studio. [ASSUMED]

### Wave 0 Gaps
- [ ] No automated test framework exists for route/schema smoke coverage; Phase 1 will rely on lint plus manual Studio verification unless a test harness is added first. [VERIFIED: codebase grep]
- [ ] No dedicated verification script exists for "Studio loads at `/studio`" or "schemas register correctly." [VERIFIED: codebase grep]

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes | Sanity Studio login and project membership control editor access. [ASSUMED] |
| V3 Session Management | no | Managed by Sanity-hosted auth/session flow, not custom app code in this phase. [ASSUMED] |
| V4 Access Control | yes | Restrict privileged values to server-only env vars and rely on Sanity project access rules for Studio access. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] [ASSUMED] |
| V5 Input Validation | yes | Schema `validation()` rules plus env assertion helpers. [CITED: https://www.sanity.io/docs/reference-type] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| V6 Cryptography | no | No cryptographic implementation should be added in this phase. [VERIFIED: phase scope] |

### Known Threat Patterns for Sanity + Next.js

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Exposing secret tokens through `NEXT_PUBLIC_*` env vars | Information Disclosure | Only project ID, dataset, and API version should be public; keep any read token server-only. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| Broken category integrity from weak or text-based links | Tampering | Use a strong `reference` field and required validation. [CITED: https://www.sanity.io/docs/reference-type] |
| Embedded Studio auth/CORS misconfiguration | Denial of Service | Register app domains in Sanity CORS settings with authenticated requests enabled. [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio] |

## Sources

### Primary (HIGH confidence)
- `https://www.sanity.io/docs/nextjs` - official Next.js integration overview, current recommended toolkit.
- `https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs` - official client/env/`useCdn` guidance.
- `https://www.sanity.io/docs/nextjs/embedding-sanity-studio-in-nextjs` - official App Router Studio embedding pattern.
- `https://www.sanity.io/docs/studio/embedding-sanity-studio` - official routing/CORS caveats for embedded Studio.
- `https://www.sanity.io/docs/nextjs/next-sanity-image-component` - official Sanity image loader guidance.
- `https://www.sanity.io/docs/reference-type` - official reference semantics and strong vs weak references.
- `https://www.sanity.io/docs/studio/new-document-options` - official create-menu customization docs.
- `https://www.sanity.io/docs/initial-value-templates` - official initial-value/template docs.
- Local codebase inspection of `package.json`, `next.config.ts`, `lib/api.ts`, `app/types/index.ts`, `public/admin/config.yml`, `.planning/config.json`, and the Phase 1 context/requirements files.
- npm registry checks for `sanity`, `next-sanity`, and `@sanity/image-url`.

### Secondary (MEDIUM confidence)
- `https://www.sanity.io/plugins/next-sanity` - official plugin page confirming the package purpose and install shape.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - official Sanity docs and npm registry both align on the package set and current versions.
- Architecture: MEDIUM - embedded Studio and env/client structure are well-supported by docs, but the exact three-category governance UX is still a product choice.
- Pitfalls: MEDIUM - most are directly documented, but the scope judgment around strict category-count enforcement remains assumption-driven.

**Research date:** 2026-04-14
**Valid until:** 2026-05-14

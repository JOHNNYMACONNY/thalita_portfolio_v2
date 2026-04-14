# Phase 2: Data Layer Migration - Research

**Researched:** 2026-04-14
**Domain:** Sanity-backed Work data helpers plus one-off markdown-to-Sanity migration for a Next.js App Router portfolio. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs]
**Confidence:** MEDIUM

## User Constraints

No phase-specific `02-CONTEXT.md` exists, so Phase 2 planning must honor `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, and the completed Phase 1 artifacts as the authoritative constraints. [VERIFIED: codebase grep]

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SAN-03 | Next.js app can fetch categories and gallery items from Sanity in production without relying on markdown project files | Use dedicated Sanity query modules built on `next-sanity`, keep `lib/api.ts` only for non-Work JSON content, and query categories/gallery items through typed GROQ helpers. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| MIG-01 | Existing markdown portfolio content is migrated into Sanity categories and gallery items with no loss of required images or category assignments | Use a deterministic manifest-driven migration script that expands each legacy image into one `galleryItem`, uploads local assets through NDJSON import, and verifies post-import counts plus category references. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] |
</phase_requirements>

## Summary

Phase 2 should split the legacy content layer instead of rewriting it wholesale: keep `lib/api.ts` for `content/settings/*.json`, but move all Work-specific reads into new Sanity helpers under `sanity/lib/` or `lib/work/` so upcoming `/work` category routes can depend on Sanity without destabilizing About/Services/Home shell content. The repo already centralizes content access in `lib/api.ts`, current Work consumers are `app/page.tsx`, `components/PortfolioGrid.tsx`, and `app/work/[slug]/page.tsx`, and Phase 1 intentionally isolated Sanity runtime code under `sanity/`. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]

The safest migration pattern is a two-step, deterministic import: first generate a reviewed manifest from `content/projects/*.md`, then emit NDJSON that imports categories by their fixed Phase 1 document IDs and creates one `galleryItem` per legacy image using `_sanityAsset` file references for local images. Sanity’s import docs support NDJSON imports, local file asset ingestion, and idempotent flags like `--replace` and `--missing`, which makes a repeatable import path safer than hand-entering images in Studio. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets]

The main risk is semantic loss, not transport. The approved Sanity model stores images plus one category, visibility, and home-page curation, while the markdown model still contains project-level metadata such as `client`, `role`, `year`, `description`, `credits`, `youtubeUrl`, and sometimes multiple categories. Current repo data includes 4 markdown project files, 6 total image slots, 1 multi-category project, and 2 projects whose only image is the cover image. Phase 2 must therefore use an explicit category mapping manifest and a completeness audit, not an implicit “first category wins” import. [VERIFIED: codebase grep] [ASSUMED]

**Primary recommendation:** Add Sanity-first Work query helpers and a manifest-driven import script, treat legacy markdown as migration input only, and fail the migration on any unmapped category, missing image file, or count mismatch. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] [ASSUMED]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Fetch visible categories for `/work` | Frontend Server (SSR/SG) | API / Backend | This repo uses App Router server components, and Sanity’s Next.js guidance centers data fetching through `next-sanity` in server-side code. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| Fetch visible gallery items by category | Frontend Server (SSR/SG) | CDN / Static | The app currently composes pages on the server, while Sanity’s CDN can back published read queries. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| One-off markdown to Sanity import | API / Backend | Database / Storage | Importing files and writing documents/assets is an offline content operation, not a browser concern. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] |
| Render Sanity images | Browser / Client | CDN / Static | The rendered UI ultimately consumes Sanity CDN image URLs, while image transforms and caching happen at the CDN layer. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] |
| Preserve non-Work JSON content (`site`, `about`, `services`) | Frontend Server (SSR/SG) | Database / Storage | Those files still live under `content/settings` and should remain filesystem-backed in this phase. [VERIFIED: codebase grep] |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sanity` | `5.20.0` | Schema/runtime alignment with the Phase 1 Studio and CLI-backed dataset import path. [VERIFIED: npm registry] | The repo already depends on it and Sanity’s import/docs tooling is anchored on the official package/CLI. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] |
| `next-sanity` | `12.2.2` | Shared client plus `defineQuery`/GROQ helpers for Next.js Work reads. [VERIFIED: npm registry] | Sanity’s current Next.js docs use `createClient` and typed query helpers from `next-sanity`. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| `@sanity/image-url` | `2.1.1` | Build stable Sanity CDN URLs from image objects while preserving crop/hotspot behavior. [VERIFIED: npm registry] | Sanity’s image docs require a builder-style URL step when rendering image objects. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `gray-matter` | `4.0.3` | Parse the existing markdown migration source in the one-off script. [VERIFIED: codebase grep] | Use only inside the migration script; do not keep it as the active Work read path after import. [VERIFIED: codebase grep] |
| `tsx` | `4.21.0` | Run a TypeScript migration script without adding new build tooling. [VERIFIED: codebase grep] | Use for a local/admin-only migration command if the planner wants a checked-in script. [VERIFIED: codebase grep] |
| `npx sanity datasets import` | bundled CLI path | Import NDJSON plus local assets into the dataset. [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] | Use instead of custom write clients for the initial bulk import. [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Dedicated Work query helpers | Extending `lib/api.ts` to mix filesystem and Sanity reads | Possible, but it would keep unrelated JSON/settings logic coupled to a remote CMS and make Phase 5 cleanup harder. [VERIFIED: codebase grep] [ASSUMED] |
| Manifest-driven NDJSON import | Manual Studio entry | Manual entry avoids scripting, but increases the chance of missing local images, category mismatches, and duplicate edits during retries. [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] [ASSUMED] |
| Deterministic `_id` values per imported record | Ad hoc generated IDs per run | Random IDs make repeat imports and verification harder because the same source image cannot be reconciled cleanly. [ASSUMED] |

**Installation:** Existing packages already cover this phase; no new runtime dependency is required beyond the checked-in Sanity stack from Phase 1. [VERIFIED: codebase grep]
```bash
# No additional npm install required for the recommended Phase 2 path.
```

**Version verification:** [VERIFIED: npm registry]
```bash
npm view sanity version time --json
npm view next-sanity version time --json
npm view @sanity/image-url version time --json
```

- `sanity@5.20.0` published `2026-04-07T12:48:35.345Z`. [VERIFIED: npm registry]
- `next-sanity@12.2.2` published `2026-04-07T23:25:54.805Z`. [VERIFIED: npm registry]
- `@sanity/image-url@2.1.1` published `2026-03-30T17:44:33.263Z`. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram
```text
content/projects/*.md + public/images/*
        |
        v
sanity/migrations/work-import.ts
  - parse frontmatter/body
  - apply explicit category map
  - expand cover + gallery images into image records
  - emit audit JSON + import.ndjson
        |
        v
npx sanity datasets import import.ndjson <dataset>
        |
        v
Sanity dataset
  - category (fixed IDs from Phase 1)
  - galleryItem (one per image)
        |
        +----------------------+
        |                      |
        v                      v
sanity/lib/queries.ts   sanity/lib/work.ts
  defineQuery strings      fetch wrappers / transforms
        |                      |
        +-----------> App Router routes/components
                       - future /work category routes
                       - future home curation reads
```

### Recommended Project Structure
```text
sanity/
├── lib/
│   ├── client.ts            # existing shared client
│   ├── image.ts             # existing URL builder
│   ├── queries.ts           # defineQuery constants for categories/gallery items
│   └── work.ts              # fetch wrappers returning app-facing shapes
├── migrations/
│   ├── work-category-map.ts # explicit legacy->canonical category mapping
│   └── work-import.ts       # manifest + NDJSON generator

lib/
├── api.ts                   # keep only settings/about/services filesystem readers
└── work-legacy.ts           # optional temporary markdown audit helpers only
```

### Pattern 1: Split Work data access out of `lib/api.ts`
**What:** Create Sanity-only Work helpers such as `getWorkCategories()`, `getGalleryItemsByCategorySlug(slug)`, and `getHomeGalleryItems()` in a dedicated module, while leaving `getSiteSettings()`, `getAboutContent()`, and `getServicesContent()` in `lib/api.ts`. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]
**When to use:** Use this at the start of Phase 2 so the planner can migrate Work data without destabilizing the rest of the site. [VERIFIED: codebase grep]
**Example:**
```typescript
// Source: https://context7.com/sanity-io/next-sanity/llms.txt
import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";

export const visibleCategoriesQuery = defineQuery(`
  *[_type == "category"] | order(displayOrder asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage {
      _type,
      asset,
      crop,
      hotspot,
      alt
    },
    displayOrder
  }
`);

export async function getWorkCategories() {
  return client.withConfig({ useCdn: false }).fetch(visibleCategoriesQuery);
}
```

### Pattern 2: Import through a reviewed manifest, not direct markdown traversal
**What:** Generate an intermediate manifest that records each source markdown file, every derived image record, the target category slot/document ID, and any ambiguity before writing NDJSON. [VERIFIED: codebase grep] [ASSUMED]
**When to use:** Always for this phase because the legacy source contains multi-category data and empty galleries. [VERIFIED: codebase grep]
**Example:**
```typescript
// Source: codebase pattern + Sanity import docs
type MigrationRecord = {
  sourceFile: string;
  legacySlug: string;
  sourceImageRole: "cover" | "gallery";
  sourceImagePath: string;
  sourceAlt: string;
  targetCategoryId: "work-category-1" | "work-category-2" | "work-category-3";
  showOnHomePage: boolean;
  homePageOrder?: number;
};
```

### Pattern 3: Query full image objects, not just asset URLs
**What:** Return image objects with `asset`, `crop`, and `hotspot` in GROQ so the existing `urlFor()` helper can preserve Sanity-native image behavior. [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images] [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]
**When to use:** Use this for category cards and gallery pages, even if a later transform also exposes `asset->url`. [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images]
**Example:**
```groq
// Source: https://www.sanity.io/docs/apis-and-sdks/presenting-images
*[_type == "galleryItem" && isVisible && category->slug.current == $slug] | order(homePageOrder asc, _createdAt asc) {
  _id,
  title,
  alt,
  image{
    _type,
    asset,
    crop,
    hotspot
  },
  "category": category->{
    _id,
    title,
    "slug": slug.current
  }
}
```

### Anti-Patterns to Avoid
- **Implicit category fallback:** Do not map `categories[0]` automatically when a source record has multiple legacy categories; fail and require an explicit mapping entry. [VERIFIED: codebase grep] [ASSUMED]
- **Reusing the old `Project` type as the new source of truth:** The current `Project` shape encodes project-level grouping and `/work/[slug]` navigation that the approved Sanity model does not preserve. [VERIFIED: codebase grep]
- **Replacing all of `lib/api.ts` in one pass:** Settings pages still depend on JSON files under `content/settings`. [VERIFIED: codebase grep]
- **Querying only `image.asset->url`:** That throws away crop/hotspot information needed for faithful image rendering. [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images] [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bulk dataset writes | Custom ad hoc script that uploads assets and patches documents one by one over raw HTTP | `npx sanity datasets import` with NDJSON and `_sanityAsset` file references | Sanity already supports NDJSON import, local file asset ingestion, and idempotent retry flags. [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] |
| Work query typing | Hand-maintained result interfaces disconnected from query text | `defineQuery` plus colocated fetch helpers | `next-sanity` exposes typed query helpers intended for Next.js apps. [CITED: https://context7.com/sanity-io/next-sanity/llms.txt] |
| Sanity image URLs | Manual string concatenation with CDN parameters | `urlFor()` via `@sanity/image-url` | The official builder preserves crop, hotspot, and transform semantics. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] |
| Category reconciliation | Hidden heuristics in the migration script | Checked-in explicit mapping table or manifest | The source data already contains categories that do not match the locked three-category model. [VERIFIED: codebase grep] |

**Key insight:** The custom code in Phase 2 should handle source-to-target mapping and verification only; content transport, image ingestion, and query transport already have standard Sanity primitives. [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs]

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Four legacy markdown records in `content/projects/*.md`, four local source images under `public/images*`, and the target Sanity dataset with fixed `category` document IDs from Phase 1. [VERIFIED: codebase grep] | Code edit plus data migration: generate manifest/NDJSON from markdown and import assets/documents into Sanity; do not delete markdown in this phase. [VERIFIED: codebase grep] [ASSUMED] |
| Live service config | Sanity project/dataset selection and CORS settings were configured in Phase 1 docs, and the target dataset may already contain editor-created category documents in the three fixed slots. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/studio/embedding-sanity-studio] | Manual check plus code edit: verify slot IDs and target dataset before import so the script does not create duplicate categories or target the wrong dataset. [VERIFIED: codebase grep] [ASSUMED] |
| OS-registered state | None found in the repo or planning artifacts. [VERIFIED: codebase grep] | None. [VERIFIED: codebase grep] |
| Secrets/env vars | `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and optional `NEXT_PUBLIC_SANITY_API_VERSION` are already part of the repo setup; a write-capable auth path for dataset import is still required, either via Sanity login or token-based CLI auth. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] [ASSUMED] | Manual setup: ensure the operator can authenticate the import command without hardcoding secrets into source control. [ASSUMED] |
| Build artifacts | No generated migration artifacts are checked in yet, and no installed package names need renaming in this phase. [VERIFIED: codebase grep] | Optional cleanup: keep generated manifest/NDJSON output outside shipped app paths, such as `sanity/migrations/out/` or `.planning/`. [ASSUMED] |

## Common Pitfalls

### Pitfall 1: Treating a project as one gallery item
**What goes wrong:** Only project cover images get imported, and gallery images disappear because the target model is image-centric. [VERIFIED: codebase grep]
**Why it happens:** The legacy source is organized by project markdown files, but Phase 1 locked the new model to one `galleryItem` per image. [VERIFIED: codebase grep]
**How to avoid:** Expand every cover image and every `gallery[]` entry into distinct import records, then verify the imported image count equals the derived manifest count. [VERIFIED: codebase grep] [ASSUMED]
**Warning signs:** Imported item count equals markdown file count instead of image count. [ASSUMED]

### Pitfall 2: Silent category drift from the legacy taxonomy
**What goes wrong:** Imported images land in the wrong canonical category because old labels like `Lookbook` or multi-category combinations are guessed instead of reviewed. [VERIFIED: codebase grep]
**Why it happens:** Phase 1 supports exactly three canonical categories, while the repo still contains a five-category settings file and one markdown record with two categories. [VERIFIED: codebase grep]
**How to avoid:** Require a checked-in mapping manifest and abort the migration on any unmapped legacy category or ambiguous source record. [VERIFIED: codebase grep] [ASSUMED]
**Warning signs:** The script can run successfully without reading a mapping table. [ASSUMED]

### Pitfall 3: Losing image behavior by importing/querying incomplete image objects
**What goes wrong:** Images render with incorrect crops or without hotspot awareness. [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images]
**Why it happens:** Only asset URLs are queried or stored in app-facing helpers, which bypasses the builder’s ability to honor full image metadata. [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images] [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]
**How to avoid:** Query full image objects and build display URLs through `urlFor()`. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component]
**Warning signs:** App code starts replacing `urlFor(image)` with raw string URLs from GROQ everywhere. [ASSUMED]

### Pitfall 4: Over-cutting the legacy data layer too early
**What goes wrong:** About/Services/Home shell data or legacy routes break because `lib/api.ts` is gutted before the Work route migration lands. [VERIFIED: codebase grep]
**Why it happens:** `lib/api.ts` currently mixes settings JSON reads with Work markdown reads, but only the Work part is in scope. [VERIFIED: codebase grep]
**How to avoid:** Remove only the Work-related exports from active use and leave settings readers intact until a later CMS phase. [VERIFIED: codebase grep] [ASSUMED]
**Warning signs:** Phase 2 touches `content/settings/*` or rewrites About/Services queries without a requirement. [VERIFIED: codebase grep]

## Code Examples

Verified patterns from official sources:

### Typed Next.js query helper
```typescript
// Source: https://context7.com/sanity-io/next-sanity/llms.txt
import { defineQuery } from "next-sanity";

export const categoryBySlugQuery = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    coverImage{
      _type,
      asset,
      crop,
      hotspot,
      alt
    }
  }
`);
```

### NDJSON image import record
```json
// Source: https://www.sanity.io/docs/apis-and-sdks/importing-data
{"_id":"gallery-editorial-noir-cover","_type":"galleryItem","title":"Editorial Noir","alt":"Model in black structured jacket","category":{"_type":"reference","_ref":"work-category-1"},"isVisible":true,"showOnHomePage":true,"homePageOrder":1,"image":{"_type":"image","_sanityAsset":"image@file:///absolute/path/to/public/images/gallery-1.jpg"}}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Synchronous filesystem reads from `content/projects/*.md` inside `lib/api.ts`. [VERIFIED: codebase grep] | `next-sanity` client helpers for Next.js data fetching. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] | Current Sanity Next.js docs were last updated March 18, 2026. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] | Work data should move into remote query helpers instead of staying coupled to markdown parsing. [VERIFIED: codebase grep] [ASSUMED] |
| Project-centric Work grouping with slug detail pages. [VERIFIED: codebase grep] | Image-centric `galleryItem` documents with a single `category` reference. [VERIFIED: codebase grep] | Locked in Phase 1 on 2026-04-14. [VERIFIED: codebase grep] | Legacy detail-page semantics cannot be the long-term source model for Phase 2+. [VERIFIED: codebase grep] |
| Local/Cloudinary image strings in app components. [VERIFIED: codebase grep] | Sanity image objects rendered through `@sanity/image-url` and optionally `next-sanity/image`. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] | Current docs last updated March 18, 2026. [CITED: https://www.sanity.io/docs/nextjs/next-sanity-image-component] | Query helpers should preserve image objects, not flatten every image to a string URL. [CITED: https://www.sanity.io/docs/apis-and-sdks/presenting-images] |

**Deprecated/outdated:**
- Treating `content/projects/*.md` as the active Work source after SAN-03 is outdated for this roadmap, even though markdown remains the migration input for Phase 2. [VERIFIED: codebase grep]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The migration should fail on ambiguous category mapping rather than auto-picking the first legacy category. | Summary; Architecture Patterns; Common Pitfalls | Imported images could land in the wrong canonical category and require manual repair. |
| A2 | Deterministic IDs per imported image are the safest operational choice for retries and audits. | Summary; Alternatives Considered | Re-runs may duplicate content or make diff-based verification harder. |
| A3 | A write-capable Sanity auth path will be needed beyond the public env vars, either interactive login or token auth. | Runtime State Inventory; Environment Availability | The import plan may block at execution time if no authenticated operator path exists. |
| A4 | Project-level metadata that no longer fits the approved schema should be preserved in an audit/manifest rather than reintroduced as first-class Work UI data. | Summary; Resolved Planning Decisions | The team may expect fields like `client` or `credits` to survive visibly in the new model. |

## Resolved Planning Decisions

1. **Canonical mapping from legacy categories to the three fixed category slots**
   - Resolution: Phase 2 planning converts this from an open research question into a checked-in mapping table plus a blocking approval checkpoint before dataset import. The execution plan must not guess ambiguous mappings; `work-category-map.ts` becomes the canonical source, and Task `02-02-02` requires human approval against the live Phase 1 category documents before import proceeds. [VERIFIED: .planning/phases/02-data-layer-migration/02-SOURCE-AUDIT.md] [VERIFIED: .planning/phases/02-data-layer-migration/02-02-PLAN.md]
   - Operational rule: Any unmapped legacy label, ambiguous multi-category source, or mismatch between the checked-in mapping and the live category slots blocks the import until corrected and approved. [VERIFIED: .planning/phases/02-data-layer-migration/02-02-PLAN.md]

2. **Project-level metadata preservation for traceability**
   - Resolution: Preserve only minimal provenance fields needed for auditability and overlap reconstruction, such as `legacyProjectSlug`, source file path, and source image role. Do not restore full legacy project metadata like `client`, `credits`, `description`, `role`, `year`, or `youtubeUrl` as first-class Work UI data in Phase 2. [VERIFIED: .planning/phases/02-data-layer-migration/02-SOURCE-AUDIT.md] [VERIFIED: .planning/phases/02-data-layer-migration/02-01-PLAN.md]
   - Operational rule: Additional legacy metadata may appear in audit or manifest artifacts, but not in the app-facing Phase 2 Work contracts unless a later phase explicitly requires it. [VERIFIED: .planning/phases/02-data-layer-migration/02-01-PLAN.md]

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Running Next.js and any TypeScript migration script | ✓ [VERIFIED: local command] | `v25.8.2` [VERIFIED: local command] | — |
| npm/npx | Registry verification and `npx sanity` import path | ✓ [VERIFIED: local command] | `11.11.1` / `11.11.1` [VERIFIED: local command] | — |
| Global `sanity` CLI | Bulk import execution | ✗ [VERIFIED: local command] | — | Use `npx sanity ...`, which is supported by the official docs. [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data] |
| Local source images under `public/images*` | Asset import completeness | ✓ [VERIFIED: codebase grep] | 4 source image files found [VERIFIED: codebase grep] | — |

**Missing dependencies with no fallback:**
- None identified during research. [VERIFIED: local command]

**Missing dependencies with fallback:**
- No global `sanity` CLI installation was found, but the documented `npx sanity datasets import` flow is available. [VERIFIED: local command] [CITED: https://www.sanity.io/docs/apis-and-sdks/importing-data]

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected; the repo currently exposes lint/build scripts only. [VERIFIED: codebase grep] |
| Config file | `none — see Wave 0`. [VERIFIED: codebase grep] |
| Quick run command | `npm run lint` [VERIFIED: codebase grep] |
| Full suite command | `npm run build` [VERIFIED: codebase grep] |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SAN-03 | Sanity helpers return visible categories and gallery items without markdown reads | integration/smoke | `npm run build` plus a small script that executes the Work queries against the configured dataset [ASSUMED] | ❌ Wave 0 |
| MIG-01 | Imported data preserves image count, category assignment, and home curation fields | script/audit | `node sanity/migrations/check-work-import.js` or equivalent manifest-vs-dataset comparison [ASSUMED] | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run lint` [VERIFIED: codebase grep]
- **Per wave merge:** `npm run build` [VERIFIED: codebase grep]
- **Phase gate:** Run the import audit script plus manual Studio spot-checks before `/gsd-verify-work`. [ASSUMED]

### Wave 0 Gaps
- [ ] `sanity/migrations/work-import.ts` or equivalent checked-in migration generator. [ASSUMED]
- [ ] `sanity/migrations/check-work-import.ts` or equivalent post-import verifier. [ASSUMED]
- [ ] A tiny integration harness that exercises the Sanity Work fetch helpers against a configured dataset. [ASSUMED]
- [ ] A documented migration checklist covering dry run, import, audit, and manual cleanup. [ASSUMED]

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no [ASSUMED] | Frontend visitors are not authenticating to view Work content in this phase. [VERIFIED: codebase grep] |
| V3 Session Management | no [ASSUMED] | No app-side session feature is introduced by the migration itself. [VERIFIED: codebase grep] |
| V4 Access Control | yes [ASSUMED] | Keep writes inside Sanity Studio/CLI auth boundaries; do not expose write tokens in public env vars. [CITED: https://www.sanity.io/docs/cli-reference/cli-datasets] [ASSUMED] |
| V5 Input Validation | yes [ASSUMED] | Use schema validation plus manifest validation for category IDs, file paths, alt text, and booleans before import. [VERIFIED: codebase grep] [ASSUMED] |
| V6 Cryptography | no [ASSUMED] | No new application cryptography is required; rely on Sanity-hosted transport/auth. [ASSUMED] |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Importing to the wrong dataset/project | Tampering | Centralize env assertions and print the resolved project/dataset before import. [VERIFIED: codebase grep] [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] |
| Leaking write credentials into client bundles | Information Disclosure | Keep write-capable auth out of `NEXT_PUBLIC_*` vars and use server-only auth for import operations. [CITED: https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs] [ASSUMED] |
| Importing unintended local files as assets | Tampering | Restrict import inputs to manifest-approved paths under `public/images` and fail on path traversal or missing files. [VERIFIED: codebase grep] [ASSUMED] |

## Sources

### Primary (HIGH confidence)
- https://www.sanity.io/docs/nextjs/configure-sanity-client-nextjs - current Next.js client guidance, env assertions, `useCdn`, and `withConfig()` overrides.
- https://www.sanity.io/docs/nextjs/next-sanity-image-component - current image rendering guidance for `next-sanity/image` and `@sanity/image-url`.
- https://www.sanity.io/docs/apis-and-sdks/importing-data - NDJSON import format and local asset ingestion examples.
- https://www.sanity.io/docs/cli-reference/cli-datasets - `sanity datasets import` flags including `--replace` and `--missing`.
- https://www.sanity.io/docs/apis-and-sdks/presenting-images - querying full image objects and following asset references.
- Repo files inspected: `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/STATE.md`, Phase 1 research/summaries, `lib/api.ts`, `app/types/index.ts`, `app/page.tsx`, `app/work/[slug]/page.tsx`, `components/PortfolioGrid.tsx`, `content/projects/*.md`, `content/settings/*.json`, `sanity/*`. [VERIFIED: codebase grep]

### Secondary (MEDIUM confidence)
- https://context7.com/sanity-io/next-sanity/llms.txt - `defineQuery` usage patterns for colocated typed GROQ helpers.

### Tertiary (LOW confidence)
- None. All unverified recommendations are tagged `[ASSUMED]`.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - package versions were confirmed from the npm registry and align with the checked-in Phase 1 setup. [VERIFIED: npm registry] [VERIFIED: codebase grep]
- Architecture: MEDIUM - the repo boundaries are clear, but the exact cutover sequence for legacy routes depends on unresolved category mapping and metadata-preservation decisions. [VERIFIED: codebase grep] [ASSUMED]
- Pitfalls: MEDIUM - the key risks are grounded in the actual source data, but some operational mitigations depend on the final migration script design. [VERIFIED: codebase grep] [ASSUMED]

**Research date:** 2026-04-14
**Valid until:** 2026-05-14 for package/docs status, or earlier if the category mapping decision changes. [VERIFIED: npm registry] [ASSUMED]

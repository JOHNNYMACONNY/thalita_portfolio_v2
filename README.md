# Thalita's Portfolio

A content-driven editorial portfolio for Thalita Bueno, built with Next.js, Tailwind CSS (v4), Framer Motion, and Sanity Studio.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Sanity Studio setup

Phase 1 embeds Sanity Studio directly in this Next.js app at `/studio`. The Studio uses public Sanity project identifiers from `.env.local` and shares the repo-local config in `sanity.config.ts`, `sanity.cli.ts`, and `sanity/schemaTypes`.

### Environment variables

Start from `.env.example` and add these values to `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET`: The dataset the Studio should read and write, usually `production`.
- `NEXT_PUBLIC_SANITY_API_VERSION`: API version for the shared client and embedded Studio. Phase 1 defaults to `2026-03-01`.

Only public identifiers belong in tracked examples. Do not add tokens, write secrets, or private credentials to `.env.example`.

### Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` into `.env.local` and fill in the real Sanity project ID and dataset.
3. Run `npm run dev`.
4. Open [http://localhost:3000/studio](http://localhost:3000/studio).
5. Sign in with a Sanity account that has access to the connected project.

### CORS and authenticated origins

The embedded Studio depends on Sanity project settings outside the repo. In Sanity Manage, add both your local origin and deployed site origin to CORS and enable authenticated requests for those origins. For local development, this usually includes `http://localhost:3000`. Without these settings, `/studio` may load but authentication and document operations can fail.

### Sanity access model

Phase 1 assumes two Administrator users on Sanity's Free plan for Thalita and her collaborator. Custom roles, custom permissions, and any extra repo-side permission modeling are intentionally out of scope for this phase.

### Manual verification checklist

1. Run `npm run dev`.
2. Open `/studio` and confirm the Studio shell loads.
3. Authenticate successfully with a Sanity Administrator account.
4. Confirm the top-level Studio navigation shows the custom `Upload Photos` and `Organize Photos` tools plus the task-oriented Work lists.
5. Create or edit category documents and confirm the workflow is limited to three category slots total.
6. For each category, confirm the document supports `title`, `slug`, `description`, `coverImage`, required cover-image `alt`, and `displayOrder`.
7. Create or edit a `galleryItem` document and confirm it supports `image`, `Description`, one `category` reference, `isVisible`, and `showOnHomePage`.
8. Turn on `showOnHomePage` and confirm `homePageOrder` appears; turn it off and confirm that field is hidden again.
9. Confirm the workflow does not expose a multi-category assignment path for gallery items.

## Photo upload workflow

Phase 6 adds a simpler intake path for non-technical editors inside `/studio`.

### Intended editor flow

1. Open `Upload Photos` in Studio.
2. Choose several image files at once.
3. Leave the destination on `Unassigned` when you want to upload first and sort later.
4. Review the upload results and move into `Organize Photos` or `Unassigned Photos` to continue organizing.
5. Open `Organize Photos` to sort the batch visually, review placement badges, and control homepage/category order.
6. Publish only after the photos are ready for the live site.

### Important behavior

- Uploads created through the batch upload tool are saved as draft `galleryItem` documents.
- `Unassigned` photos stay out of `/`, `/work`, and `/work/[slug]` until they are categorized and published.
- The upload tool pre-fills a starter label and Description from the filename so editors can refine details after intake.
- `Organize Photos` shows the `Unassigned` tray, all three category slots, and the homepage rail in one visual workspace.
- Bulk actions let editors move photos between categories, clear category placement, hide/show photos on the site, and add/remove photos from the homepage without opening every document.
- Category order and homepage order are managed from the organizer instead of manual number editing in the document form.

## Phase 2 fresh start workflow

Phase 2 intentionally starts the Work dataset from zero imported photos. The approved fresh-start receipt is tracked in `.planning/phases/02-data-layer-migration/02-FRESH-START-RECEIPT.md`, and the corresponding helper audit is tracked in `.planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md`.

### Operator runbook

1. Ensure `.env.local` contains the Sanity public identifiers, or export `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in your shell.
2. Verify the current dataset state with `npm run work:fresh-start -- --dry-run --strict --receipt .planning/phases/02-data-layer-migration/02-FRESH-START-RECEIPT.md`.
3. Re-run the helper audit with `npx tsx sanity/migrations/work-audit.ts --report .planning/phases/02-data-layer-migration/02-FRESH-START-AUDIT.md --strict`.
4. Treat `work:fresh-start` as the expected Phase 2 state even if the dataset still has `0` gallery items and `0` seeded category documents.
5. Keep the gallery empty initially; do not import legacy markdown photos into Sanity.
6. Add future Work images manually in Studio as `galleryItem` documents when editorially ready.
7. Seed or publish the three Work categories in Studio when editorial confirmation is complete, then re-run the receipt and audit commands to capture the updated state.

### Scope guardrails

- `work-audit` verifies the app-facing Sanity helper layer against the current dataset and checks that empty-state reads remain stable.
- The About/profile image should be handled in a later About/site-settings CMS phase, not through Work categories or Work gallery items.
- Non-Work content in `content/settings` remains unchanged during this Phase 2 fresh start.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: TypeScript

## 📁 Project Structure

- `app/`: Application routes, including the embedded `/studio` workspace.
- `components/`: Reusable UI components.
- `content/`: Remaining file-based site content for non-Work sections.
- `sanity/`: Shared Studio config, schemas, and migration/audit scripts.

## 📝 Roadmap & Status

See [.planning/ROADMAP.md](.planning/ROADMAP.md) for detailed granular progress.

- [x] **Source Code Recovery & Hardening**
- [x] **Visual Redesign (Editorial Elevation)**
    - "Plates" aesthetic for Homepage.
    - "Spread" layout for Projects.
    - Minimalist Typography (Caooli / Orlient).
- [x] **CMS Integration**
  - Services Page (JSON managed).
  - Sanity-backed Work categories and gallery items.
- [x] **Mobile & Performance**
  - Responsive Hardening (iPhone X verified).
  - LCP Optimization.
  - Custom 404 Page.

# Integrations

## Summary
- This project is mostly self-contained.
- The active integrations are CMS/admin hosting, Netlify form handling, Netlify Identity, Netlify deployment plugins, remote image allowlisting, and embedded external media references stored in content.

## Netlify
- Deployment config is defined in [netlify.toml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify.toml).
- Next.js deployment support comes from `@netlify/plugin-nextjs`.
- `@netlify/plugin-emails` is configured, though no email templates or mailer code were found in the main app paths inspected.
- `functions = "netlify/functions"` is present, but [netlify/functions](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify/functions) currently contains only `.gitkeep`.

## Netlify Identity
- The Netlify Identity widget is injected globally with:
  - [app/layout.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/layout.tsx)
  - Script source: `https://identity.netlify.com/v1/netlify-identity-widget.js`
- This is likely used to support CMS authentication on deployed environments.

## Decap CMS
- Admin entrypoint lives under [public/admin](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin).
- CMS config lives at [public/admin/config.yml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin/config.yml).
- Backend: `git-gateway`
- Media uploads:
  - `media_folder: "public/images/uploads"`
  - `public_folder: "/images/uploads"`
- Managed content targets:
  - `content/settings/site.json`
  - `content/settings/about.json`
  - `content/settings/services.json`
  - `content/settings/experience.json`
  - `content/projects/*.md`
- Local CMS development is supported via `npm run dev:admin`.

## Netlify Forms
- Contact form integration is handled declaratively in [components/ContactForm.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/components/ContactForm.tsx).
- Signals used:
  - `name="contact"`
  - `method="POST"`
  - `data-netlify="true"`
  - hidden `form-name` input
- A static form stub exists at [public/__forms.html](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/__forms.html) and a root-level [__forms.html](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/__forms.html), suggesting Netlify form detection support.

## External Media and Content Sources
- Remote image host allowlist: `https://res.cloudinary.com` in [next.config.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/next.config.ts).
- The legacy/demo portfolio route [app/portfolio/page.tsx](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/app/portfolio/page.tsx) uses multiple Cloudinary image URLs directly.
- Project content supports a `youtubeUrl` frontmatter field, parsed in [lib/api.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/lib/api.ts) and configured in [public/admin/config.yml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/public/admin/config.yml).

## Routing and Hosting Integration
- `/admin` is rewritten to `/admin/index.html` in [next.config.ts](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/next.config.ts).
- Netlify image redirect rules proxy `/_next/image` and `/_ipx/*` to `/.netlify/images` in [netlify.toml](/Volumes/YBF_Storage/Projects/Thali/thalita_portfolio/netlify.toml).

## Integrations Not Found
- No database client usage was found.
- No authentication library beyond Netlify Identity widget loading was found.
- No payments, analytics, error monitoring, or webhook consumers were found in the inspected source files.

# Wayne Omni website

The Wayne Omnipotent marketing site uses Astro for a fast static frontend, Decap CMS for Git-backed content editing, GitHub for review and version history, and Cloudflare Pages for preview and production deployments.

## Local development

Requirements: Node.js 22 and pnpm 11.

```sh
pnpm install
pnpm dev
```

For local CMS editing, run these in separate terminals:

```sh
pnpm dev
pnpm cms
```

Then open `http://localhost:4321/admin/`.

## Content model

- Services: `src/content/services/`
- Case studies: `src/content/case-studies/`
- Insights: `src/content/insights/`
- Shared site settings: `src/data/site.json`
- Decap CMS: `public/admin/`

The content schemas live in `src/content.config.ts`. Case-study metrics require a value, label, measurement period and evidence reference. Public metrics should also have client permission.

## Quality checks

```sh
pnpm content:check
pnpm build
```

GitHub Actions runs both checks on pull requests and on `main`.

## Cloudflare Pages

Connect `Waynechin4398/freelancemarketingagency` as a Pages project with:

- Production branch: `main`
- Build command: `pnpm build`
- Build output directory: `dist`
- Node.js: `22`
- Environment variable: `PUBLIC_SITE_URL` set to the final production origin, without a trailing path

Cloudflare Pages will create preview deployments for branches and deploy production after an approved merge to `main`.

## Decap CMS hosted login

Local editing works through `local_backend`. Hosted GitHub editing also needs a GitHub OAuth App and an OAuth proxy. Deploy the proxy (a Cloudflare Worker is suitable), store the GitHub client secret in the Worker environment, then add the Worker URL as `base_url` under `backend` in `public/admin/config.yml`.

Never commit the OAuth client secret, analytics credentials or other secrets.

## Analytics and launch placeholders

Analytics identifiers, SSM number, business address and final contact destinations are intentionally blank in `src/data/site.json`. Confirm the real values, complete legal review and configure consent before enabling non-essential analytics or advertising tags.

## AI-assisted content

The reviewable content process is documented in `.agents/content/`. It separates research, strategy, drafting, SEO and fact review, with a required human approval before merge and deployment.

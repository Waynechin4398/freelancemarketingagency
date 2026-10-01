# Wayne Omni AI-assisted content workflow

This repository uses a reviewable, provider-neutral content pipeline. Each role produces an artifact for the next role; no role publishes directly.

1. **Research** — builds a source ledger using primary or approved internal sources.
2. **Strategy** — defines audience, decision, angle, proof requirements and internal links.
3. **Writer** — drafts in the matching Astro content schema without inventing facts or metrics.
4. **SEO editor** — improves discoverability without changing the supported meaning.
5. **Reviewer** — checks claims, permissions, brand voice, multilingual nuance and compliance.
6. **Human owner** — approves the pull request.
7. **Automation** — validates content and builds Astro; merging to `main` triggers Cloudflare Pages.

## Non-negotiable gates

- No metric appears without an evidence reference, measurement period and permission.
- Research sources and private client files stay outside public Markdown unless publication is approved.
- AI output remains a draft until a human approves the pull request.
- Secrets are never stored in prompts, issues, content files or commits.
- Decap CMS uses editorial workflow; it is not a bypass around review.

Use the prompts in `prompts/` in order. Copy the resulting brief and source ledger into the content request or pull request so the review trail remains visible.

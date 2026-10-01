# Website leads (`/api/lead`)

The contact page's project brief posts to a Cloudflare Pages Function (`functions/api/lead.js`).
All logic lives here in `server/leads/`.

Flow: validate → spam checks (origin, honeypot, optional Turnstile, D1 rate limits) → save to D1 →
respond → in the background: AI summary + draft reply → alert email to Wayne → copy to the lead.

| Piece | Where | Cost |
| --- | --- | --- |
| Endpoint | Pages Function on the `wayne-omni` project | Free (100k requests/day) |
| Storage | D1 `wayne-omni-leads` (binding `DB`) | Free |
| AI summary + draft | Workers AI `@cf/google/gemma-4-26b-a4b-it` (binding `AI`) | Free (~15 of 10,000 daily neurons per lead) |
| Email | Resend HTTP API (`RESEND_API_KEY`) | Free (3,000/month, 100/day) |
| Spam check | Cloudflare Turnstile (optional) | Free |

## Settings (Pages → wayne-omni → Settings)

Bindings (already added): `DB` → D1 `wayne-omni-leads`, `AI` → Workers AI.

Secrets / variables:

- `RESEND_API_KEY` (secret, required for email)
- `TURNSTILE_SECRET` (secret, optional; also set `turnstileSiteKey` in `src/data/site.json`)
- `ANTHROPIC_API_KEY` (secret, optional; switches the AI to Claude, ~US$0.01/lead)
- `SEND_LEAD_COPY=false` to stop the copy to the lead
- Optional overrides: `NOTIFY_TO`, `ALERT_FROM`, `COPY_FROM`, `REPLY_TO`, `AI_MODEL`, `ANTHROPIC_MODEL`

## Schema

`migrations/0001_leads.sql` (already applied to the remote database).

## Viewing leads

Cloudflare dashboard → Storage & databases → D1 → `wayne-omni-leads` → Console:

```sql
SELECT created_at, name, email, company, ai_priority, notify_status, copy_status
FROM leads ORDER BY created_at DESC LIMIT 50;
```

## Local testing

Create a temporary `wrangler.toml` with `pages_build_output_dir = "./dist"` and the D1 binding,
put test values in `.dev.vars` (`RESEND_API_BASE` / `ANTHROPIC_API_BASE` can point at a local mock),
then `pnpm build && npx wrangler pages dev dist`. Do not commit `wrangler.toml`: it would override the
dashboard settings for this Pages project.

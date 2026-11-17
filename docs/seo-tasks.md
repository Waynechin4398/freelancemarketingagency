# SEO Tasks board (for Claude and other agents)

Wayne manages SEO work in the content portal (`/admin/` → **SEO Tasks**). Each task is a
Markdown file in `seo/tasks/` (not built into the website).

## Status flow

| Status | Meaning | Who sets it |
| --- | --- | --- |
| `idea` | Parked, not approved yet | Wayne or Claude (suggestions) |
| `approved` | Do it on the next daily run | Wayne |
| `in-progress` | Claude has started | Claude |
| `in-review` | The change is waiting in Workflow for Wayne to publish | Claude |
| `done` | The change is published | Claude, after the PR is merged |
| `blocked` | Claude needs something from Wayne (explain in `result`) | Claude |

## Daily run checklist for Claude

1. `git pull` on `main`. Read every file in `seo/tasks/` with `status: approved`, highest
   `priority` first. Only work on tasks where `owner: Claude`.
2. Make the change on a portal branch so it appears in Workflow
   (see `docs/content-portal.md`):
   - Articles: branch `cms/insights/<slug>`, one article per PR.
   - Page SEO: branch `cms/pageSeo/pages`, edit `src/data/pages.json`.
   - Service pages: branch `cms/services/<slug>`, one service per PR.
   - Base `main`, label `decap-cms/pending_review`, and only that entry's file in the PR.
3. Update the task file **directly on `main`** (small commit, `seo/` is not deployed):
   `status: in-review`, `pr: <PR URL>`, and a short `result` note in plain English.
4. When a task's PR has been merged, set `status: done`. If you cannot do a task, set
   `status: blocked` and explain why in `result`.
5. You may add new `idea` tasks you think are worth doing (e.g. from Search Console data),
   with a clear title and details. Never set your own ideas to `approved`.

Rules: no pricing on the site, no unsupported claims or guarantees, Malaysian English,
keep titles 50–60 characters including " — Wayne Omni" and descriptions 140–160 characters.

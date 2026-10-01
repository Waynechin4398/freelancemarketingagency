# Wayne Omni motion system

The interaction layer is dependency-free and shared by every page through `BaseLayout.astro`, `MotionSystem.astro`, and `global.css`. Astro's `ClientRouter` supplies page transitions while the header and cursor canvas persist between routes.

## Tokens

```css
--dur-fast: 150ms;
--dur-med: 350ms;
--dur-slow: 700ms;
--dur-page: 450ms;
--ease-out: cubic-bezier(.22, 1, .36, 1);
--ease-spring: cubic-bezier(.34, 1.56, .64, 1);
--ease-io: cubic-bezier(.65, 0, .35, 1);
--stagger: 60ms;
```

All new transitions and keyframe use are inside `prefers-reduced-motion: no-preference`. The reduce-motion fallback forces reveal content visible and disables transforms.

## Reveal utility

Add `data-reveal` to an element. Supported values are `fade-up`, `fade-in`, `clip-up`, and `line-grow`. An optional delay is expressed in milliseconds:

```html
<figure data-reveal="clip-up" data-reveal-delay="120">…</figure>
```

The shared observer uses a `0px 0px -12% 0px` root margin and `0.15` threshold, then unobserves the element. Hidden states are applied by JavaScript, so a script failure never strands content at zero opacity.

## Counters and progressive lines

- Add `data-count-to="7,000"` to a number. Prefixes and suffixes such as `RM`, `%`, `K`, and `+` are retained.
- Add `data-progress-line` to a supported journey or process container. Its `--line-progress` value is updated through the shared rAF-throttled scroll handler.

## Marquee

Use `.motion-marquee` with a `.motion-marquee-track` containing two identical groups; mark the duplicate `aria-hidden="true"`. Add `data-direction="rtl"` to reverse it. The 20-second loop pauses on hover.

## Interaction conventions

- Primary `.button.primary`, `.nav-cta`, and the project brief submit button receive magnetic movement on fine pointers only.
- Text links discovered inside `main` and the footer receive `.motion-link` automatically.
- The global controller reinitializes on `astro:page-load`; component scripts use a `data-*-ready` guard so View Transition navigation never double-binds events.
- Keep `data-ga-event`, `data-ga-method`, and `data-ga-location` attributes on tracked links. The shared click listener reads them after every client navigation.

## Interactive content explorers

`InteractiveExplorer.astro` provides a shared, dependency-free walkthrough. Use a unique `id`, an accessible `label`, and `items` with `label`, `title`, and optional `description`, `eyebrow`, `bullets`, `tags`, `href`, and `linkLabel`. `variant="journey"` uses a horizontal stage map on desktop; `variant="finder"` uses a goal selector. `dark` switches to the near-black palette.

- Home and About: selectable customer-journey stages with relevant service links.
- Services index: six business goals matched to the existing service content, not an automated diagnosis or a promised result.
- All six service detail pages: independent solution and process walkthroughs using the content collection as the source of truth.
- All seven case studies: challenge / strategy / deliverables / insight walkthroughs. Reported results remain visible; native disclosure cards reveal their existing source and period. No synthetic time series or new performance claims.

The navigation starts as ordinary fragment links, and every panel is server-rendered and visible without JavaScript. Enhancement adds tab semantics, a single keyboard tab stop, arrow/Home/End controls, previous/next buttons, and a **Read all** mode. Printed pages include all panels. No autoplay, timer, scroll trap, or required swipe. Controls are at least 44px high; text is never clipped by a reveal mask. Panel transitions use opacity/transform, with a single active-stage pulse, and respect reduced motion even when the preference changes during the visit.

Listeners are scoped to an AbortController and rebound once per body after Astro client navigation. Existing SEO metadata, collection content, GA4 listeners, contact links and submission behavior are unchanged. To check the static output after `pnpm run build`, run `node scripts/explorer-check.mjs`.

## Form note

The current project brief intentionally opens a `mailto:` draft. Its focus, filled, validation, shake, error, and loading states are animated, but it does not show a false server-success state because there is no submission endpoint. If a real endpoint is added later, the existing form can swap to a confirmation panel after a confirmed successful response.

## UX refresh (October 2026)

Styles live in `src/styles/enhancements.css` (loaded after `global.css`); behaviour lives in the components below. Everything respects reduced motion and fine-pointer checks.

- `ResultsStrip.astro` (home): count-up figures read directly from `approvedMetrics` in the case-study collection, each linking to its case study. Edit the `picks` list to change which metrics appear; never hardcode a number here.
- `GrowthCheck.astro`: three-question "where is growth stuck?" picker rendered inside `CtaBand` when `growthCheck` is set (home, about, work index). Pointer picks auto-advance; keyboard users select with arrows and press Enter/Next. The result recommends a service from the collection and pre-fills a WhatsApp message with the visitor's own answers. It sends a `growth_check_complete` GA4 event with only the answer keys and recommended service id — no personal data. The mapping lives in `recommend()`.
- `InteractionLayer.astro` (BaseLayout): card spotlight and gentle tilt on `.related-card`, `.project-card`, `.insight-card` and `[data-card-fx]`; pointer parallax on the home hero layers (`--px`/`--py`); and the sticky mobile action bar (≤620px), which replaces the floating WhatsApp button on phones and steps aside over the CTA band, contact brief and footer.

## Signal theme (October 2026)

The visual identity moved from the cobalt "Bauhaus metal" layer to the **Signal** theme, matched to the new wordmark (Ink #111111, Signal lime #D4FF3A, Paper #F2F1EC). The old identity block was removed from `global.css`; `src/styles/signal.css` now holds the brand layer and loads after `global.css` (base layout + motion system) and before `enhancements.css`.

- **Tokens.** Legacy names are aliased so older rules still work: `--cobalt` means "the accent that reads on this surface" (ink on light/lime, lime on ink — dark surfaces redefine it), `--green` is lime, `--signal-red` is ink. New: `--lime`, `--display` (Syne Variable), `--body` (Instrument Sans Variable), `--mono` (DM Mono), `--pill`, `--radius`. Fonts are self-hosted through `@fontsource` packages imported in `BaseLayout.astro`.
- **Logo.** `Wordmark.astro` renders "WAYNE ◎MNI" from vector outlines in `src/data/wordmark.json` (Syne ExtraBold converted to paths), using `currentColor` plus `--wm-core` for the target centre. Static files: `public/images/wayne-omni-wordmark(.svg|-light.svg)`, `wayne-omni-symbol.svg`, `icon-512.png` (schema logo), `apple-touch-icon.png`, `favicon-32.png`, `public/favicon.svg`, and a new `public/og.png`. The old brush-logo files are kept but no longer referenced.
- **Header.** Logo on the left, floating white pill nav on the right. The logo fades out once the page scrolls; sticky filter/sub-nav bars sit under the header and slide to the top while it is hidden (`body:has(.site-header.header-hidden)`).
- **Home.** `HeroCharacter.astro` is the brand "character" slot: the target drawn as an eye whose pupil follows the pointer (idle glance on touch, blinks, static with reduced motion). Replace the `<svg>` inside `[data-character-slot]` to drop in a commissioned mascot. `SignalValues.astro` renders AIM / BUILD / GROW as scroll-driven words. `ServiceRows.astro` (home and services index) replaces the old skewed carousel, which has been deleted: big rows that flip colour on hover with a floating preview card on fine pointers.
- **Copy.** Headlines were made more playful (e.g. "Growth, on target.", "Proof, not promises.", "Hello. Let's grow."); service, case-study and article content is unchanged.

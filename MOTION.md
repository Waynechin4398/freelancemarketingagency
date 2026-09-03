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

## Form note

The current project brief intentionally opens a `mailto:` draft. Its focus, filled, validation, shake, error, and loading states are animated, but it does not show a false server-success state because there is no submission endpoint. If a real endpoint is added later, the existing form can swap to a confirmation panel after a confirmed successful response.

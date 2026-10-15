# Zeno Landing Page: Design System & Motion Spec

This document describes the visual design, layout, components and every animation used in the Zeno landing page. It reflects the code in `src/` as built. The page is modelled on the structure and scroll rhythm of the reference site (https://ovo-armor.webflow.io/) and a screen recording of it. Code, copy and artwork are original to Zeno.

---

## 1. Design intent

| Principle | How it shows up |
|---|---|
| Premium, cinematic, dark | Near-black ground, one violet/pink glow family, large confident type |
| Editorial, not a card grid | Varied card sizes, alternating text/phone compositions, big negative space |
| Product first | The real Zeno screens (home, budgets, Zeno AI) are the main imagery |
| Restrained motion | Fade-and-rise entrances, one scroll-linked hero, one sticky phone. Nothing hijacks scroll |
| Honest content | Planned features are labelled "planned". No invented stats, testimonials or legal links |

---

## 2. Design tokens

Defined in `src/index.css` under `@theme` (Tailwind v4).

### 2.1 Colour

| Token | Value | Used for |
|---|---|---|
| `--color-ink` | `#050505` | Page and `html`/`body` background |
| `--color-panel` | `#0a0a0e` | Deep panel surfaces |
| `--color-line` | `rgb(255 255 255 / 0.08)` | Hairline card borders |
| `--color-muted` | `#9b9ba8` | Secondary text |
| `--color-violet` | `#8b5cf6` | Accent, focus, glow, active states |
| `--color-violet-soft` | `#a78bfa` | Accent text, icons, focus ring |
| `--color-pink` | `#ec4899` | Secondary glow (paired with violet) |

Text uses white at set opacities rather than extra greys: `white` (headings), `white/80` and `white/65` (body), `white/55` and `white/60` (descriptions), `white/35` (inactive).

Other fixed colours:

| Where | Value |
|---|---|
| Nav bar (scrolled) | `#0d0d10` at 80% + blur |
| Nav bar (top of page) | `white` at 3.5% + blur |
| Final CTA panel | `#0b0b10` base with three radial glows |
| Success state | emerald-400 tint (`emerald-400/10` fill, `/30` border) |
| Error text | `rose-300` |
| Category chips (match the app's budget donut) | orange `#ff8a00`, green `#16c172`, blue `#3b82f6`, red `#ef4444`, emerald `#10b981`, purple `#a855f7`, tan `#e8c98a` |
| Transaction icons | Noodles `#ff5a1f`, Uber `#34d3a8` |

### 2.2 Typography

Typeface: **Manrope Variable** (weights 400 to 800), self-hosted through `@fontsource-variable/manrope`. This avoids a third-party request and render-blocking CSS. Fallback stack: `ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`.

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Hero headline | `clamp(2.5rem, 6.4vw, 6.4rem)` | 800 | -0.045em | 1.08 |
| Section title (Features) | `clamp(2.2rem, 5vw, 4.5rem)` | 600 | -0.04em | 1.08 |
| Benefits title | `clamp(2.2rem, 4.6vw, 4.2rem)` | 600 | -0.04em | 1.1 |
| Premium title | `clamp(2.4rem, 5.2vw, 4.8rem)` | 600 | -0.04em | 1.06 |
| FAQ / Contact title | `clamp(2.4rem, 5vw, 4.4rem)` | 600 | -0.04em | 1 to 1.05 |
| Showcase statements | `clamp(1.9rem, 3.1vw, 3rem)` | 600 | -0.03em | 1.12 |
| Final CTA title | `clamp(2rem, 3.4vw, 3.2rem)` | 500 | -0.03em | 1.1 |
| Card title | 24 to 26px | 600 | -0.02em | tight |
| Body / description | 17 to 19px | 500 | normal | relaxed |
| Nav links | 15px | 600 | normal | normal |
| Small print | 13 to 15px | 400 to 500 | normal | snug |

The hero headline sets `text-wrap: balance` and carries a soft white text-shadow glow (`.glow-text`: `0 0 60px rgb(255 255 255 / 0.18)`) at 75% white.

### 2.3 Shape, border and depth

| Element | Radius | Border | Shadow / glow |
|---|---|---|---|
| Nav bar | 24px | none | `0 8px 40px -12px rgba(0,0,0,.8)` once scrolled |
| `.card` (feature/slider cards) | 28px | 1px `--color-line` | inset top highlight `rgb(255 255 255 / 0.04)`, gradient fill `white 3.5% to 1.2%` |
| Final CTA panel | 32px | 1px `white/7%` | three radial gradients (violet, pink, blue) |
| Buttons | full pill | none (solid) or `white/15` (ghost) | none |
| Inputs | 16px | 1px `white/10`, violet-soft on focus | none |
| FAQ item | 16px | 1px `white/6%` | none |
| Phone frame | 14cqw outer | titanium gradient rim | `0 40px 120px -30px rgba(0,0,0,.9)` plus violet halo |

### 2.4 Spacing and container widths

- Page gutter: `px-5` (20px) on mobile, `px-10` (40px) from `md`.
- Content max width: 1560px (cards, FAQ, footer, final CTA); nav 1640px; slider 1700px.
- Section vertical rhythm: about 96 to 144px top/bottom (`py-24 md:py-36`); hero and showcase use viewport-based units (`vh`).
- Anchor offset: `scroll-margin-top: 96px` so the fixed nav never covers a target.

---

## 3. Layout, section by section

Order matches the reference: nav, hero, feature cards, pinned showcase, slider, premium, FAQ, contact, final CTA, footer.

### 3.1 Navigation (`components/navigation/Navbar.tsx`)
- Fixed, centred pill: height 64px, max width 1640px, 24px radius.
- Left: mascot (34px) + lowercase wordmark "zeno" (26px, extrabold, 70% white).
- Right (desktop): Home, Features, Premium, FAQ, Contact, then a solid white **Join Waitlist** pill (54px tall).
- Mobile: hamburger toggles a dropdown panel (`aria-expanded`, `aria-controls`, Escape to close).
- The link of the section nearest the top is highlighted (`aria-current`).

### 3.2 Hero (`components/hero/Hero.tsx`)
- Headline "Stop Guessing / Where Your Money Goes." is `position: sticky; top: 0` with `padding-top: 17vh`, so it stays pinned while the phone image scrolls over it.
- Image: `hand-home.webp` (1024 x 1536), width `min(1000px, 112%)` on desktop, 100% on mobile, overlapping the headline by `-4vh` (mobile) / `-8vh` (desktop). A bottom mask (`linear-gradient(#000 72%, transparent)`) dissolves it into the page.
- Below: supporting copy (max 640px), **Join the Waitlist** (solid) and **Explore Zeno** (ghost) buttons, then a faint 460px gradient divider line.

### 3.3 Feature overview (`FeatureOverview.tsx`)
- Centred title "Money, Made Simple".
- Three-column grid on `lg`: equal 3 columns (`1fr / 1fr / 1fr`), gap 32px, with equal card heights (`min-h-[500px]`, `items-stretch`). Single column on mobile (`min-h-[412px]`).
- **Expense tracking card:** a violet-glowing highlighted transaction row (Noodles, `-₹150`), a faded Uber row (`-₹220`), and a third nearly invisible row, anchored cleanly at the bottom.
- **Budgets & limits card:** three tilted Zeno screens (ai, home, budget) centered symmetrically above the card edge at -10°, 0° and +10° with stepped opacity.
- **Zeno AI card:** the mascot at the centre of two concentric rings, with six category chips orbiting; shifted up to sit harmoniously within the card frame.

### 3.4 Pinned showcase (`ShowcasePinned.tsx`)
- Two columns on `lg` (`1.05fr / 1fr`). Left: four large statements, each at least 78vh tall. Right: the phone, held in place with CSS `position: sticky; top: 0; height: 100vh`.
- Phone width: `min(380px, 40vh)` so it always fits the viewport.
- Statements and the screen shown:
  1. "Track every rupee without the friction." shows Home
  2. "Set limits and watch your burn rate." shows Budget
  3. "See exactly where your money goes." shows Budget
  4. "Ask Zeno before you spend." shows Zeno AI
- Mobile: no sticky phone; each statement carries its own phone (260px wide) beneath the text.

### 3.5 Benefits slider (`BenefitsSlider.tsx`)
- Left-aligned headline "Your Money, Made Simpler" with a paragraph, and a solid **Join the Waitlist** button right-aligned on desktop.
- Horizontal track of four cards (`min(760px, 86vw)` wide, 340 to 380px tall) with CSS scroll-snap. Round white prev/next arrows overlap the card edges on desktop and sit below on mobile.
- Card visuals are built in HTML/SVG, with no borrowed artwork: a neon bow-tie with rings around the mascot, a budget donut ("10% budget spent"), a bar chart, and Zeno AI suggestion chips.

### 3.6 Premium (`premium-section/Premium.tsx`)
- Two columns: copy on the left, artwork on the right.
- Pill label "Zeno Premium · planned", headline "A Clearer Picture of Your Money.", two "planned" benefits, **Register interest** button.
- Artwork: the mascot over a violet/pink radial glow, an iridescent conic-gradient glass orb, and a glass lightning bolt (SVG linear gradient).

### 3.7 FAQ and contact (`faq/Faq.tsx`, `faq/StillQuestions.tsx`)
- "Questions?" heading with a short intro, then eight accordion rows (first one open) in a column up to 1120px wide.
- "Still have questions?" block follows. It shows **Contact us** only if `VITE_CONTACT_EMAIL` is set; otherwise **Join the Waitlist**.

### 3.8 Final CTA (`waitlist/FinalCta.tsx`)
- Small eyebrow and a centred headline, then a large 32px-radius panel (min height 560px) with three radial glows (violet bottom-right, pink top, blue bottom-left).
- Left: title, supporting text and the waitlist form. Right: `hand-budget.webp` bleeding off the bottom-right corner (`bottom: -18%`).

### 3.9 Footer (`footer/Footer.tsx`)
- Logo and social icons on the left; Company, Legal and Social link columns on the right; copyright line below.
- Links with no configured URL render as dimmed, non-interactive labels (`aria-disabled`, tooltip "Coming soon").

---

## 4. Components

| Component | Notes |
|---|---|
| `PhoneFrame` | CSS titanium phone. All radii use `cqw` units (container query width) so it scales exactly at any size. Layers: metal rim (1.1cqw), black bezel (2.2cqw), screen (rounded 10.7cqw). Three small side-button nubs. Optional violet halo. Accepts several screens and cross-fades the `active` one |
| `Button` | White pill. Solid (`bg-white text-black`) or ghost (`white/15` border). Sizes: md 48px, lg 56px |
| `Logo` | Mascot image plus wordmark, links to `#top` |
| `WaitlistForm` | Email field with arrow submit button, optional "what do you want help with" select (panel variant), required consent checkbox, honeypot field, status/error region |
| `Icons` | Hand-written 24px stroke icons (`currentColor`), no icon library |
| `.card` | Shared 28px rounded card with hairline border and soft gradient |

---

## 5. Animation and motion spec

Libraries: **GSAP 3 + ScrollTrigger** for scroll-linked and entrance motion; **CSS transitions and keyframes** for everything else. GSAP is registered once in `src/lib/motion.ts`.

### 5.1 Global rules
- Animate `transform` and `opacity` wherever possible. `filter: blur` is used only for brief entrances and is removed afterward (`clearProps`).
- No scroll hijacking and no smooth-scroll library: native scrolling is untouched.
- Initial hidden states are applied by GSAP (`from` tweens), not CSS. If animation setup fails, all content remains visible.
- Every tween is created in a `gsap.context()` and reverted on unmount (`ctx.revert()`), and every standalone ScrollTrigger is killed. This is safe under React StrictMode.
- `ScrollTrigger.refresh()` runs once on `window.load` and again when `document.fonts.ready` resolves, so trigger positions stay correct after fonts and images settle.
- All GSAP animation is skipped when `prefers-reduced-motion: reduce` is set (see 5.5).

### 5.2 Scroll and entrance animations (GSAP)

**Hero** (`Hero.tsx`)

| # | Target | Trigger | From to To | Duration / ease |
|---|---|---|---|---|
| 1 | Headline lines (`[data-hero-line]`) | Page load | opacity 0, y 48, blur 14px to rest | 1.3s, `power3.out`, stagger 0.16s |
| 2 | Phone-in-hand image | Page load, 0.25s delay | opacity 0, y 110 to rest | 1.5s, `power3.out` |
| 3 | Sticky headline block | Scroll (scrub), `top top` to `+=85%` of viewport height | opacity 1 to 0, scale 1 to 0.93, yPercent 0 to -6 | `none` (linear, tied to scroll) |
| 4 | Supporting copy and buttons (`[data-hero-copy]`) | When they reach 92% of the viewport, once | opacity 0, y 32 to rest | 1s, `power3.out`, stagger 0.12s |

Effect: the headline enters with a blur-in, the phone rises into place, and as you scroll the phone slides up over the headline while the headline softens away.

**Reusable reveal** (`hooks/useReveal.ts`): the standard "fade and rise" used by most sections.
- Default: opacity 0 and y 36 to rest, 1s, `power3.out`, stagger 0.12s, `scrollTrigger: { start: 'top 88%', once: true }`.
- Optional per-use `y`, `delay`, `blur`, `duration`, or a `children` selector to stagger child elements.
- Cleans up with `clearProps: 'opacity,transform,filter'`.

| Section | Target | y | Blur | Duration |
|---|---|---|---|---|
| Features | Title | 40 | none | 1s |
| Features | Three cards (staggered) | 60 | none | 1.1s |
| Benefits | Header block | 36 | none | 1s |
| Benefits | Slider track | 50 | 10px | 1.2s |
| Premium | Copy children (staggered) | 36 | none | 1s |
| Premium | Artwork | 60 | none | 1.3s |
| FAQ | Heading | 30 | none | 1s |
| FAQ | Accordion rows (staggered) | 34 | 8px | 0.9s |
| Contact | Children (staggered) | 30 | none | 1s |
| Final CTA | Eyebrow/headline | 30 | none | 1s |
| Final CTA | Panel | 60 | none | 1.2s |

**Pinned showcase** (`ShowcasePinned.tsx`)
- *Pin:* pure CSS `position: sticky`, not a GSAP pin. It releases naturally when the section ends and cannot trap the visitor.
- *Phone entrance:* the phone wrapper tweens from y 140 and opacity 0, 1.2s `power3.out`, when the section reaches 70% of the viewport (once).
- *Active statement:* one ScrollTrigger per statement (`start: 'top 62%'`, `end: 'bottom 62%'`). When a statement crosses that line it becomes active and React state updates the highlighted text and the phone screen.
- *Screen change:* cross-fade, see 5.3.

### 5.3 CSS transitions

| Element | Property | Duration / ease | Behaviour |
|---|---|---|---|
| Nav bar | background, shadow, backdrop blur | 500ms | Turns from a faint glass to a darker blurred bar after 24px of scroll |
| Nav links | colour | 300ms | Fade to white on hover/active |
| Buttons | background, transform | 300ms | Hover dims to 85% white; press scales to 0.97 |
| Form submit | transform, opacity | default | Hover scale 1.05, press scale 0.95, 60% opacity while busy |
| Phone screens | opacity | 700ms `ease-out` | Cross-fade between stacked screenshots; each image also sits at `scale(1.015)` to hide edge artefacts |
| Showcase statement | colour (white to 35% white) | 700ms | Active statement is bright, others dim |
| Showcase icon | opacity (100% / 40%) | 700ms | Follows the active statement |
| FAQ row | background | 300ms | Slight lift on hover |
| FAQ plus icon | rotate to 135deg | 500ms `ease-out` | Plus turns into a cross when open |
| FAQ answer | `grid-template-rows` 0fr to 1fr, plus opacity | 500ms `ease-out` | Smooth expand/collapse with no JS height measuring |
| Form wrapper | border / background | default | Highlights when the field is focused |
| Slider arrows | transform | default | Hover scale 1.05 |
| Slider track | `scroll-behavior: smooth` | native | Arrow click or keyboard Left/Right scrolls one card |

### 5.4 Ambient keyframes (the only continuous animations)

Defined as `@keyframes` in `src/index.css`. Transform-only, slow, and disabled by reduced motion.

| Name | Used by | Definition |
|---|---|---|
| `orbit` | Inner ring of category chips in the Zeno AI card | `rotate(360deg)`, 60s, linear, infinite |
| `orbit-rev` | Outer ring of chips | `rotate(360deg)`, 80s, linear, infinite, reversed |
| `float` | Mascot, glass orb, glass bolt in Premium | `translateY(0)` to `-14px` and back, 7s, ease-in-out, infinite. Orb and bolt use negative `animation-delay` (-3s, -1.5s) so they drift out of sync |
| `animate-spin` | Submit button spinner | Tailwind default |

Chips in the orbit counter-rotate their own transform so the icons stay upright while the ring turns.

### 5.5 Reduced motion and fallbacks
- `useReveal`, the hero tweens and the showcase entrance all return early when `prefers-reduced-motion: reduce` matches, so content simply appears.
- A global CSS rule shortens all animations and transitions to 0.001ms and sets `scroll-behavior: auto`.
- The showcase's active-statement logic still runs (it only swaps content, with no motion).
- If GSAP fails to load, nothing is left hidden because initial states are set by the tweens themselves.

### 5.6 Interaction details
- **Anchor navigation:** native smooth scrolling (`scroll-behavior: smooth`) with a 96px offset.
- **Nav highlighting:** an `IntersectionObserver` with `rootMargin: -35% 0px -55% 0px` marks the section in the middle band of the viewport.
- **Form feedback states:** idle, submitting (spinner), success, "already registered", and error. The result region uses `role="status"` / `role="alert"`.
- **Carousel keyboard support:** the track is focusable; Left/Right arrows move one slide.

---

## 6. Responsive behaviour

| Breakpoint | Changes |
|---|---|
| < 768px | Hamburger nav; hero image fills width; feature cards stack to one column (budget card gets extra top gap for the fanned screens); showcase becomes a stacked list with an inline phone per statement; slider arrows move below the track; CTA phone sits under the form |
| 768 to 1023px | Desktop nav; two-column layouts appear where specified; feature cards still stacked |
| >= 1024px (`lg`) | Three-column feature grid, sticky showcase phone, two-column premium, side-by-side footer |

Headline sizes use `clamp()` so they scale smoothly rather than jumping. Horizontal overflow is clipped on `html` and the showcase section; the page width equals the viewport width at 390px.

---

## 7. Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1`, ordered `h2`/`h3`.
- Skip link ("Skip to content") revealed on focus.
- Visible focus ring: 2px violet-soft outline with 3px offset on every focusable element.
- Accordion buttons expose `aria-expanded` / `aria-controls`; panels use `role="region"` and `aria-labelledby`.
- Carousel uses `aria-roledescription` and per-slide labels; arrows have text labels.
- Form: visible labels or `sr-only` labels, `aria-invalid`, `aria-describedby`, honeypot hidden with `aria-hidden` and `tabIndex=-1`, explicit consent checkbox.
- Decorative graphics are `aria-hidden`; product screenshots carry descriptive alt text.
- Text contrast: headings are white on near-black; the dimmest informational text is 55 to 60% white. Inactive showcase statements (35% white) are intentionally de-emphasised and are not the only way to read that content.

---

## 8. Assets

| File | Source | Use |
|---|---|---|
| `img/hand-home.webp` | Supplied Zeno hand-held render (transparent background) | Hero |
| `img/hand-budget.webp` | Supplied Zeno hand-held render (transparent background) | Final CTA |
| `img/mascot.webp` | Supplied Zeno mascot (transparent) | Logo, AI card, slider, Premium |
| `img/screen-home.webp` | Cropped from the supplied home screenshot | Phone frame |
| `img/screen-ai.webp` | Cropped from the supplied Zeno AI screenshot | Phone frame |
| `img/screen-budget.webp` | Perspective-corrected from the supplied tilted budget render | Phone frame |

All images carry explicit `width`/`height` to prevent layout shift. The hero image is `fetchpriority="high"` and preloaded; everything below the fold is `loading="lazy"`.

---

## 9. Waitlist (design-relevant summary)

The form posts to a Supabase Edge Function (`supabase/functions/waitlist-signup`). It captures email, consent, UTM parameters, content id and an optional research answer. Success is shown only when the backend confirms. Table security, rate limiting and deployment steps are in `README.md` and `supabase/migrations/`.

---

## 10. Known differences from the reference

- The reference's dark in-app phone UI and 3D glass objects are not reused; Zeno uses its own light app screens and an original CSS glass orb/bolt.
- The reference's hero phone is a different render; Zeno uses the supplied hand-held render, whose phone appears slightly smaller relative to the headline.
- Footer social, legal and contact links stay inactive until real URLs are configured in `.env`.
- Fonts match closely but are not guaranteed identical to the reference's typeface.
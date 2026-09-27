# Theta Tau site — scale.com-style revamp brief

> Goal: kill the "too vibecoded" feel and make the site read as crafted/premium,
> modeled on the motion + restraint of https://scale.com. Prototype lives at
> `/prototype` (isolated from the live pages).

## 1. Stack (keep — not the problem)

- **Astro 6** (static), **React 19** islands, **Tailwind v4** (CSS-first), **TypeScript** strict.
- Installed: **framer-motion 12**, lucide-react, clsx, tailwind-merge. Added for the revamp: **lenis** (smooth scroll).
- One ~6,000-line `global.css` + scoped styles. 12 React islands, 8 pages. Deploy: Vercel (`thetatauuci.com`).

## 2. Pages & home structure

- **Pages:** home, about, brothers, events, recruitment, styleguide, 404 (projects hidden).
- **Home order:** ScrollExpandHero (video) → stats band → "Why" → employers marquee → Pillars (Doric columns) → testimonials scroller → "Explore" bento → rush CTA.

## 3. Current design system

- **Type:** Fraunces (serif display, `--font-display`) + Plus Jakarta Sans (`--font-sans`).
- **Color:** maroon `#7C0303`, gold `#D4B56A`, cream `#FCF7EC`, dark-maroon backgrounds.
- **Vibe:** collegiate "yearbook editorial" with heavy ornament — Doric columns, crest, torn-paper dividers, wax stamps, rotating words.

## 4. Motion inventory (today)

IntersectionObserver **fade-up reveals**, hero **video scroll-expand**, **page-transition curtain**, testimonials auto-scroll, RotatingWord, NumberTicker, MagneticButton, GlowCard. **No smooth scroll** (native).

## 5. Why it reads "too vibecoded" (the real problem)

Not too few effects — too many unrelated ones:

1. **Kitchen-sink of effects** with no unifying system — every section has a different gimmick. Scattershot decoration is the #1 tell of AI-generated sites.
2. **Generic `fade-up-on-scroll` reveals** — the most templated animation on the web.
3. **Busy palette + ornament** competing for attention.
4. **Placeholder/empty imagery** in spots.
5. **Native scroll** feels default.

## 6. What scale.com actually does (dissected)

- **Lenis smooth-scroll** — weighty, fluid inertia.
- **Framer Motion scroll-_linked_ transforms** — elements translate / scale / fade **continuously tied to scroll position** (vertical rise + horizontal drift), all sharing **one easing physics**. ~1,000 transformed els, ~84 GPU-promoted. Not on/off IntersectionObserver toggles.
- **Pinned / sticky story moments**, a **WebGL canvas hero**, real **video**.
- **Ruthless restraint:** near white/black, **one** clean grotesque (Aeonik) at huge sizes, tight tracking, enormous whitespace, color used sparingly. ~10,000px long-scroll narrative, one idea at a time.
- **Real, confident content** — no placeholders.

## 7. The delta → what to change

| Lever | Now | Toward scale |
|---|---|---|
| Scroll feel | native | **Lenis smooth-scroll** |
| Motion | on/off fade-ups, one-off gimmicks | **one scroll-linked motion system** (Framer `useScroll`/`useTransform`), shared easing |
| Restraint | many ornaments | **remove most ornament**; 1–2 signature motions done flawlessly |
| Type | serif + sans + gold | fewer weights, **bigger sizes, more whitespace**, tighter tracking |
| Color | maroon/gold/cream busy | **stark base + one disciplined accent** |
| Content | placeholders | real photos/video, confident copy |

**Engineering note:** the fastest cure for "vibecoded" is **subtraction + one coherent motion system**, not more effects. Strip back first; bolting scale's motion onto the current busy base would look _more_ vibecoded, not less.

## 8. Prompt scaffold

> You are redesigning an existing **Astro 6 + React 19 + Tailwind v4** site (UC Irvine engineering fraternity, Theta Tau Pi Delta). Keep the stack; **framer-motion is installed** — add **Lenis** for smooth scroll.
> **Goal:** crafted/premium like scale.com — restrained, editorial, motion-driven — and remove the AI-template feel.
> **Design:** (a) **Restraint first** — strip ornament (Doric columns, torn dividers, wax stamps, glow/magnetic gimmicks); keep at most one signature motif. (b) **Typography-led** — large type, generous whitespace, tight tracking, few weights. (c) **Palette:** stark near-white/near-black base + **one** disciplined accent (maroon `#7C0303` or gold `#D4B56A`).
> **Motion (core):** global **Lenis smooth scroll**, then a **single scroll-linked motion language** with Framer `useScroll`/`useTransform` — elements rise, scale, drift horizontally _continuously with scroll_, all sharing one spring; add 2–3 **pinned/sticky story sections**. No on/off fade-ups. Respect `prefers-reduced-motion`.
> **Keep working:** brothers roster/explorer + detail cards (Spotify, socials), real content, recruitment form, hidden projects tab.
> **Deliver** section-by-section, home first. GPU transforms only; no layout thrash on scroll.

## 9. Prototype status

- [x] `/prototype` page: Lenis smooth scroll + one Framer Motion scroll-linked system (Rise / Parallax / horizontal PinnedRow), restrained near-black palette, big type.
- [ ] Roll the motion system into real home sections once the direction is approved.
- [ ] Typography + palette decisions (keep Fraunces vs. switch to a grotesque).

# AgenticZillow Design System

A near-exact visual clone of **Zillow.com** — light theme, Zillow blue, the same sticky header, property cards, split map+list search and dense legal footer — with a tasteful **agentic AI layer** layered on top. The guiding principle is **"Zillow at rest, AgenticZillow in motion"**: the product reads as real Zillow until the user types intent, attaches a photo, or opens the copilot, at which point the same surfaces come alive with a streaming multi-agent experience.

> **Demo disclaimer:** AgenticZillow is a portfolio/demo clone for showcase purposes — not affiliated with Zillow Group. All listings and data are synthetic.

## Sources
- **Codebase / spec:** `AgenticZillow/docs/agenticzillow-design-prompt.md` (mounted locally, read-only). The authoritative design + engineering spec — every color, type ramp, spacing value, component and screen in this system is derived from it. There is no shipping React codebase yet; this design system was built from that spec.
- **Reference product:** https://www.zillow.com/ (visual North Star — not copied; AgenticZillow uses its own name, logo and synthetic data).
- **Stack (per spec):** Next.js + TypeScript + Tailwind, Postgres + pgvector, Mapbox GL; cost-aware multi-provider LLM router.

---

## CONTENT FUNDAMENTALS

How AgenticZillow writes copy.

- **Voice:** plain, confident, real-estate-practical for the Zillow layer; a warm, concise **concierge** voice for the agent layer. Never hypey, never jargon-heavy.
- **Person:** addresses the user as **"you" / "your"** ("Your saved homes", "What can *you* afford?", "homes for *you*"). The agent speaks in first person, briefly: **"On it." · "Want me to…?" · "Here's what I found."**
- **Casing:** Sentence case for almost everything — buttons ("Request a tour", "Save search"), headings ("Homes for you"), nav. **UPPERCASE only** for eyebrows/labels (letter-spacing 0.04em, e.g. "RECOMMENDED FOR YOU", "FROM YOUR AGENT"). Title Case is avoided.
- **Tone examples:**
  - Hero: *"Agents. Tours. Loans. Homes."* / sub *"Find it. Tour it. Own it — with a little help."*
  - Tile body: *"Find your place with an immersive photo experience and the most listings…"*
  - Agent restating intent: *"Looking for a cozy craftsman under $700k near good coffee in Austin — on it."*
  - Reassurance microcopy: *"It's free, with no obligation."*
  - Honest demo framing on simulated actions: badge **"Simulated for demo."**
- **Numbers:** always tabular figures. Prices abbreviated on pins ("$625K"), full on cards ("$625,000"), rent as "$2,400/mo". Meta line uses `bds | ba | sqft - Type`.
- **Emoji:** used **sparingly and purposefully** — the ✦ sparkle is the AI signature; agent-name tags in the timeline use one leading glyph each (🧭 Orchestrator, 🔎 Search, 📈 Market, 💰 Finance, 📅 Concierge); suggestion chips may lead with a single emoji (🏡 💰 🖼️). Never decorative emoji in the core Zillow UI.
- **Status is always worded, never color-only** ("For Sale", "Pending", "Coming Soon") for accessibility.

---

## VISUAL FOUNDATIONS

- **Color vibe:** bright, clean, optimistic. White everywhere; one decisive **Zillow Blue `#006AFF`** for all primary action, links, selected states and map pins. A cool near-black `#2A2A33` for text. Status greens/ambers/magentas appear only as small dots/badges. The **blue→violet gradient (`#006AFF → #5B3FD9`) is reserved for exactly one thing** — the branded "✦ Ask AgenticZillow" pill/FAB and subtle agent surfaces. Used anywhere else it stops looking like Zillow.
- **Type:** Inter (humanist geometric sans) at every level. Bold (700) headings, 600 for card titles/labels, 400 body. Prices are the loudest element on a card: 22/700 tabular. Tabular + lining numerals on all prices and stats.
- **Spacing:** strict 4px base (4 → 96). Card padding 16; section gutters 24–32; content rail max-width **1280px** with 24px side padding; the search map goes full-bleed. Card grids gap 16–20.
- **Backgrounds:** predominantly flat white. Subtle bands in `#F1F1F4` / faint blue wash `#F0F6FF` alternate marketing sections. **One full-bleed dusk-home hero photo** with a top-down dark scrim for legible white text. Photos carry a bottom legibility gradient. No textures, no patterns, no decorative gradients beyond the single agentic accent.
- **Imagery vibe:** warm, aspirational real-estate photography (golden-hour exteriors, bright interiors). Full-color, never b&w or heavily filtered.
- **Corner radii:** 8px for buttons/inputs/cards (hero CTAs go full pill), 12px for modals/dropdowns/tiles, full pill for filter chips, price bubbles and avatars. Property-card photos round only the top corners (8px 8px 0 0).
- **Cards:** **border-defined at rest** (`1px solid #E8E8EB`, shadow-sm) and gain shadow-md + a 1–2px lift on hover. Never heavy drop shadows at rest.
- **Shadows:** a tight 4-step ramp — xs (subtle), sm (cards at rest), md (hover/dropdowns), lg (modals/copilot/popovers). Map pins get a dedicated `0 1px 4px rgba(0,0,0,0.30)`.
- **Borders & dividers:** `#D1D1D6` default inputs, `#B8B8C0` hovered, `#E8E8EB` hairlines inside cards/lists.
- **Hover states:** primary blue darkens (`#006AFF → #0055CC`); ghost/secondary fill with a faint blue wash (`#F0F6FF`); icon buttons gain a light-gray circle; cards lift 1–2px; filter pills animate to the blue applied state; map pins scale to 1.08 and raise z-index.
- **Press / active:** blue darkens further to `#004BB5`; no aggressive shrink.
- **Focus:** a single consistent ring `0 0 0 3px rgba(0,106,255,0.35)` on every interactive element.
- **Animation:** restrained and quick. Card lifts, pill state changes, popovers fade+scale from their trigger, the hero→agent transform is a ≤300ms eased dim + slide-up, timeline rows animate in sequentially (spinner → check), the FAB pulses once on first load. **All agentic motion respects `prefers-reduced-motion`.** No infinite decorative loops.
- **Transparency/blur:** used lightly — translucent category pills over the hero photo (subtle backdrop blur), the modal/lightbox scrim `rgba(0,0,0,0.55)`. Not a glassmorphism system.
- **Layout / fixed elements:** sticky white header (60px, z-1000, gains shadow on scroll); the search-results map is fixed while the list pane scrolls; the copilot is a fixed right-side dock; the ✦ FAB is fixed bottom-right.

---

## ICONOGRAPHY

- **System:** **Lucide** — outline/line icons, ~1.5–2px stroke, rounded joins, on a 24×24 grid. Icon color follows text; active/selected = Zillow blue. Solid fills only for active states (a saved heart fills magenta `#D6005C`). Lucide is available from CDN (`https://unpkg.com/lucide-static` or the React package) — components in this system draw the handful they need as inline SVG matching the Lucide weight, so no icon dependency is required to render a card.
- **Common icons:** magnifier, heart, map-pin, camera, bed, bath, ruler, share, sliders, chevrons, ✕, 3D-cube, calendar, home, user.
- **AI signature:** the **✦ sparkle** (Unicode `✦`) marks every agentic surface — the Ask pill/FAB, suggested-prompt chips, inline deal chips, "✦ Explain" affordances.
- **Emoji as iconography:** only the agent-name glyphs in the Live Activity Timeline (🧭🔎📈💰📅) and the occasional leading emoji on suggestion chips. Not used in the core Zillow UI.
- **Logo / brand glyph:** `assets/logo-mark.svg` — a solid Zillow-blue rounded house with a door cut-out (an original generic mark, not Zillow's trademark), locked up with the **AgenticZillow** wordmark in blue (`aria-label="AgenticZillow home"`).

> **Note:** since no production codebase shipped, no icon font or SVG sprite was available to copy; Lucide is the spec-mandated set and is used as the substitution. Swap in your real icon assets if/when they exist.

---

## Index / manifest

**Root**
- `styles.css` — global entry point (consumers link this). `@import`s only.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css` (radius + shadow), `fonts.css` (Inter via Google Fonts), `base.css` (resets).
- `assets/` — `logo-mark.svg`.
- `SKILL.md` — Agent-Skills wrapper for use in Claude Code.

**Components** (`window.AgenticZillowDesignSystem_f8327a`)
- `components/buttons/` — **Button**, **IconButton**
- `components/forms/` — **Input**, **Select**, **Checkbox**, **FilterPill**
- `components/feedback/` — **StatusTag**, **Badge**, **Toast**
- `components/property/` — **PropertyCard**, **PriceBubble**
- `components/agentic/` — **AskPill**, **AgentTimelineRow**

**Foundation cards** (`guidelines/`) — Colors (brand, gray, semantic, surfaces), Type (headings, body, price), Spacing (scale, radius, shadow), Brand (logo). Rendered in the Design System tab.

**UI kits**
- `ui_kits/website/` — Home (`index.html`) and Search Results (`search.html`). See its `README.md`.

The Design System tab renders every `@dsCard`-tagged HTML. Component bundle, manifest and adherence config are generated automatically — do not hand-edit `_ds_*`.

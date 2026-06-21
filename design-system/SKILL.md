---
name: agenticzillow-design
description: Use this skill to generate well-branded interfaces and assets for AgenticZillow (a Zillow-faithful real-estate product with an agentic AI layer), either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Principle:** "Zillow at rest, AgenticZillow in motion." Looks exactly like Zillow until an AI surface is opened. Keep AI surfaces reversible and dismissible; never repaint the page.
- **Primary color:** Zillow Blue `#006AFF` (hover `#0055CC`, active `#004BB5`). Text `#2A2A33`. The blue→violet gradient (`#006AFF → #5B3FD9`) is reserved ONLY for the branded ✦ "Ask AgenticZillow" pill/FAB.
- **Font:** Inter. Tabular numerals on all prices/stats. Prices are the loudest element on a card (22/700).
- **Radii:** 8px controls/cards, 12px modals, full pill for chips/bubbles. Cards are border-defined at rest, lift on hover.
- **Foundations & components:** `tokens/`, `components/`, `guidelines/`. Full screens: `ui_kits/website/`.
- **AI signature:** the ✦ sparkle; concierge voice ("On it.", "Want me to…?"). Status is always worded, never color-only.

# AgenticZillow — Website UI Kit

High-fidelity recreations of the core AgenticZillow web surfaces. "Zillow at rest, AgenticZillow in motion": every screen reads as real Zillow until an AI surface is opened.

## Screens
- **`index.html`** — Home / Landing. Sticky 3-zone header, full-bleed hero with the rounded search pill, the "From your agent" proactive strip, Buy/Rent/Sell tiles, "Homes for you" card grid, the home-value feature band, the blue conversion band, and the dense footer. Click the floating ✦ launcher (bottom-right) to open the page-aware **Copilot** dock (chat + Live Activity Timeline).
- **`search.html`** — Search Results. The signature map + list split: sticky filter bar (FilterPills + Save search + ✦ Ask AI), a Zillow-styled low-saturation basemap with synced price-bubble pins (default / viewed / saved / shortlisted), the results header with Sort, removable filter chips (incl. "Applied by AI"), and a 2-column PropertyCard grid.

## Composition
Screens compose the design-system components from the bundle namespace
`window.AgenticZillowDesignSystem_f8327a` — `Button`, `Input`, `Select`, `FilterPill`,
`PropertyCard`, `PriceBubble`, `StatusTag`, `Badge`, `AskPill`, `AgentTimelineRow`.
Shared chrome lives in `Header.jsx`, `Footer.jsx`, `Copilot.jsx`; each screen has its
own `*Screen.jsx`. Files assign their components to `window` so sibling
`<script type="text/babel">` blocks can read them.

## Notes / cut corners
- Imagery is from Unsplash (synthetic listings). The map is a faux static basemap, not Mapbox.
- Interactivity is cosmetic: the copilot opens/closes and switches tabs; filters/sort are visual.
- Not built: Listing Detail, Saved, Agent/Lender directory, Mortgage tools, Rentals, Sell, Compare — these are specified in the root design doc and can be added as further screens.

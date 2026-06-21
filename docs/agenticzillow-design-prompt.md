# AgenticZillow — Design & Build Prompt

> A near-exact visual clone of [Zillow](https://www.zillow.com) called **AgenticZillow**, supercharged with a multi-agent AI layer. This document is the single source of truth for designing and building the project.
>
> **How to use this doc:** Paste **Part A** into Claude's design tool to generate the UI. Use **Part B** as the engineering spec to build the app.

---

## Locked decisions (summary)

| Area | Decision |
| --- | --- |
| Product | "AgenticZillow" — near-exact Zillow clone + agentic AI layer; portfolio/demo showcase; looks exactly like real Zillow (light theme, Zillow blue). |
| Stack | Next.js (App Router) + TypeScript + Tailwind; Postgres + pgvector; Mapbox GL; deploy on Vercel + hosted Postgres (Neon/Supabase). |
| Data | Synthetic listings across a few US metros; photos from Unsplash/Pexels; hybrid filter + pgvector semantic search. |
| Listing types | Buy, Rent, Sell (list-your-home), Off-market/investment. |
| Features | Map search + filters, AI valuation (Zestimate-style) + rent estimate, saved homes/collections, saved searches + alerts, mortgage/affordability tools, agent & lender directory, neighborhood/schools/commute, compare homes. |
| Auth | Guest-first (browse + use agent, optional sign-in to persist) + one all-access demo super-user. |
| Agents | Multi-agent orchestrator routing to specialists (Search, Market/Investment, Finance/Mortgage, Tour/Transaction Concierge + more); fully autonomous mode; live activity timeline. |
| Agent UX | Persistent page-aware chat copilot, conversational NL search bar, inline listing AI, proactive agent feed. |
| Inputs | Text (core) + image upload (vibe search) + document upload (pre-approval/inspection); voice as stretch. |
| Actions | Simulated (demo): "book" tours, "draft/submit" offers. |
| LLM | Cost-aware multi-provider router: Groq/DeepSeek/Gemini first, OpenAI next, **Anthropic LAST** (premium fallback). Gemini for vision. |
| Scope | Everything in v1; phased build order provided. |

---

# Part A — Visual & UX Design Prompt (paste this into Claude's design tool)

Build **AgenticZillow** — a near-exact visual clone of Zillow.com (light theme, Zillow blue, same layout, same components, every major screen) with a powerful **agentic AI layer** layered on top. At first glance, and whenever every AI surface is dismissed, the product must read as **real Zillow**: white background, Zillow-blue accents, the same sticky header, the same property cards, the same split map+list search, the same dense legal footer. The keyword is *"Zillow at rest, AgenticZillow in motion"* — the page looks exactly like Zillow until the user types intent, attaches a photo, or opens the copilot, at which point the same surfaces come alive with a streaming multi-agent experience. Keep the **AgenticZillow** name in the logo (Zillow's rounded-house glyph + the word "AgenticZillow" in Zillow blue). Design for desktop-first but fully responsive. Use a clean humanist sans (Inter) as the closest free stand-in for Zillow's brand font.

---

## Design System

### Color palette (use these exact hex values)

**Brand blue (primary)**
- `#006AFF` — Zillow Blue. Primary buttons, active links, selected states, map pins, brand accents.
- `#0055CC` — blue hover/pressed.
- `#004BB5` — blue active (darkest).
- `#1277E1` — bright accent / focus glow base.
- `#E8F0FE` — blue tint (selected filter pill fill, info banners, light hover fills).
- `#F0F6FF` — faint blue wash (row/card hover).
- `#0D1F3C` — deep navy (occasional marketing/dark sections).

**Agentic accent (use sparingly so it still looks like Zillow)**
- Blue→violet gradient `#006AFF → #5B3FD9` — reserved only for the one branded AI entry point (the "✦ Ask AgenticZillow" pill / FAB) and subtle agent surfaces.

**Text grays**
- `#2A2A33` — primary text & headings (near-black, slightly cool).
- `#54545C` — secondary text (beds/baths/sqft meta, captions).
- `#74747C` — tertiary/muted (helper text, days-on-market, placeholders-adjacent).
- `#A7A6AD` — disabled.
- `#FFFFFF` — text on blue.

**Backgrounds & surfaces**
- `#FFFFFF` — page background and cards/modals/dropdowns.
- `#F1F1F4` — subtle section bands, skeleton base.
- `#F7F7F8` — even lighter zebra/hover fill.
- `rgba(0,0,0,0.55)` — modal/lightbox scrim.
- Photo legibility gradient: `linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)`.

**Borders & dividers**
- `#D1D1D6` — default input/card borders.
- `#B8B8C0` — strong border (hovered input).
- `#E8E8EB` — hairline dividers inside cards/lists.
- Focus ring: `0 0 0 3px rgba(0,106,255,0.35)`.

**Semantic / status**
- Success / For Sale / For Rent green: `#008060`; success banner fill `#E6F4EF`.
- Warning / Pending amber: `#FFB100`; warning fill `#FFF4D6`.
- Error / saved-heart / price-cut magenta: `#D6005C`; error fill `#FCE6EE`.
- Coming Soon violet: `#9059FF`.
- Info banners reuse `#006AFF`.

**Status-tag dots on cards:** For Sale = green `#008060` · Pending/Contingent = amber `#FFB100` · Coming Soon = violet `#9059FF` · New = blue `#006AFF` · Sold = gray `#74747C` · 3D Tour/Open House = blue `#006AFF`.

### Typography
- Font: **Inter** (humanist geometric sans), fallbacks Helvetica Neue, Segoe UI, Roboto, Arial. Enable tabular numerals (`tnum`) on all prices and stats.
- Type scale (desktop):
  - Hero H1: 44–48px / 52px, weight 700.
  - Page title H1: 32px / 40px, 700.
  - Section H2: 24px / 32px, 700.
  - Subsection H3: 20px / 28px, 600–700.
  - Card title / H4: 16–18px / 24px, 600.
  - Body large: 16px / 24px, 400.
  - Body base: 14px / 20px, 400 (UI default).
  - Small / caption: 13px / 18px, 400.
  - Micro / legal: 12px / 16px, 400.
  - **Price (card): 22px / 26px, 700, tabular** — the dominant element on a property card.
  - Eyebrow / label: 11–12px / 16px, 600, UPPERCASE, letter-spacing 0.04em.
- Links: `#006AFF`, no underline at rest, **underline on hover**; no distinct visited color. Footer/legal links may underline at rest.

### Spacing, radius, shadows, icons
- **Spacing** (4px base): 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. Card padding 16px; section gutters 24–32px; content rail max-width ~1280px with 24px side padding; map search goes full-bleed; card grid gap 16–20px.
- **Radius:** buttons 8px (hero CTAs may be full pill `9999px`); pills/filter chips full or 20px; inputs/selects 8px; property cards 8px (photo top corners `8px 8px 0 0`); modals/dropdowns 12px; avatars full; map price-bubble full pill.
- **Shadows:**
  - xs `0 1px 2px rgba(0,0,0,0.06)`
  - sm `0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)` (cards at rest)
  - md `0 4px 12px rgba(0,0,0,0.12)` (card hover, dropdowns)
  - lg `0 8px 24px rgba(0,0,0,0.16)` (modals, popovers, copilot, map cards)
  - map pin `0 1px 4px rgba(0,0,0,0.30)`
  - Cards are mostly **border-defined** at rest (`1px solid #E8E8EB`) and gain shadow-md + a 1–2px lift on hover.
- **Icons:** outline/line style, ~1.5–2px stroke, rounded joins, 24×24 grid (Lucide). Solid fills only for active/selected (filled heart when saved). Icon color follows text; active = `#006AFF`; saved heart = filled `#D6005C`. Common icons: magnifier, heart, map-pin, camera, bed, bath, ruler, share, sliders, chevrons, x, 3D-cube, calendar, home, user, sparkle (✦) for AI.

### Core reusable components

**Buttons**
- Primary: fill `#006AFF`, white text 14–16px/600, radius 8px (pill on hero), padding 10×20, hover `#0055CC`. Min height ~40px, focus ring.
- Secondary (outline): white fill, `#006AFF` text, `1px solid #006AFF`, hover fill `#F0F6FF`.
- Tertiary/ghost: transparent, `#006AFF` text, hover faint blue wash.
- Text link button: `#006AFF`, underline on hover.
- Disabled: `#E8E8EB` fill, `#A7A6AD` text.
- Destructive: `#D6005C` fill, white text.
- Icon buttons (save/share/close): 40×40, centered 20–24px icon, transparent, hover light-gray circle.

**Inputs & selects:** height 40–44px, `1px solid #D1D1D6`, radius 8px, padding 0 12px, 14px text, placeholder `#74747C`. Focus: border `#006AFF` + focus ring. Error: border `#D6005C` + helper text in error color. Search input: leading magnifier inset 12px, clearable "✕" when filled. Select trigger: trailing chevron-down opening a shadow-md menu.

**Filter bar (hallmark Zillow control)** — a horizontal row of pill-style filter buttons under the search input on results pages: `For Sale ▾` · `Price ▾` · `Beds & Baths ▾` · `Home Type ▾` · `More ▾`, then a blue **Save search** button at the right. Each pill: white bg, `1px solid #D1D1D6`, radius 8px, 14px text + chevron. **Applied filter:** blue text `#006AFF`, blue border, `#E8F0FE` fill, optional count badge (e.g. `Home Type: 3`). Clicking opens a popover (shadow-lg, radius 12px) with dual-handle sliders (blue), checkbox lists, and a footer with `Reset` (text) + `Apply` (primary blue). **More** opens a full modal, not a popover.

**Property Card (the most important component)** — vertical white card, `1px solid #E8E8EB`, radius 8px, hover → shadow-md + lift. Top→bottom:
- **Photo carousel** (4:3 or 16:9, rounded top 8px): left/right chevrons + dot indicators appear on hover; bottom legibility gradient; lazy-loaded.
- **Status tag** top-left: white pill with colored dot + label, 11–12px/600 (e.g. green "For Sale", blue "New", blue "3D Tour", amber "Pending").
- **Save heart** top-right: 24px outline white-stroked at rest, **filled `#D6005C` when saved**.
- **Photo count** bottom-left: small "1/24" with camera icon.
- **Price:** 22px/700 tabular, `#2A2A33` (rent shows "$2,400/mo").
- **Meta line:** `4 bds | 3 ba | 2,150 sqft - House`, 14px `#54545C`, separated by `|` or `•`.
- **Address:** 14px `#54545C`, 1–2 lines, whole card links to detail.
- **Price cut** (optional): magenta down-arrow + amount + date, 12–13px.
- **Days on market** + **broker attribution line** ("Listing provided by …"), 11–12px `#74747C`.
- **Agentic add-on:** on hover, a subtle **`✦ Is this a good deal?`** chip (blue text/outline) appears without disrupting the Zillow look.

**Pills/tags/badges:** filter pills (above); status tags (above); feature chips (white/`#F1F1F4`, 1px border, full radius, 12–13px, optional leading icon); count badge (small blue circle, white number).

**Toasts:** bottom-center/left, white card, shadow-lg, radius 8px, 12–16px padding, leading status icon, 14px text, optional blue "Undo"/action link, auto-dismiss ~4s. E.g. "Saved to your homes — View".

**Modals:** centered white, radius 12px, shadow-lg, max-width 480–640px, 24px padding, scrim `rgba(0,0,0,0.55)`. Header: title 20px/700 + close ✕. Footer: right-aligned secondary + primary. Photo lightbox = full-screen dark.

---

## Global Layout

### Header / top navigation (sticky, white, full-width)
- Height ~60px, background `#FFFFFF`, bottom border `1px solid #E8E8EB`, `position: sticky; top: 0; z-index: 1000`. Adds shadow-sm once scrolled. Content constrained to ~1280px.
- **3-zone layout.** Canonical left→right order: **Buy · Rent · Sell · Home Loans · Find an Agent · [AgenticZillow LOGO] · Manage Rentals · Advertise · Help · ♥ Saved · Sign In**.
  - Left cluster: text links 14px/500 `#2A2A33`, each with a caret opening a **mega-menu** (large white panel, radius 12px, shadow-lg, 16–24px padding, multi-column link groups). Hover turns text `#006AFF`; caret rotates 180° on open. E.g. *Buy* → "Homes for sale · Foreclosures · For sale by owner · Coming soon · New construction · Recently sold".
  - Center: the **AgenticZillow** wordmark (blue house glyph + word in `#006AFF`), ~26–30px tall, `aria-label="AgenticZillow home"`.
  - Right cluster: secondary links smaller, then a divider, then ♥ Saved (heart + label) and Sign In, **plus the one branded AI doorway**: a pill **`✦ Ask AgenticZillow`** in the blue→violet accent.
- **Mobile:** hamburger (right) opens a full-height slide-over drawer; logo centers; ♥ Saved/Sign-in collapse into the drawer; the "Ask AgenticZillow" item sits prominently at the top of the drawer.

### Conversational search bar (global pattern)
On search-results and detail pages a search input sits in/just below the header: rounded 8px, magnifier left, placeholder **"Address, neighborhood, city, or ZIP"**, with an attached blue search button. For AgenticZillow this same input is **dual-mode** — a small **✦ "Ask" toggle on the left** and a `Search ↔ Ask` switch. In `Search` it does Zillow's structured typeahead; in `Ask` it accepts natural language ("cozy craftsman near coffee shops"). Visually identical to Zillow's input at rest.

### Footer (dense, utilitarian, Zillow-faithful)
- **Footer lead-in band:** "Popular searches" SEO link clusters in a grid (`grid-cols-2 md:grid-cols-4 lg:grid-cols-6`, 13–14px `#54545C`), e.g. *"Austin homes for sale", "Seattle apartments for rent", "Miami real estate", "Denver new construction"*.
- **Footer top:** multi-column link map — About · Research · Careers · Help · Advertise · Fair Housing · Privacy · Terms · Cookie Preferences · Do Not Sell — plus app-store badges and social icons, with a logo + tagline block.
- **Bottom legal strip:** fine print, Equal Housing Opportunity logo, `© 2026 AgenticZillow`, and an honest demo disclaimer: *"AgenticZillow is a portfolio/demo clone for showcase purposes — not affiliated with Zillow Group. Listings and data are synthetic."*
- Responsive: 5–6 columns at lg, 3 at md, accordion-collapsed groups below sm.

---

## Screens

### (1) Home / Landing
- **Header** (above), then a **full-bleed hero** ~520px (min 480–560px) with an aspirational dusk-home background photo and a top-down dark scrim for contrast. Centered, stacked:
  - **H1** in white: **"Agents. Tours. Loans. Homes."** with an optional sub-line *"Find it. Tour it. Own it — with a little help."*
  - **Primary search pill:** large white `rounded-full`, shadow-xl, max-width 640px, left text input placeholder **"Enter an address, neighborhood, city, or ZIP code"**, right blue magnifier button. On focus → expands, shadow deepens, dropdown shows *Recent searches* then live typeahead grouped **Addresses · Neighborhoods · Cities · ZIPs · Schools** (keyboard-navigable, `role="listbox"`).
  - Optional translucent category pills under the bar: `Buy` · `Rent` · `Sell`.
- **Buy/Rent/Sell entry tiles:** three large white cards (`grid md:grid-cols-3 gap-6`, radius 12px, border, shadow-sm, center-aligned), each with a friendly vector illustration (~120px), an H3, 2–3 lines of body, and a blue CTA:
  - *Buy a home* → "Find your place with an immersive photo experience and the most listings…" → **Browse homes**.
  - *Sell a home* → "No matter what path you take to sell your home, we can help you navigate a successful sale." → **See your options**.
  - *Rent a home* → "We're creating a seamless online experience — from shopping to applying to paying rent." → **Find rentals**.
  - Whole card hover-elevates and is clickable.
- **Recommendation carousels:** horizontally-scrollable rows with left-aligned H2 + "See all →": *"Recently viewed homes"* (only if history), *"Homes for you"* (default), optional *"Recently sold near you"*. Cards = the reusable Property Card; `snap-x`, min card width 260–300px, chevrons on lg, free-scroll with peek on touch.
- **Feature/explore bands** (alternating image-left/right, `py-16`, backgrounds white ↔ `#F0F6FF`):
  - *"How much is your home worth?"* with inline **address input + Get estimate** → AI valuation page.
  - *"Find a local agent"* → **Connect with an agent**.
  - *"Finance your home with confidence"* → **Calculate your payment** + **Get pre-qualified**.
  - Optional *"Renting made simple"* → **Search rentals**.
- **Pre-footer conversion band:** full-width blue `#006AFF` band, white H2 **"Ready to find your next home?"**, white button **Start your search**, optional ghost-white **Talk to AgenticZillow**.
- **States:** logged-out guests see default "Homes for you"; carousels hide if empty; hero degrades to ~380px on mobile with `rounded-2xl` full-width search and the search button stacked below.

### (2) Search Results (map + list split)
- Below the header, a **sticky filter bar** (above): location/NL search box (shows current query e.g. `Austin, TX`) · `For Sale ▾` · `Price ▾` · `Beds & Baths ▾` · `Home Type ▾` · `More ▾` · `Save search` · `✦ Ask AI`.
  - **For Sale/Rent/Sold** dropdown: For Sale sub-options *By Agent · By Owner (FSBO) · New Construction · Coming Soon · Foreclosures · Auctions · Off-market/Investment*; Rent shows apartments/houses, income-restricted, applies-online; Sold shows a 6/12/24/36-month window.
  - **Price** dropdown: dual min/max inputs + presets with a **price-distribution histogram** above; rent switches to monthly; a "Use monthly payment" toggle ties to the affordability calc.
  - **Beds & Baths:** segmented `Any · 1+ · 2+ · 3+ · 4+ · 5+` for beds, `Any · 1+ · 1.5+ · 2+ · 3+ · 4+` for baths, optional "Use exact match".
  - **Home Type:** multi-select checkboxes — Houses, Townhomes, Multi-family, Condos/Co-ops, Lots/Land, Apartments, Manufactured, with Select all.
  - **More filters modal** sections: Square footage (min/max), Lot size, Year built, Beds exact, Amenities (garage, pool, waterfront, A/C, basement, fireplace, accessibility), Listing details (days on Zillow, keywords, has 3D tour, has open house), Tours, Parking, Schools (rating ≥ N, district, type), 55+/senior, View (city/mountain/park/water), **Commute** (destination + max minutes by car/transit/bike/walk), Days on market. Footer: live **"See N homes"** + **Reset all filters**. A `✦ Describe what you want` NL field at the top pre-fills the controls below.
- **Layout:** map pane left ~55–60%, list pane right ~40–45% with its own scrollbar; thin draggable divider (snap 50/50 and default 58/42; double-click toggles map-only ↔ list-only). View modes via a segmented control: **Split** (default) · **List only** · **Map only**.
- **List pane:** results header with H1 **"Austin, TX Real Estate & Homes for Sale"**, subhead **"1,284 results"**, **Sort ▾** (Homes for You, Price High→Low / Low→High, Newest, Beds, Baths, Sqft, Lot, Price/sqft, plus AI sorts **"AI: Best match for me"** / **"AI: Best deal"**). Below: removable applied-filter chips, then a **2-column Property Card grid**, then a numbered pager `< 1 2 3 … 20 >` (~40 cards/page). Interleave special cards: **Get pre-qualified** lender card, **Save this search** card, and a **proactive agent insight card**.
- **Map (Mapbox, Zillow-styled):** light low-saturation basemap (land ~`#F4F4F6`, water ~`#DCE6EF`). **Price-bubble pins** — rounded pill with a downward tail, `$625K` in 12–13px/700 tabular; unviewed = blue fill or white pill with blue text, **viewed = dimmed gray** `#74747C`, **saved = heart/accent**; hover/active scales to 1.08, raises z-index, gains shadow. **Clusters** at far zoom = solid blue `#006AFF` circles with white count (e.g. "1,240"). Controls: **✎ Draw** (lasso → translucent blue fill `rgba(0,106,255,0.12)` + dashed `#006AFF` border + "Remove boundary" chip), **Search as I move the map** toggle top-left (off → floating "Search this area" button after pan), satellite/map toggle, zoom ± and geolocate bottom-right, layer pills (schools, transit, climate) top-right.
- **Sync contract:** hovering a card enlarges its pin and vice-versa (shared `hoveredListingId`); clicking a card previews/opens; clicking a pin scrolls the list to and highlights that card; pin hover shows a mini-card popover (photo + price + beds/baths). URL encodes query/filters/bounds/sort/page for deep links.
- **Responsive:** desktop true split (2-col grid); tablet split with 1-col list or Map/List tabs; mobile = mutually-exclusive full-screen **Map** and **List** with a sticky toggle pill, copilot becomes a bottom sheet.

### (3) Listing Detail (property page)
- **Breadcrumb strip:** `Texas › Travis County › Austin › 78701 › 1234 Pearl St`. Optional dismissible agentic context bar: *"AI Copilot is now focused on this home — ask me anything about 1234 Pearl St."*
- **Hero photo mosaic** (rounded 12px, `grid-cols-4 grid-rows-2 gap-2 h-[460px]`): primary photo `col-span-2 row-span-2` + four secondary cells. Overlays: top-left status + "12 days on Zillow" + 3D Tour/Video badges; top-right Save / Share / Hide chips; bottom-right **"See all 38 photos"**; bottom-left agentic chips **"✦ Find similar by photo"** and **"✦ Is this a good deal?"**. Clicking opens a **full-screen lightbox** (dark, focus-trapped, ←/→/Esc) with a main stage + counter "8/38", a thumbnail filmstrip (active outlined blue), left tabs **All · Photos · Floor plans · Street View · Map**, and an **"Analyze these photos"** AI button.
- **Two-column content below gallery** (max-width 1280px): left main column scrolls; right rail is a **sticky summary card** (`sticky top-[76px]`).
  - **Sticky summary card:** big bold price 32px (rent shows "$3,200/mo"), price-drop ↓ chip if applicable; stat row **3 bd · 2 ba · 1,840 sqft** with tiny labels; address block; status line; primary **Request a tour** + secondary **Contact agent**; a **Save · Share · Hide** trio; an "Est. $4,180/mo → see breakdown" teaser; and a subtle agentic strip **"✦ Ask AI about this home"** with quick chips *Is this a good deal? · Analyze this deal · Neighborhood · My commute*.
  - **Request-a-tour / contact panel** (tabs Tour | Contact agent): Tour shows In-person/Video toggle, a next-7-days date carousel (selected filled blue), time-slot chips, **Request this time**, microcopy "It's free, with no obligation."; Contact shows prefilled name/phone/email, a templated message, a listing-agent card (avatar, brokerage, rating, "Licensed in TX"), and Send/Call/Text.
  - **Main column modules (in order):**
    1. **Zestimate® card:** big estimate **$682,300** + delta vs list, a horizontal range bar **$651K–$716K**, a **Rent Zestimate** sub-block "$3,450/mo", a 1/5/10-year value history line chart, and a **"Why this estimate?"** AI explainer.
    2. **Overview/description:** "What's special" chips ("Quartz counters", "EV charger", "Walkable", "Renovated 2021"), description with Show more, quick-facts key/value grid, plus a **"Summarize this listing"** chip.
    3. **Facts & features accordion** (two-column groups, each `<details>`): Interior, Property/Parking, Construction, Utilities/Green, Community, HOA & Financial, Lot, Other/Source — each with a tiny **"✦ Explain"** affordance.
    4. **Price history** + **Tax history** tables (color-coded change cells, collapsible) with **"Explain this history"**.
    5. **Monthly payment calculator:** big **$4,180/mo** with a donut breakdown (principal & interest, taxes, insurance, HOA, PMI), inputs (home price, down payment % + $, term, rate, ZIP, credit band, include-HOA), legend, **Get pre-qualified** CTA, and an **"Analyze my affordability"** AI button.
    6. **Schools:** rating badges (1–10 colored), name/type/grades/distance, public/charter/private tabs, **"Summarize school quality"**.
    7. **Neighborhood / Walk Score:** Walk/Transit/Bike circular gauges, nearby-places mini-lists (restaurants, coffee, groceries, parks with walking minutes), neighborhood profile, **"Summarize the neighborhood"** + **"What's my commute?"**.
    8. **Climate / risk:** Flood, Fire, Wind, Heat, Air-quality cards (1–10 + 30-year mini-chart) with **"What do these risks mean for me?"**.
    9. **Map snippet:** mini Mapbox (h-320px, rounded) with a custom marker, layer chips, "Explore the area" button.
    10. **Similar homes carousel** of Property Cards with a leading **"✦ Find similar by photo"** card and **"Why these?"**.
    11. Nearby cities/neighborhoods/ZIPs SEO grids, Recently viewed row, attribution/disclaimer.
- **Mobile:** single column; contact panel becomes a fixed bottom action bar (Request a tour / Contact agent); summary floats under the gallery.

### (4) Saved Homes & Saved Searches
- **Header band:** H1 "Your saved homes", segmented tabs `Saved Homes | Saved Searches`, a Collections dropdown ("All saved homes ▾"), and a Sort ("Recently saved").
- **Saved Homes tab:** two-pane split — left a responsive saved-card grid (3-up desktop, 1-up mobile, each with filled heart, status pill incl. "Price cut ↓ $10k", and a `⋯` overflow menu: Move to collection, Add note, Remove, Share, **Ask agent about this**); right a sticky Mapbox map with synced pins (collapsible for full-width grid). Inline per-card note field + chip tags. **Collections rail:** named buckets ("Dream homes", "Austin investments", "Compare shortlist") with cover thumbnail + count and "+ New collection".
- **Saved Searches tab:** list rows showing the query summary ("Austin · $400k–$600k · 3+ bd · House"), match count, an **alert-frequency selector** (Instant / Daily / Weekly / Off), email + push toggles, last-run timestamp, a "New (3)" badge, and Edit/Delete.
- **Empty state:** illustration + "Start saving homes you love" + a search CTA. Guests see a soft "Sign in to save across devices" banner but saves still work locally.

### (5) Find an Agent / Agent Profile / Lender Directory
- **Agent directory:** hero band "Find a local real estate agent" with location input + filters (Buyer's/Seller's agent, specialty, language, price range); results = agent cards on the left, optional service-area map on the right. **Agent card:** headshot, name, brokerage, star rating + review count, "Sales last 12 mo", price range, areas served, badges ("Premier Agent", "Top 1%"), Contact / View profile. Filter chips + sort ("Most sales", "Highest rated").
- **Agent profile:** large headshot, name/title/brokerage, license #, rating, CTAs (Call / Email / Request a tour), Save agent; anchored tabs **About · Reviews · Recent sales · Listings · Service areas · Specialties**; sticky sidebar contact form (name/email/phone/message + intent checkboxes).
- **Lender directory:** mirrors agents — lender cards with logo, name, NMLS #, rating, loan types (Conventional, FHA, VA, Jumbo), sample rate/APR, **Get pre-qualified** + **Contact**; profile shows reviews and a pre-qual entry.
- All profiles are clearly synthetic. Agentic: **"Summarize this agent's reviews"**, **"Is this lender's rate competitive?"**, and a copilot **agent matchmaker**.

### (6) Home Loans / Mortgage Tools
- **Hub** with tiled cards: Affordability calculator, Mortgage calculator, Refinance calculator, Get pre-qualified, Today's rates, Lender directory (mirrors the "Home Loans" nav dropdown).
- **Affordability calculator:** two-column — left inputs (annual income, monthly debts, down payment, ZIP, rate, term, HOA/insurance/taxes); right a big result "You can afford up to **$X**" with a stacked payment donut and a debt-to-income gauge.
- **Mortgage calculator:** inputs (home price, down payment % slider + $, term, rate, ZIP); outputs monthly payment, an expandable amortization table + balance-over-time line chart, total interest, and a "use this in my search filters" link.
- **Refinance calculator:** current balance, current rate, new rate, term, closing costs → new payment, monthly savings, break-even months, lifetime interest delta.
- **Pre-qualification wizard:** stepper *Loan goal → Personal info → Income & employment → Assets/down payment → Credit range → Review* with a progress bar, soft-pull disclaimer, a **pre-approval letter upload slot**, and a result screen (estimated amount + rate range + matched lenders). The Finance/Mortgage agent explains every result conversationally.

### (7) Rentals
- Same **map + list split** as Buy, with a **rent-specific filter bar:** Price (monthly), Beds/Baths, **Move-in date**, **Lease length** (month-to-month, 6/12 mo), **Pets** (cats/dogs/none + pet rent), **Furnished/Unfurnished**, **Laundry** (in-unit/shared), **Parking**, **Amenities** (pool, gym, A/C), **Income restricted**, **Accepts applications online**; type pills Apartments / Houses / Townhomes.
- **Rental detail:** photo gallery, monthly price + "available now/date", a **floor-plans table** (unit types with bed/bath/price/availability rows), pet-policy block, lease terms, amenities grid, application fee + deposit, commute & schools, similar rentals, **Apply now** + **Request a tour**.
- **Application wizard:** *Applicant info → Residence history → Employment/income → Documents (ID, pay stubs) → Co-applicants → Pets → Review & pay fee → Submit*, progress bar, save-and-resume.
- Agentic: conversational rent search, an application assistant that pre-fills from profile/uploaded docs, "Is this rent fair?", and proactive new-match/price-drop feed.

### (8) Sell / List-Your-Home
- **Sell hub:** hero "Sell your home" with an address input → "What's your home worth?"; tiles **See your Zestimate · List with an agent · Sell it yourself (FSBO) · Price your home**; educational sections (how it works, costs to sell, timeline).
- **Price-it / owner dashboard:** the home's Zestimate with a value-over-time chart, value range, comparable recent sales (table + map), an asking-price slider with live feedback ("priced 6% above comps — expect slower interest"), and a net-proceeds estimator (sale price − agent fee − closing costs − remaining mortgage).
- **List wizard:** *Verify your home → Photos & details (uploader + feature checklist) → Set price → Listing type (FSBO vs agent) → Showing preferences → Review & publish*, progress bar, autosave.
- **Seller dashboard:** views, saves, shares, tour requests, an offer inbox, price-adjustment suggestions, a listing-quality score.
- Agentic: a Pricing agent that runs the valuation with a live timeline, an AI listing copywriter (reads uploaded photos for highlights), and a Negotiation agent evaluating simulated offers.

### (9) Account + Guest vs Demo Super-User
- **Settings hub:** left nav (Profile, Account & security, Notifications & alerts, Saved searches, Connected docs, Agent preferences, Demo/Showcase) + right content pane.
  - **Profile:** name, photo, contact, home-buying stage (Buying / Selling / Renting / Just browsing), target metros & budget.
  - **Notifications:** per-channel email/push toggles, alert frequency, a proactive-agent toggle + aggressiveness slider.
  - **Security:** password, sessions, sign-out.
  - **Connected docs:** uploaded pre-approval / inspection reports list.
  - **Agent preferences:** autonomy level (Ask first / Semi-auto / Fully autonomous), specialist toggles, persona/verbosity, default metros/budget.
- **Guest experience:** no account required to browse or use the agent; saves/searches/chat persist locally with a sticky banner "Sign in to save these across devices"; a lightweight magic-link/OAuth modal appears only when persisting.
- **Demo super-user:** a one-click "Enter demo" account, pre-seeded with saved homes, collections, saved searches + alerts, uploaded docs, a finance profile, and chat history. Includes an **Agent Showcase launcher** ("Run the full autonomous flow: find → analyze → shortlist → schedule") and a **model-router debug panel** showing which provider handled each step (Groq/DeepSeek/Gemini/OpenAI/Anthropic), with toggles "show agent reasoning" and "show cost per step".

### (10) Compare Homes
- **Side-by-side column table** for 2–4 homes: sticky left attribute-label column, sticky home headers (photo, price, address, remove ✕), horizontal scroll for >3 homes, a "+ Add a home" column.
- **Attribute rows:** price, $/sqft, beds, baths, sqft, lot, year built, HOA, type, days on market, **Zestimate vs list price**, est. monthly payment, **commute time** to a saved location, school ratings, walk/transit score, price history sparkline, and an **AI deal score** row.
- **Best-value highlighting:** the best cell per row (lowest $/sqft, best deal score) highlighted in blue.
- Agentic: an **Analyst verdict bar** at top ("Home B is the strongest buy: best $/sqft, under Zestimate, 12-min commute; Home A is overpriced 7%"), live re-ranking ("Re-rank by investment ROI"), and "Add the best one to my 'Dream homes' collection".

### (11) Off-Market / Investment
- Same map+list split with a distinct **investor filter bar:** off-market / pre-foreclosure / auction / FSBO status, **cap rate**, **cash-on-cash return**, estimated rent, price-to-rent ratio, "below Zestimate %", neighborhood appreciation. Result cards show **investment KPIs** (est. cap rate, est. monthly cash flow, rent estimate) alongside the standard photo/price, with an "Off-market — estimated data" disclaimer.
- **Investment detail:** standard detail PLUS an **investment analysis panel** — estimated rent, gross yield, cap rate, cash-on-cash with editable assumptions (down payment, rate, vacancy, expenses, management %), a 5/10-yr projection chart, comps, and a rehab/ARV estimate, with a **"Run my numbers"** live recalc.
- Agentic: the Market/Investment Analyst runs full underwrites with a streaming timeline; "Find me cash-flowing 4-plexes under $700k, analyze ROI, shortlist top 5"; a proactive deal feed.

---

## Agentic UI (net-new surfaces, rendered tastefully on top of the Zillow look)

> Guiding rule: introduce the agent through (a) the search bar's behavior, (b) ONE clearly-branded entry point, and (c) reversible, dismissible surfaces. Never repaint the page. Every agentic surface is collapsible so the product degrades to a pixel-faithful Zillow.

### Persistent page-aware Chat Copilot
- **Entry points:** the header **`✦ Ask AgenticZillow`** pill, and a **floating launcher (FAB)** bottom-right — a circular blue button with the ✦ sparkle, shadow-lg, label-on-hover "Ask AgenticZillow", persists on scroll, pulses gently once on first load (respects reduced-motion).
- **Collapsed state:** just the FAB / header pill; on returning users the FAB shows a small count badge for proactive items.
- **Expanded state:** a **right-side dock / slide-over** (`w-[400px]`, full-height, shadow-lg) — or a bottom sheet on mobile. It is **page-aware**: header reads "You're on the home page — want me to find homes, value yours, or check what you can afford?" or, on a listing, "Ask about **1234 Pearl St**" with a tiny thumbnail. Contains a chat thread, a **multimodal composer** (text input + 📎 attach + 🎤 mic), **suggested-prompt chips** seeded from the page (*Is this a good deal? · Analyze this deal · Summarize the neighborhood · What's my commute? · Draft an offer · Compare to similar homes · Explain the Zestimate*), and a tab for the **Live Activity Timeline**. Persists across navigation; guests use it fully with a soft "Sign in to save this chat" nudge. Concierge copy tone: "On it.", "Want me to…?", "Here's what I found." Streams tokens; cites listings it references by highlighting the matching cards/pins.

### Conversational NL search experiences
- The hero/results search bar is dual-mode (`Search ↔ Ask` with a ✦ toggle). **Rotating placeholders** (fade every ~4s): "Enter an address, neighborhood, city, or ZIP code" → "Try: *cozy craftsman with character near coffee shops in Austin under $700k*" → "Try: *3-bed, good schools, < 30 min commute to downtown Seattle*" → "Try: *a good rental investment in Miami with strong cash flow*" → "Try: *something like this photo — or paste a listing link*".
- **Suggestion chips** below the pill (horizontal scroller): `🏡 Find me a home` · `📈 Analyze an investment` · `💰 What can I afford?` · `📍 Best neighborhoods for me` · `🖼️ Search by photo` · `📄 Read my pre-approval`.
- **The "money moment" on submit:** pure address/ZIP behaves like Zillow (routes to results). Fuzzy intent makes the **hero transform in place** — the background dims, the pill rises, and a **two-pane agent surface** slides up: left a streaming chat column where the orchestrator restates intent ("Looking for a cozy craftsman under $700k near good coffee in Austin — on it."), right the **Live Activity Timeline**. Results render as live Property Cards inline with a "See all on map →" promotion.
- **NL refinement reflected in the UI:** typing "only ones with a big yard" / "drop the price to 550" / "add a 2-car garage" makes the **real filter controls visibly update**, applied-filter chips appear in the results header (each marked **"Applied by AI"** and removable), and the result count re-counts — the human stays in control.

### Inline AI on cards & detail pages
- **On Property Cards (hover):** a subtle **`✦ Is this a good deal?`** chip opens the copilot pre-seeded with that home and streams a quick verdict. Cards may show a small **AI value badge** (e.g. "~6% under Zestimate") and an **"add to shortlist"** checkbox.
- **On detail pages:** first-class blue-accented insight chips/cards — **"Is this a good deal?"** returns a verdict badge **Great / Fair / Overpriced** with a one-line reason + confidence meter, expanding to comps + Zestimate delta + days-on-market; **"Analyze this deal"** opens a full ROI panel (cap rate, cash-on-cash, monthly cash flow, break-even, 5-yr projection, an editable comps table); **"Summarize the neighborhood"**, **"What's my commute?"** (route mini-map + multi-modal times), **"Explain the Zestimate"**, **"Explain price history"**. Each has a "view reasoning in timeline" link.

### Proactive Agent Feed
- A slim, dismissible **"From your agent"** strip (between hero and tiles on home; inline among cards on results/saved; a ribbon under the summary on detail) surfaces agent-initiated cards: *"3 new matches", "Price drop on a saved home", "Priced 3% below Zestimate", "Sits longer than area median — possible negotiating room", "Open house this weekend near your commute"*. Each card has quick actions **Shortlist · Analyze · Dismiss**. Never blocking; dismissible.

### Autonomous Mode workspace + Live Activity Timeline
- An **"Let the agent run" / Autopilot toggle** (in the copilot and search surfaces). When on, the orchestrator chains *find → analyze → shortlist → (simulate) schedule* while the user watches.
- **Live Activity Timeline panel** (docked alongside the copilot or in a dedicated workspace) streams the agent's chain in real time. Each row shows an **agent-name tag** (Orchestrator / Search Agent / Market Analyst / Finance Agent / Tour Concierge), a one-line label, a **status (spinner running → green check done → amber warning)**, timing, and **expandable reasoning**. Example stream:
  - "🧭 Orchestrator: planning 5 steps…" → done
  - "🔎 Search Agent: parsing intent → filters (3+ bd, ≤$600k, lot ≥ 0.2ac)" → done
  - "Search Agent: semantic search 'craftsman, character, cafés' … 41 hits"
  - "Applied filters to UI → count 1,240 → 41" → done
  - "📈 Market Analyst: pulling comps & Zestimate deltas … 41 scored" → done
  - "Shortlisting top 4 → collection 'Agent picks – Austin'" → done
  - "📅 Tour Concierge: simulating tour requests for top 3 …" → running
- Steps are **clickable** — "applied filters" highlights the affected chips; "shortlisted" focuses those pins (shortlisted pins get a **gold/star** treatment on the map). A tiny `ⓘ` reveals which model handled each step and a subtle **cost meter** ("running on Groq · $0.012"). **Simulated actions** stop at a confirmation card ("Draft tour request ready — book it?" / "Submit offer at $655K?") clearly badged **"Simulated for demo."**

### Image-upload (vibe search) & document-upload UIs
- **Image upload:** an **image dropzone** (drag-drop or 📎 in the composer / a "Search by photo" chip). After upload, show the thumbnail, a "Analyzing photo…" state, then **matched style tags** ("open-concept, warm wood, big windows") and a results grid of similar homes, with a one-line "matched on:" explanation. Supports text pairing ("like this but single-story and under $600k").
- **Document upload:** drag-drop a PDF (pre-approval letter, inspection report, pay stub). Show file chip + "Reading document…", then an **extracted-fields card** (lender, amount, rate, expiry; or inspection risk flags) that auto-fills the relevant calculator/wizard, plus a flag like "Your pre-approval expires in 12 days." Parsed fields are stored privately per user.

---

## Responsive, micro-interactions, states, accessibility

**Responsive**
- Breakpoints: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536. Content max-width 1280px, padding `px-4 sm:px-6 lg:px-10`.
- Header collapses to a hamburger drawer below md; the "Ask AgenticZillow" item floats to the top of the drawer.
- Search results: true split at xl, split-with-tabs at tablet, mutually-exclusive Map/List full-screen with a sticky toggle pill on mobile; the copilot becomes a bottom sheet and the timeline a collapsible "Show agent activity" sheet.
- Carousels keep horizontal scroll at all breakpoints (never wrap to a grid); show ~4 cards + peek on desktop, ~1.2 with peek on mobile.
- Feature bands stack image-on-top, text-below, CTA full-width below md.

**Micro-interactions / animation**
- Card hover: 1–2px lift + shadow-md; carousel chevrons + dots fade in on hover.
- Filter pills animate to the active (blue) state; popovers fade+scale from the trigger.
- Map pins scale to 1.08 and raise z-index on hover/active; clusters animate split on click; the draw lasso draws with a dashed blue stroke.
- Hero-to-agent transform: a smooth dim + slide-up of the two-pane agent surface (≤300ms, eased).
- Timeline rows animate in sequentially; spinner → check transitions; the FAB pulses once on first load.
- All agentic motion respects `prefers-reduced-motion` (fall back to instant state changes).

**Empty / loading / error states**
- **Loading:** skeleton Property Cards (base `#F1F1F4` shimmer), skeleton map (light gray with a spinner), streaming token shimmer in chat, "Searching…" spinner rows in the timeline.
- **Empty:** search "No homes match these filters — try widening your search" + a "Reset filters" button and an "Ask the agent to broaden this" suggestion; saved homes empty illustration; copilot first-run greeting.
- **Error:** inline error banners (`#FCE6EE` fill, `#D6005C` text) for failed searches; a graceful "The agent hit a snag — try again" card in the timeline if a step fails; toasts for transient failures; provider/router failures degrade silently to a cheaper model and never crash the UI.

**Accessibility**
- WCAG AA contrast (the gray ramp and blue are tuned for it); never rely on color alone for status — pair dots/badges with text labels.
- Full keyboard support: typeahead dropdown is `role="listbox"` with ↑/↓/Enter; modals/lightbox focus-trapped with Esc to close; filter popovers and the copilot reachable and operable by keyboard; visible focus ring `0 0 0 3px rgba(0,106,255,0.35)` on every interactive element.
- Proper landmarks/roles, `aria-label="AgenticZillow home"` on the logo, alt text on listing photos, live regions (`aria-live="polite"`) for the streaming timeline and toasts so screen readers announce agent progress.
- Touch targets ≥40px; respects reduced-motion and reduced-transparency.

---

I have the authoritative Claude data needed. Now writing Part B.

# Part B — Product & Technical Build Spec

> **Document scope.** This is the full implementation spec an engineer (or Claude Code) builds AgenticZillow from. It assumes the global design system and per-screen layouts from Part A. Here we cover the system: architecture, data model, search, the multi-agent layer, multi-provider LLM routing, streaming, multimodal, auth, APIs, maps, deployment, and the build order to reach an "everything in v1" demo.

---

## 1. Overview & Goals

AgenticZillow is a near-exact visual clone of Zillow.com with a powerful agentic AI layer bolted on top. It is a **portfolio / demo showcase** — the agentic experience is the star, wrapped in a UI that, at rest, passes the "is this Zillow?" glance test.

### 1.1 What success looks like (the demo bar)

A reviewer lands on the homepage and sees Zillow: blue, light, the same header, hero search, entry tiles, recommendation carousels, footer. Then they type a sentence — *"cozy craftsman with character near coffee shops in Austin under $700k"* — and the page comes alive:

1. A **Live Activity Timeline** streams the agent's real work in real time: *"Routing to Search Agent… Embedding your intent… Querying 1,240 Austin listings… Pulling comps… Scoring 'character' + walkability… Shortlisting 4 homes."*
2. Real **listing cards** render inline (synthetic data, real stock photos), synced to a Mapbox map with Zillow-style price-bubble pins.
3. They click **"Is this a good deal?"** on a card and the Market Analyst streams a verdict (price vs comps, Zestimate delta, ROI).
4. They flip on **Autonomous mode** — *"find me the 4 best 3-beds under $600k and set up tours"* — and watch the orchestrator chain `find → analyze → shortlist → schedule`, pausing at a **simulated** tour-booking confirmation.
5. A subtle cost meter shows it ran 9 cheap steps on Groq/DeepSeek and escalated 1 hard step to Claude — proving the **cost-aware routing** is real.

### 1.2 Concrete success criteria

| Criterion | Target |
|---|---|
| Visual fidelity | At rest, indistinguishable from Zillow at a glance; all agentic surfaces dismissible to a 1:1 clone. |
| Feature completeness | Every Zillow surface (Buy/Rent/Sell/Off-market, map search, HDP, valuation, mortgage, agents/lenders, saved homes/searches, compare, neighborhood/schools) — all present. |
| Agentic depth | Multi-agent orchestrator with autonomous chaining, live timeline, page-aware copilot, inline AI, proactive feed, multimodal (image + document + voice). |
| Cost discipline | Most LLM traffic resolves on Groq/DeepSeek/Gemini; Anthropic (`claude-opus-4-8`) reached only on the hardest reasoning, behind a daily cap. Per-step provider + cost surfaced in the demo. |
| Guest-first | Full browse + agent with no account; optional sign-in persists; one all-access **demo super-user** pre-seeded for showcasing. |
| Honesty | Clear "demo / portfolio clone, not affiliated with Zillow Group" disclaimer; all real-world actions **simulated**. |

### 1.3 Non-goals

No real MLS/real-estate API; no real tours/offers/applications (all simulated up to the real-world step); no payment processing; no heavyweight auth provider. Synthetic seed data across 5 metros (Austin, Seattle, Miami, NYC, Denver).

---

## 2. Tech Stack & High-Level Architecture

### 2.1 Stack

- **Frontend / app:** Next.js (App Router) + TypeScript + Tailwind CSS. React Server Components for first paint; Client Components for the map, copilot, timeline, and interactive filters.
- **DB:** Postgres + **pgvector** (semantic search via embeddings), hosted on **Neon** (or Supabase). Drizzle ORM + SQL migrations.
- **Maps:** Mapbox GL JS.
- **LLM fabric:** provider-abstraction + cost-aware router over **Groq, DeepSeek, Gemini, OpenAI, Anthropic** (Anthropic = `@anthropic-ai/sdk`, premium last resort).
- **Photos:** Unsplash / Pexels stock APIs by keyword (store URLs + attribution, don't re-host).
- **Deploy:** Vercel (Node runtime for streaming routes, extended `maxDuration`) + hosted Postgres.

### 2.2 System topology

```
┌────────────────────────────────────────────────────────────────────────────┐
│  BROWSER — Next.js App Router (RSC + Client Components)                      │
│   Zillow-clone UI · Mapbox canvas · Persistent Copilot dock ·                │
│   NL search bar · Live Activity Timeline (SSE) · Inline listing AI · Feed    │
└──────────────┬───────────────────────────────────────────┬──────────────────┘
        Server Actions (saves, forms,        Route Handlers (streaming SSE,
        first-paint SSR search)              search re-query, uploads)
               │                                            │
               ▼                                            ▼
┌────────────────────────────────────────────────────────────────────────────┐
│  NEXT.JS SERVER (Vercel functions)                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────────────────┐  │
│  │ Search svc   │  │ Agent runtime  │  │ LLM Router (cost-aware)          │  │
│  │ hybrid SQL + │  │ orchestrator + │  │ Groq→DeepSeek→Gemini→OpenAI→     │  │
│  │ pgvector     │  │ specialists +  │  │ Anthropic(claude-opus-4-8)       │  │
│  │              │  │ tool catalog   │  │ + embeddings (pinned)            │  │
│  └──────┬───────┘  └───────┬────────┘  └──────────────┬──────────────────┘  │
│         │                  │ tool calls               │ chat/vision/embed    │
│         ▼                  ▼                          ▼                       │
│  ┌──────────────────────────────┐         ┌──────────────────────────────┐   │
│  │ Postgres + pgvector (Neon)   │         │ External: Unsplash/Pexels,    │   │
│  │ listings, photos, agents,    │         │ Mapbox, 5 LLM provider APIs   │   │
│  │ users, saved_*, agent_runs…  │         │                               │   │
│  └──────────────────────────────┘         └──────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Data flow — a search

1. Filter change or NL query → `POST /api/search` (or a Server Action for SSR first paint).
2. If the query has fuzzy intent (*"craftsman with character near coffee shops"*), server calls the router → **Groq** to extract `{ filters, semanticText }`, then the **pinned embedding model (Gemini)** to embed `semanticText` → query vector.
3. Search service runs **one hybrid SQL query**: structured `WHERE` for hard filters, pgvector cosine distance for fuzzy intent, blended into a single `rank_score`.
4. Returns `{ listings, bounds, clusters, total, cursor }`. List pane renders cards; Mapbox renders price-bubble pins / clusters; list ↔ map sync via shared `hoveredListingId` / `selectedListingId` state; map `moveend` re-queries within new bounds (debounced; honors "search as I move").

### 2.4 Data flow — an agent / chat request

1. Client `POST /api/agent/run` (or `/api/agent/chat`) with user text (or image/doc ref) + `PageContext` (route, `listingId?`, active filters, map bounds, hovered/selected ids).
2. **Orchestrator** classifies intent (Groq), plans, selects mode (assistive vs autonomous), routes to specialist agents.
3. Agents call **tools** (server-side, deterministic DB/Mapbox work; only synthesis wrappers hit the LLM). Each loop transition is persisted to `agent_steps` and emitted as an `AgentEvent` over **SSE** → the timeline updates live.
4. Final synthesis streams as token deltas on the chat channel. Run + steps + messages persist (guest token or user id).

---

## 3. Repo / Folder Structure

```
agenticzillow/
├─ app/
│  ├─ layout.tsx                    # root: ZillowHeader, providers, Tailwind, Copilot dock + FAB
│  ├─ page.tsx                      # home (hero NL search, entry tiles, recommendation rows)
│  ├─ buy/page.tsx                  # for-sale map+list split search
│  ├─ rent/page.tsx                 # rentals (rent-specific filters)
│  ├─ sell/page.tsx  sell/price/page.tsx  sell/list/[step]/page.tsx  sell/dashboard/page.tsx
│  ├─ invest/page.tsx  invest/[id]/page.tsx     # off-market / investment
│  ├─ homedetails/[slug]/page.tsx   # HDP (listing detail)
│  ├─ agent-finder/page.tsx  profile/[slug]/page.tsx  lender-directory/page.tsx
│  ├─ myhomes/page.tsx  myhomes/collections/[id]/page.tsx
│  ├─ compare/page.tsx
│  ├─ mortgage/{calculator,affordability,refinance,pre-qualify}/page.tsx  mortgage-rates/page.tsx
│  ├─ account/{page,profile,notifications,security,agent-mode}.tsx
│  └─ api/
│     ├─ search/route.ts            # POST hybrid search
│     ├─ listing/[id]/route.ts      # GET listing + photos + similar + comps
│     ├─ agent/
│     │  ├─ run/route.ts            # POST SSE: autonomous/assistive agent run
│     │  ├─ chat/route.ts           # POST SSE: copilot chat
│     │  └─ run/[id]/route.ts       # GET replay timeline (reconnect)
│     ├─ valuation/route.ts         # POST Zestimate-style estimate + explanation
│     ├─ mortgage/route.ts          # POST deterministic mortgage/affordability
│     ├─ image-search/route.ts      # POST vibe/similar-by-photo (Gemini)
│     ├─ doc-upload/route.ts        # POST pre-approval/inspection parse (Gemini)
│     ├─ voice/route.ts             # POST STT (Groq Whisper-class)
│     ├─ save/route.ts              # POST/DELETE saved home/search/collection
│     └─ neighborhood/[id]/route.ts # GET schools/commute/insights
├─ components/
│  ├─ zillow/   ZillowHeader.tsx ZillowFooter.tsx PriceBubble.tsx ListingCard.tsx FilterBar.tsx SearchInput.tsx
│  ├─ map/      MapCanvas.tsx DrawControl.tsx ClusterLayer.tsx
│  ├─ agent/    ChatCopilot.tsx ActivityTimeline.tsx AgentFeed.tsx InlineDealAnalyzer.tsx AutonomousToggle.tsx CostMeter.tsx
│  └─ ui/       # shadcn-style shared atoms (Button, Dialog, Popover, Tabs…)
├─ lib/
│  ├─ db/       client.ts schema.ts queries/{search,listings,saves,agentRuns}.ts
│  ├─ llm/      router.ts types.ts embeddings.ts providers/{groq,deepseek,gemini,openai,anthropic}.ts
│  ├─ agent/    orchestrator/{intent,planner,loop,events}.ts
│  │            agents/{search,market,finance,concierge,neighborhood,comparison,negotiation,documentReader}.ts
│  │            tools/{catalog,finance,rag,actions}.ts
│  │            stream.ts budget.ts
│  ├─ search/   hybrid.ts
│  ├─ auth/     session.ts
│  └─ geo/      cityBounds.ts
├─ scripts/seed/  generateListings.ts fetchPhotos.ts embedListings.ts seedAgentsLenders.ts seedNeighborhoods.ts seedDemoUser.ts
├─ drizzle/     # generated migrations
├─ db/schema.sql
├─ .env.example  drizzle.config.ts  tailwind.config.ts  next.config.ts
```

---

## 4. Data Model — Postgres Schema (with pgvector)

Enable extensions once:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- fuzzy text on address/city
```

> **pgvector dimension note.** The embedding dimension is fixed at table-create time, so the embedding provider must be **pinned** (see §8.4). We default to **`vector(768)`** for the Gemini text-embedding model. All rows in a vector column must come from the same model + dimension — mixing models produces meaningless cosine distances. `EMBEDDING_DIM` lives in config.

### 4.1 `listings` (incl. embedding column)

```sql
CREATE TABLE listings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,                 -- /homedetails/{slug}
  status        text NOT NULL,                        -- 'for_sale'|'for_rent'|'sold'|'off_market'|'pending'
  listing_type  text NOT NULL,                        -- 'buy'|'rent'|'investment'
  address       text NOT NULL, unit text,
  city          text NOT NULL, state text NOT NULL, zip text NOT NULL,
  metro         text NOT NULL,                        -- 'austin'|'seattle'|'miami'|'nyc'|'denver'
  neighborhood  text,
  lat           double precision NOT NULL,
  lng           double precision NOT NULL,
  price         integer NOT NULL,                     -- sale price OR monthly rent
  beds          numeric(3,1) NOT NULL,
  baths         numeric(3,1) NOT NULL,
  sqft          integer, lot_sqft integer, year_built integer,
  home_type     text NOT NULL,                        -- 'single_family'|'condo'|'townhouse'|'multi'|'land'
  hoa_monthly   integer, property_tax_annual integer,
  description   text NOT NULL,
  features      jsonb DEFAULT '[]',                   -- ['craftsman','renovated kitchen','walkable']
  style_tags    jsonb DEFAULT '[]',                   -- ['craftsman','mid-century'] (for vibe match)
  poi_tags      jsonb DEFAULT '[]',                   -- ['coffee shops','parks','transit']
  zestimate     integer, rent_estimate integer,       -- precomputed seed; recomputed live by Market agent
  days_on_market integer DEFAULT 0,
  price_history jsonb DEFAULT '[]',                   -- [{date, price, event}]
  embedding     vector(768),                          -- semantic vector of doc(listing)
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);
CREATE INDEX listings_metro_idx       ON listings (metro);
CREATE INDEX listings_status_type_idx ON listings (status, listing_type);
CREATE INDEX listings_price_idx       ON listings (price);
CREATE INDEX listings_beds_baths_idx  ON listings (beds, baths);
CREATE INDEX listings_geo_idx         ON listings (lat, lng);
CREATE INDEX listings_embedding_idx   ON listings USING hnsw (embedding vector_cosine_ops);
```

### 4.2 `photos`

```sql
CREATE TABLE photos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url         text NOT NULL, thumb_url text, width integer, height integer,
  source      text NOT NULL,            -- 'unsplash'|'pexels'
  source_id   text, attribution text,   -- photographer credit (required by free APIs; render on HDP)
  ordinal     integer NOT NULL DEFAULT 0,
  embedding   vector(768)               -- optional: Gemini image embedding for vibe search
);
CREATE INDEX photos_listing_idx ON photos (listing_id, ordinal);
```

### 4.3 `agents_lenders` (fake profiles)

```sql
CREATE TABLE agents_lenders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         text NOT NULL,           -- 'agent'|'lender'
  name         text NOT NULL, slug text UNIQUE NOT NULL, photo_url text,
  metro        text, brokerage text,    -- or lending company
  rating       numeric(2,1), review_count integer DEFAULT 0,
  sales_count  integer, bio text, phone text,
  nmls         text,                     -- lenders only (fake)
  loan_types   jsonb DEFAULT '[]',       -- lenders: ['Conventional','FHA','VA','Jumbo']
  sample_rate  numeric(4,2)              -- lenders: sample APR
);
```

### 4.4 `users` (guest + demo super-user)

```sql
CREATE TABLE users (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text UNIQUE,             -- null for pure guests
  display_name text,
  is_demo      boolean DEFAULT false,   -- the all-access showcase account
  is_guest     boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);
-- Seed one row is_demo=true (demo@allmyai.ai) with curated saves/searches/docs/chat.
```

### 4.5 `collections`, `saved_homes`, `saved_searches`

```sql
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL, cover_listing_id uuid, created_at timestamptz DEFAULT now()
);
CREATE TABLE saved_homes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES collections(id) ON DELETE SET NULL,
  note text, tags jsonb DEFAULT '[]', created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, listing_id)
);
CREATE TABLE saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text, filters jsonb NOT NULL,    -- structured filter snapshot (+ boundary/bounds, commute)
  query_text text,                      -- original NL query, if any
  alert_freq text DEFAULT 'daily',      -- 'instant'|'daily'|'weekly'|'off'
  agent_monitored boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### 4.6 `conversations`, `messages`

```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,  -- null until claimed by guest sign-in
  guest_token text,                                     -- anon session linkage
  title text, created_at timestamptz DEFAULT now()
);
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL,                   -- 'user'|'assistant'|'system'|'tool'
  content text NOT NULL,
  attachments jsonb DEFAULT '[]',       -- [{type:'image'|'document', url, parsed}]
  provider text, model text,            -- which LLM produced this assistant turn
  created_at timestamptz DEFAULT now()
);
CREATE INDEX messages_conv_idx ON messages (conversation_id, created_at);
```

### 4.7 `agent_runs`, `agent_steps` (powers the Live Activity Timeline + cost meter)

```sql
CREATE TABLE agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  mode text NOT NULL,                   -- 'assist'|'autonomous'
  goal text, status text NOT NULL,      -- 'running'|'idle'|'done'|'error'
  total_usd numeric(10,5) DEFAULT 0,    -- running cost (cost meter)
  started_at timestamptz DEFAULT now(), finished_at timestamptz
);
CREATE TABLE agent_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
  seq integer NOT NULL,                 -- monotonic; ordering + reconnect dedupe
  agent text NOT NULL,                  -- 'orchestrator'|'search'|'market'|'finance'|'concierge'|...
  kind text NOT NULL,                   -- 'plan'|'route'|'reasoning'|'tool_call'|'tool_result'|'message'|'gate'
  label text NOT NULL,                  -- "Pulling comps...", "Calculating ROI..."
  tool_name text, tool_input jsonb, tool_output jsonb,
  status text,                          -- 'running'|'ok'|'error'
  provider text, model text,            -- which LLM this step used (cost tracking)
  tokens_in integer, tokens_out integer, usd numeric(10,6),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX agent_steps_run_idx ON agent_steps (run_id, seq);
```

### 4.8 `neighborhoods`, `schools`, `agent_facts`

```sql
CREATE TABLE neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metro text NOT NULL, name text NOT NULL,
  walk_score integer, transit_score integer, bike_score integer,
  median_price integer, median_rent integer,
  summary text,                         -- AI-written neighborhood blurb (seed-time)
  embedding vector(768),                -- "near coffee shops / walkable" matching
  bounds jsonb                          -- polygon for draw/overlay
);
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id uuid REFERENCES neighborhoods(id) ON DELETE CASCADE,
  name text NOT NULL, level text,       -- 'elementary'|'middle'|'high'
  rating integer,                       -- /10
  distance_mi numeric(4,2), lat double precision, lng double precision
);
-- agent learns user prefs over time without bloating context:
CREATE TABLE agent_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  key text NOT NULL, value text, source text, learned_at timestamptz DEFAULT now()
);
```

---

## 5. Synthetic Data Generation & Seeding

Ordered, idempotent scripts (`scripts/seed/*`), upsert by `slug`. All seed-time LLM calls go through the router pinned to the **cheapest tier** (quality bar = "plausible," not "best").

**Step 1 — `generateListings.ts` (geo within city bounds).**
- Metros: Austin, Seattle, Miami, NYC, Denver. `lib/geo/cityBounds.ts` holds each metro's bounding box + plausible neighborhood sub-boxes + a small water/exclusion mask.
- Sample `lat/lng` *inside* a neighborhood sub-box so pins cluster realistically rather than scattering over water.
- **Price:** draw from a metro-specific log-normal centered on that metro's median (NYC/Seattle high, Austin/Denver mid, Miami mid-high), scaled by `home_type`, `sqft`, `year_built`. Rentals priced as ~0.4–0.7% of implied value/month.
- Beds/baths/sqft/year from correlated distributions (more beds → more sqft). `home_type` weighted by metro (NYC skews condo, Austin skews single-family).
- **Description + features** generated in batch via the cheap LLM (DeepSeek/Groq): *"Write a 60-word MLS-style listing for a {year} {home_type}, {beds}bd/{baths}ba, {sqft}sqft in {neighborhood}, {metro}; emphasize {2 random features}."* This yields natural, embeddable prose with varied "character" language for fuzzy-intent demos.
- `zestimate`/`rent_estimate`: derive from a simple comp model (metro median $/sqft × sqft ± noise) so the agent can later "explain" them.

**Step 2 — `fetchPhotos.ts` (Unsplash/Pexels by keyword).**
- Per listing, query by attribute-derived keywords: `"{home_type} interior"`, `"modern kitchen"`, `"living room"`, `"house exterior {style}"`. Take 4–8 images; store `url`, `thumb_url`, `source`, `source_id`, **attribution** (free-API ToS requires photographer credit — render on HDP).
- Concurrency cap (`p-limit` 5); cache keyword→urls locally so re-seeding is free and respects rate limits.

**Step 3 — `embedListings.ts` (build embeddings).**
- Compose a canonical doc per listing and embed once at ingest (re-embed on material change):

```ts
function listingDoc(l: Listing): string {
  return [
    `${l.beds}bd/${l.baths}ba ${l.home_type} in ${l.neighborhood}, ${l.city}`,
    `${l.sqft} sqft, built ${l.year_built}, $${l.price}`,
    l.description,
    `Style: ${l.style_tags.join(", ")}`,        // craftsman, mid-century…
    `Nearby: ${l.poi_tags.join(", ")}`,         // coffee shops, parks, transit
  ].join("\n");
}
// embed via the PINNED model (Gemini text-embedding) → vector(768); batch; write listings.embedding
```

**Step 4 — `seedAgentsLenders.ts` / `seedNeighborhoods.ts` / `seedDemoUser.ts`.**
- ~30 fake agents + ~15 lenders per metro; neighborhood rows with AI summaries (cheap LLM) + embeddings + 2–4 schools each.
- Seed the **demo super-user** (`is_demo=true`): curated saved homes, collections, saved searches with alerts, uploaded docs, a finance profile, prior agent conversations — so every feature is showcase-ready instantly.

---

## 6. Search — Hybrid Filters + pgvector Semantic Search

Structured SQL filters (hard constraints) blended with pgvector cosine similarity (soft ranking) into one `rank_score`.

**Pipeline:** NL query → Groq extracts `{ filters, semanticText }` → embed `semanticText` (pinned Gemini model) → `queryVector` → single hybrid SQL query.

```sql
-- :qvec = embed(semanticText); filters injected as parameterized WHERE.
-- Cosine distance via <=> (lower = closer); 1 - distance = similarity.
SELECT
  l.*,
  (1 - (l.embedding <=> :qvec))                                   AS semantic_score,
  ( 0.70 * (1 - (l.embedding <=> :qvec))
  + 0.20 * (1 - LEAST(ABS(l.price - :price_target)/NULLIF(:price_target,0), 1))
  + 0.10 * (1 - LEAST(l.days_on_market / 90.0, 1)) )              AS rank_score
FROM listings l
WHERE l.metro       = ANY(:metros)
  AND l.status      = :status
  AND l.listing_type= :type
  AND l.price       BETWEEN :minPrice AND :maxPrice
  AND l.beds        >= :minBeds
  AND l.baths       >= :minBaths
  AND (:minSqft   IS NULL OR l.sqft >= :minSqft)
  AND (:minYear   IS NULL OR l.year_built >= :minYear)
  AND (:homeTypes IS NULL OR l.home_type = ANY(:homeTypes))
  -- viewport bounds when map-driven:
  AND l.lat BETWEEN :south AND :north
  AND l.lng BETWEEN :west  AND :east
ORDER BY rank_score DESC
LIMIT 100;
```

- **Filters-only (no fuzzy intent):** drop the vector terms, `ORDER BY price` or `days_on_market`. The embedding column is invoked only when `semanticText` is present.
- **Draw-to-search:** replace the bounding-box `WHERE` with a polygon point-in-polygon test; for v1, bounding box + client-side polygon filter is acceptable.
- **Image / vibe search:** same blend, but `:qvec` is a Gemini image-derived vector compared against `photos.embedding`.
- **Ranking weights** live in `lib/search/hybrid.ts` (tunable). Use the HNSW index; cap candidates at 100, return a 40-card page with cursor pagination. The Search agent re-ranks top-k with a cheap LLM (DeepSeek) **only to produce `matchReasons[]` for display**, not to materially re-order (keeps it cheap + deterministic).
- URL-encode `{status, filters, boundary, sort, page, searchAsIMove, mapStyle}` → deep-linkable, shareable, reloadable saved searches.

---

## 7. Multi-Agent System

An **orchestrator** routes every prompt to specialist agents. It runs **assistively** (page-aware copilot) or **fully autonomously** (`find → analyze → shortlist → schedule`), streaming every step to the live timeline. All real-world actions are **simulated** and gated.

### 7.1 Orchestrator responsibilities

1. **Classify intent** (Groq — highest-frequency call, cheapest tier).
2. **Plan** — reactive (deterministic intent→toolchain table, no LLM) for common cases; deliberative (LLM-produced typed `Plan` DAG, DeepSeek) for compound goals.
3. **Select mode** — assistive by default; autonomous only on explicit multi-step goal, model signal, or user opt-in.
4. **Route** each step to the right specialist (deterministic dispatch table; LLM fills args, never picks agents freely → auditable + cheap).
5. **Run the loop** (plan → act → observe → reflect) within step + cost budgets.
6. **Stream** `AgentEvent`s + tokens; **enforce guardrails** (confirmation gates, simulation-only, cost caps).

```ts
// lib/agent/orchestrator/intent.ts
type Intent =
  | "search" | "analyze_listing" | "value_estimate" | "finance"
  | "neighborhood" | "compare" | "tour_or_offer" | "save"
  | "document" | "image_vibe" | "autonomous_goal" | "chitchat" | "unknown";

interface IntentResult {
  intent: Intent;
  confidence: number;
  entities: ExtractedEntities;     // city, beds, priceMax, propertyType, vibeQuery…
  autonomyAdvised: boolean;        // model signal of multi-step goal
  requiresConfirmation: boolean;   // touches a simulated real-world action
  pageContext?: PageContext;       // { route, listingId?, savedSearchId?, mapBounds? }
}
async function classifyIntent(turn: string, history: ShortTermMemory, page: PageContext): Promise<IntentResult>;
// → LLMRouter.complete({ task:"intent_classify", complexity:"trivial", modality:"text", schema }) // Groq

function selectMode(i: IntentResult, user: UserContext): "assistive" | "autonomous" {
  if (i.intent === "autonomous_goal") return "autonomous";
  if (i.autonomyAdvised && i.entities.impliesMultiStep) return "autonomous";
  if (user.prefersAutopilot) return "autonomous";
  return "assistive";  // default — never surprise the user
}
```

### 7.2 Specialist agent roster (intent → agent → toolchain)

Each agent = thin policy + system prompt + an allowed tool subset + a default complexity tier (overridable per call).

| Intent | Primary agent | Typical toolchain | Default tier |
|---|---|---|---|
| `search` / `image_vibe` | **Search** | `analyzeImageForVibe?` → `semanticSearch` + `searchListings` → rank | Groq (extract) + DeepSeek (rationale); Gemini (vision) |
| `value_estimate` / `analyze_listing` | **Market / Investment Analyst** | `getComps` → `estimateValue` → `rentEstimate` → ROI synth | DeepSeek; escalate to OpenAI/Anthropic for hard/ambiguous |
| `finance` | **Finance / Mortgage** | `mortgageCalc` / `affordability` (+ `parseDocument` if pre-approval) | Groq (math wrapper) + DeepSeek (narrative); **math is code, not LLM** |
| `tour_or_offer` | **Tour / Transaction Concierge** | `scheduleTour` / `draftOffer` / `submitOffer` (all gated, simulated) | Groq/DeepSeek (low reasoning load) |
| `neighborhood` | **Neighborhood** *(proposed)* | `getNeighborhood` / `getSchools` / `getCommute` / `getPOIs` | DeepSeek; Gemini if summarizing a photo |
| `compare` | **Comparison** *(proposed)* | fan-out `getComps`/`estimateValue`/`getCommute` per home → diff | DeepSeek |
| (negotiation) | **Negotiation** *(proposed)* | `getComps` → `getPriceHistory` → `estimateValue` → `draftOffer` | **OpenAI / Anthropic (`claude-opus-4-8`)** — hardest reasoning, marquee moment |
| `document` | **Document-Reader** *(proposed)* | `parseDocument` → `extractFacts` → route to Finance/Market | Gemini (cheap multimodal); Anthropic only for dense inspection reports |
| `save` | (orchestrator-direct) | `saveHome` / `saveSearch` | — |
| `autonomous_goal` | Orchestrator (multi-agent) | deliberative plan across all of the above | — |

### 7.3 Tool catalog (function-calling specs)

All tools are JSON-schema function defs executed server-side. **Tools never call the LLM; the LLM calls tools.** Math/financial tools are **pure deterministic functions** (anti-hallucination). Schemas use `additionalProperties:false` + `required` + `strict:true` where supported.

```ts
// ── DISCOVERY ────────────────────────────────────────────────────────────────
searchListings(args:{ city?:string; bounds?:GeoBounds; priceMin?:number; priceMax?:number;
  beds?:number; baths?:number; propertyType?:"house"|"condo"|"townhome"|"multifamily";
  sqftMin?:number; yearMin?:number; status?:"for_sale"|"for_rent"|"off_market";
  sort?:"relevance"|"price_asc"|"price_desc"|"newest"; limit?:number; cursor?:string;
}): { listings:Listing[]; total:number; cursor?:string };

semanticSearch(args:{ vibeQuery:string; filters?:SearchFilters; k?:number; // default 50
}): { listings:ScoredListing[] };   // score = α·cosine + β·filterFit + γ·recency

analyzeImageForVibe(args:{ imageRef:string }):                  // Gemini vision
  { vibeTerms:string[]; styleTags:string[]; embedding:number[] };

// ── VALUATION ────────────────────────────────────────────────────────────────
getComps(args:{ listingId?:string; lat?:number; lng?:number; beds?:number; baths?:number;
  sqft?:number; radiusMi?:number; limit?:number; }): { comps:Comp[]; medianPricePerSqft:number };
estimateValue(args:{ listingId?:string; features?:PropertyFeatures; }):
  { estimate:number; low:number; high:number; confidence:number; drivers:ValuationDriver[] };
rentEstimate(args:{ listingId?:string; features?:PropertyFeatures; }):
  { rent:number; low:number; high:number; comps:RentComp[] };

// ── FINANCE (PURE FUNCTIONS — NO LLM) ────────────────────────────────────────
mortgageCalc(args:{ price:number; downPct:number; rateApr:number; termYears:number;
  taxRateAnnual?:number; insuranceAnnual?:number; hoaMonthly?:number; }):
  { monthly:number; principalInterest:number; taxes:number; insurance:number; hoa:number; amortization:AmortRow[] };
affordability(args:{ grossMonthlyIncome:number; monthlyDebts:number; downPayment:number;
  rateApr:number; termYears:number; dtiTarget?:number; }): { maxPrice:number; maxMonthly:number; dtiUsed:number };

// ── NEIGHBORHOOD ─────────────────────────────────────────────────────────────
getNeighborhood(args:{ lat:number; lng:number; }):
  { name:string; medianPrice:number; trend12moPct:number; walkScore:number; pois:POI[] };
getSchools(args:{ lat:number; lng:number; }): { schools:School[] };
getCommute(args:{ from:GeoPoint; to:GeoPoint; mode:"drive"|"transit"|"bike"; }):
  { minutes:number; isochroneGeoJSON?:object };   // Mapbox

// ── ACTIONS (SIMULATED + GATED) ──────────────────────────────────────────────
scheduleTour(args:{ listingId:string; slotISO:string; contact:ContactInfo; }):
  { status:"simulated_booked"; confirmationId:string; calendarHold:ICSStub };
draftOffer(args:{ listingId:string; offerPrice:number; contingencies:string[]; closingDays?:number; }):
  { status:"drafted"; offerDocId:string; letterText:string };
submitOffer(args:{ offerDocId:string; }):
  { status:"simulated_submitted"; submittedAt:string };          // hard confirm gate

// ── PERSISTENCE ──────────────────────────────────────────────────────────────
saveHome(args:{ listingId:string; collectionId?:string; }): { saved:true };
saveSearch(args:{ filters:SearchFilters; vibeQuery?:string;
  alerts?:{priceDrop?:boolean; newMatch?:boolean}; }): { savedSearchId:string };

// ── DOCUMENTS (multimodal) ───────────────────────────────────────────────────
parseDocument(args:{ docRef:string; docType:"pre_approval"|"inspection"|"disclosure"; }):
  { fields:Record<string,string|number>; risks:RiskFlag[]; summary:string };
```

Provider notes baked into the catalog: `analyzeImageForVibe`, `parseDocument` → **Gemini**; `mortgageCalc`, `affordability` → **no LLM** (TypeScript math); all others have a deterministic DB/Mapbox body with only the explainer/synthesis wrapper hitting the calling agent's chosen tier.

### 7.4 Fully-autonomous loop (plan → act → observe → reflect)

```ts
async function runAutonomous(goal: string, ctx: RunContext, emit: Emit) {
  const budget = new Budget({ maxSteps: 12, maxUsd: 0.40, maxWallMs: 90_000, maxReplans: 2 });
  emit(ev("plan_start", { agent:"orchestrator", summary:`Goal: ${goal}` }));

  let plan = await deliberativePlan(goal, ctx);              // DeepSeek (→ escalate on failure)
  emit(ev("plan_ready", { result: plan.steps.map(s => s.rationale) }));

  const obs = new ObservationStore();
  for (const step of topoSort(plan.steps)) {
    if (budget.exhausted()) { emit(ev("cost_cap", { summary:"budget reached" })); break; }
    if (step.gate === "confirm") {                           // tours, offers
      emit(ev("await_confirm", { step }));
      await ctx.waitForConfirmation(step.id);                // pause; resume on user event
    }
    emit(ev("step_start", { stepId:step.id, agent:step.agent, tool:step.tool, summary:humanize(step) }));
    const args = step.args === "$derive" ? deriveArgs(step, obs) : step.args;
    try {
      const result = await callTool(step.agent, step.tool, args, budget);   // ACT
      obs.put(step.id, result);                                             // OBSERVE
      emit(ev("step_done", { stepId:step.id, status:"ok", summary:summarize(result), result }));
    } catch (e) {
      emit(ev("step_done", { stepId:step.id, status:"error", summary:String(e) }));
      obs.put(step.id, { error:true });
    }
    const verdict = await reflect(goal, plan, obs, budget);                 // REFLECT (cheap unless stuck)
    if (verdict.action === "replan") { plan = verdict.newPlan; emit(ev("replan", { result:verdict.reason })); }
    else if (verdict.action === "stop") { emit(ev("goal_satisfied", { summary:verdict.reason })); break; }
  }
  emit(ev("final", { result: await synthesize(goal, obs) }));
}
```

**Reflection** is deterministic first (did the step satisfy its `stopWhen` predicate? — no LLM); an LLM reflection (DeepSeek) fires only when a step errors, returns empty, or `stopWhen` is ambiguous; repeated failure escalates the reflection once to OpenAI → Anthropic.

**Stop conditions / budget:** `maxSteps 12`, `maxUsd $0.40/run`, `maxWallMs 90s`, `maxReplans 2`, per-plan `stopWhen` (e.g. `shortlist.length >= 4 && allHaveROI`), and hard gates (`scheduleTour`/`submitOffer`) that **pause for confirmation, never auto-execute**.

### 7.5 Agent-event schema (drives the timeline)

```ts
interface AgentEvent {
  runId: string;
  seq: number;                 // monotonic; ordering + reconnect dedupe
  ts: string;                  // ISO
  channel: "timeline" | "chat";
  type: "plan_start"|"plan_ready"|"step_start"|"step_done"|"replan"
      | "await_confirm"|"cost_cap"|"goal_satisfied"|"final"|"token"|"error";
  stepId?: string; agent?: AgentName; tool?: ToolName;
  status?: "ok"|"error"|"running";
  summary?: string;            // one-line human text for the timeline row
  result?: unknown;            // structured payload (collapsible chips/JSON)
  tokenDelta?: string;         // chat channel only
  provider?: string;           // "groq"|"deepseek"|"gemini"|"openai"|"anthropic"
  usd?: number;                // running cost — subtle live meter
}
```

| Loop phase | `type` | Timeline render |
|---|---|---|
| plan made | `plan_ready` | "🧭 Planned 5 steps" + expandable rationale |
| step begins | `step_start` | "🔎 Searching 3-beds in Austin…" (spinner) |
| tool result | `step_done` (ok) | "✅ Found 38 homes" (collapsible result chip) |
| tool error | `step_done` (error) | "⚠️ Comps empty — widening radius" |
| reflection | `replan` | "🔁 Adjusting: dropping price to $550k" |
| gate | `await_confirm` | "⏸ Confirm booking this tour?" (button) |
| done | `final` | "🏁 Shortlisted 4 homes, 2 tours held" |

---

## 8. Multi-Provider LLM Routing

A single `LLMRouter` abstracts all five providers behind one interface. Routing picks a provider by **task complexity × modality × cost**, with graceful fallback. **Claude (`claude-opus-4-8`) is the most expensive tier and is reserved as the premium last resort** for the hardest reasoning only.

### 8.1 Provider & model matrix

> **Confidence:** Anthropic IDs, context windows, and pricing below are **authoritative** (current Claude model catalog). Groq / DeepSeek / Gemini / OpenAI IDs and prices drift fast — every non-Anthropic figure is **`verify current`** against the provider's live pricing page before launch. Wire all prices into `MODEL_REGISTRY` config; never hard-code them in routing logic.

| Provider | Representative model | Cost (in/out per 1M) | Speed | Ctx | Vision | Role |
|---|---|---|---|---|---|---|
| **Groq** | `llama-3.1-8b-instant` `verify current` | ultra-cheap | ⚡⚡⚡ | ~128K | ❌ | Trivial classify, yes/no gating |
| **Groq** | `llama-3.3-70b-versatile` `verify current` | ~$0.59/$0.79 `verify` | ⚡⚡⚡ | ~128K | ❌ | **Tier 0** — intent classify, entity extraction, filter parsing |
| **DeepSeek** | `deepseek-chat` (V3) `verify current` | ~$0.27/$1.10 `verify` | ⚡⚡ | ~64K | ❌ | **Tier 1** — cheap reasoning (valuation explain, ROI, neighborhood) |
| **DeepSeek** | `deepseek-reasoner` (R1) `verify current` | ~$0.55/$2.19 `verify` | ⚡ | ~64K | ❌ | Harder multi-factor investment math before escalating |
| **Gemini** | `gemini-2.5-flash` `verify current` | cheap multimodal `verify` | ⚡⚡ | ~1M | ✅ native | **Tier 1-V** — image/vibe search, document parse |
| **Gemini** | `gemini-2.5-pro` `verify current` | mid `verify` | ⚡ | ~1M | ✅ native | Heavy multimodal / long-doc synthesis |
| **Gemini** | `text-embedding-004` `verify current` | cheap | — | — | — | **Pinned embeddings** (pgvector `vector(768)`) |
| **OpenAI** | `gpt-4.1-mini` `verify current` | mid `verify` | ⚡⚡ | ~128K | ✅ | **Tier 2** — reliable strict-JSON fallback |
| **OpenAI** | `gpt-4.1` `verify current` | mid-high `verify` | ⚡ | ~128K | ✅ | Hard reasoning the mid tier can't close |
| **Anthropic** | `claude-haiku-4-5` | **$1 / $5** (authoritative) | ⚡⚡ | **200K** | ✅ | Cheapest Claude — entry to the premium tier |
| **Anthropic** | `claude-sonnet-4-6` | **$3 / $15** (authoritative) | ⚡ | **1M** | ✅ | Premium reasoning mid-Claude |
| **Anthropic** | **`claude-opus-4-8`** | **$5 / $25** (authoritative) | ⚡ | **1M** | ✅ | **Tier 3 — LAST RESORT.** Hardest reasoning only; reserved & capped |

**Anthropic API specifics the adapter uses (authoritative):** `thinking: {type:"adaptive"}` for hard tasks; `output_config: {effort: "high"}` (drop to `"low"` for cheap Claude calls); **never** `budget_tokens` or `temperature`/`top_p`/`top_k` on Opus 4.8 (they 400); `max_tokens ≥ 16000` and **stream** large outputs; prompt-cache the stable system prompt via `cache_control: {type:"ephemeral"}` (~0.1× read cost). Use bare model IDs — no date suffix.

### 8.2 Task → model routing matrix (cheap-first; Gemini for vision; Anthropic LAST)

| Task | Modality | Primary (cheapest viable) | Escalation ladder (low→high cost) |
|---|---|---|---|
| Intent classify / quick extraction / filter parse | text | `groq:llama-3.3-70b` (JSON) | → `openai:gpt-4.1-mini` (strict JSON) → `deepseek-chat` |
| Semantic query expansion | text | `deepseek-chat` | → `gemini-2.5-flash` → `openai:gpt-4.1-mini` |
| Listing inline AI / neighborhood / "good deal?" | text | `deepseek-chat` | → `gemini-2.5-flash` → `openai:gpt-4.1-mini` |
| Market / ROI / "analyze this deal" | text | `deepseek-reasoner` | → `openai:gpt-4.1` → `claude-sonnet-4-6` → `claude-opus-4-8` |
| **Image vibe search** (mandated) | image | `gemini-2.5-flash` | → `gemini-2.5-pro` → `openai:gpt-4.1` (vision) |
| **Document parse** (pre-approval/inspection) | doc/image | `gemini-2.5-flash` (1M ctx) | → `gemini-2.5-pro` → `claude-sonnet-4-6` |
| Autonomous plan / reflection | text+tools | `deepseek-chat` (sub-steps); `openai:gpt-4.1` (orchestrator) | → `claude-sonnet-4-6` → **`claude-opus-4-8` (LAST)** |
| Negotiation strategy (marquee, hardest) | text | `openai:gpt-4.1` | → `claude-sonnet-4-6` → **`claude-opus-4-8`** |
| Embeddings | text | **pinned** `gemini:text-embedding-004` `verify` | (single provider per index — never round-robined) |

**Routing rule:** start at the cheapest tier whose capability flags satisfy the task (`vision` forces Gemini; `needsStrictJSON` favors OpenAI; high `complexity` shifts the start tier up), then escalate only on failure or low confidence. **Anthropic is never the starting tier** except by explicit `forceTier:"premium"` (the demo super-user's "use the best" toggle) or `complexity:"hard"` after cheaper tiers fail.

### 8.3 Fallback & escalation strategy

Two orthogonal axes; Anthropic last on both.

- **Availability failover** (provider down / 429 / timeout): ordered candidate list; on a hard failure advance to the next. Per-provider retry budget 1–2 (expo backoff + jitter) on 429/5xx, then move on. **Circuit breaker** per provider (open after N consecutive failures; half-open probe after cooldown) so a down Groq doesn't add latency to every request. Set the **Anthropic SDK `max_retries=1`** so the router's own ladder owns failover rather than the SDK silently burning time on the most expensive provider.
- **Quality escalation** (succeeds but bad): escalate when (1) schema/JSON invalid — first re-ask the *same* provider once with the validation error appended, then climb; (2) self-reported `confidence < 0.6`; (3) refusal / empty / truncated — for Anthropic, check `stop_reason` before reading `content`; (4) numeric sanity fails (negative cap rate, price out of band). **Bounded to one quality-escalation hop by default**; reaching Anthropic requires `complexity:"hard"` or a `premium`-eligible second hop.

Canonical ladder: `Groq → DeepSeek → Gemini(if multimodal) → OpenAI → claude-haiku-4-5 → claude-sonnet-4-6 → claude-opus-4-8`. Most text tasks never reach Anthropic — that is the point.

### 8.4 Unified `LLMClient` interface + embeddings

```ts
type Provider = "groq"|"deepseek"|"gemini"|"openai"|"anthropic";
type Modality = "text"|"vision"|"embedding";
type Complexity = "trivial"|"light"|"reasoning"|"hard";

interface LLMRequest {
  task: TaskType; messages: ChatMessage[];
  complexity: Complexity; modality: Modality;
  images?: ImageRef[];           // presence ⇒ forces vision-capable provider (Gemini first)
  tools?: ToolDef[]; jsonSchema?: JSONSchema;  // presence ⇒ prefer strict-JSON providers
  forceTier?: "premium";         // demo super-user "use the best" override
  maxEscalations?: number;       // default 1
  stream?: boolean; cacheKey?: string;
  maxUsd?: number;               // per-call cap
}
interface LLMResult {
  text: string; json?: unknown; toolCalls?: ToolCall[];
  usage: { inputTokens:number; outputTokens:number; costUSD:number };
  meta: { provider:Provider; model:string; latencyMs:number; escalations:number; confidence?:number; cached:boolean };
}
interface LLMClient {
  chat(req: LLMRequest): Promise<LLMResult>;
  stream(req: LLMRequest): AsyncIterable<LLMChunk>;   // live timeline + copilot
  withTools(req: LLMRequest): Promise<LLMResult>;     // runs the tool loop, returns final
  vision(req: LLMRequest): Promise<LLMResult>;        // images required → Gemini
  embed(texts: string[], opts?: { index: string }): Promise<number[][]>;
}
```

Each provider has an **adapter** translating the neutral request to its SDK shape (Groq/DeepSeek/OpenAI via OpenAI-compatible REST; Gemini via Google GenAI SDK; **Anthropic via the official `@anthropic-ai/sdk`, never a shim**) and normalizing back to `LLMResult`. The **router** sits above adapters and drives the §8.3 loop. Agents only touch `LLMClient` (provider-agnostic except via `forceTier`).

**Anthropic adapter (the one premium path):**

```ts
// lib/llm/providers/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({ maxRetries: 1 });   // ANTHROPIC_API_KEY from env; router owns failover

async function anthropicComplete(req: LLMRequest): Promise<LLMResult> {
  const stream = client.messages.stream({
    model: "claude-opus-4-8",                       // exact ID; no date suffix
    max_tokens: 16000,
    thinking: { type: "adaptive" },                 // adaptive only on Opus 4.8 (budget_tokens 400s)
    output_config: req.jsonSchema
      ? { effort: "high", format: { type: "json_schema", schema: req.jsonSchema } }
      : { effort: "high" },                          // drop to "low" for cheap Claude calls
    system: [{ type: "text", text: ORCHESTRATOR_SYSTEM, cache_control: { type: "ephemeral" } }],
    messages: req.messages,
  });
  for await (const ev of stream) { /* map text deltas → AgentEvent token channel */ }
  const msg = await stream.finalMessage();
  return { text: extractText(msg), json: undefined,
           usage: cost(msg.usage, { in: 5, out: 25 }),      // Opus 4.8 = $5/$25 per MTok
           meta: { provider:"anthropic", model:"claude-opus-4-8", latencyMs:0, escalations:0, cached:false } };
}
```

**Embeddings are pinned, never routed.** Mixing providers/dimensions in one pgvector column makes vectors incomparable. Default: `gemini:text-embedding-004` `verify current` → `vector(768)`. `embed()` is the only path that writes `listings.embedding` / `neighborhoods.embedding` / query vectors; it batches and caches by content hash. Switching providers = full backfill, so the choice is semi-permanent (`EMBEDDING_MODEL` + `EMBEDDING_DIM` in config).

### 8.5 Cost controls

- **Cheap-first is the default, not the fallback.** Every task starts at the lowest capable tier; Anthropic is reached only by complexity tag, exhausted escalation, or the demo override.
- **Three caching layers:** (1) exact-response cache keyed by `hash(task+messages+model)` with TTL — high-repeat low-volatility answers (neighborhood summaries, "good deal?" per listing, commute) served from cache, never re-billed; (2) optional semantic cache (embed the query, reuse a cosine-similar prior answer) for the NL search bar; (3) **Anthropic prompt caching** (`cache_control:{type:"ephemeral"}`) on the stable system prompt — keep volatile content (timestamps, per-request IDs) **after** the breakpoint or the cache silently misses.
- **Capping Anthropic:** daily spend ledger (`LLM_ANTHROPIC_DAILY_USD_CAP`); on breach, **drop Anthropic from all candidate lists** for the window (escalation tops out at OpenAI). Per-request gate: Anthropic reachable only if `complexity==="hard"` OR `forceTier==="premium"` OR cheaper tiers genuinely exhausted. Enter at `claude-haiku-4-5` ($1/$5) → `claude-sonnet-4-6` ($3/$15) → `claude-opus-4-8` ($5/$25) — Opus is the genuine last token spent.
- **Right-size every call** (`max_tokens`: classify ~256, analysis ~2–4K); never send a 1-line classification to a reasoning model.
- **Observe everything:** log `{provider, model, task, tokens, costUSD, escalations, cached, latency}` per call → feeds the demo's cost meter and proves the cheap-first policy works.

---

## 9. Streaming (SSE)

Two SSE channels off the same orchestrator run, multiplexed by `channel`, from a Next.js Route Handler (Node runtime) returning a `ReadableStream` with `Content-Type: text/event-stream`.

```ts
// app/api/agent/run/route.ts  (Node runtime; extended maxDuration)
export async function POST(req: Request) {
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const emit = (e: AgentEvent) =>
        controller.enqueue(enc.encode(`event: agent\ndata: ${JSON.stringify(e)}\n\n`));
      runAutonomous(goal, ctx, emit).finally(() => controller.close());
    },
  });
  return new Response(stream, {
    headers: { "content-type":"text/event-stream", "cache-control":"no-cache", connection:"keep-alive" },
  });
}
```

- **Timeline channel:** discrete `AgentEvent`s (steps/tools/reflection). Client keeps an ordered list keyed by `seq`; on reconnect it fetches `GET /api/agent/run/[id]` (server buffers/persists recent events per `runId`) then tails live — SSE has no native replay.
- **Chat channel:** partial token streaming for the final synthesis and conversational replies — `type:"token"` deltas mapped from each provider's native stream (Anthropic: `client.messages.stream(...)` deltas).
- **Cost meter:** `provider` + `usd` on events feed a subtle live "running on Groq · $0.012" badge.
- **Vercel note:** agent/stream routes run on the **Node runtime with extended `maxDuration`**, keep heartbeats, and persist run+steps so runs are replayable/continuable across function timeouts.

---

## 10. Multimodal Inputs

### 10.1 Image upload → vibe / similar search
```
user drops photo → upload to object store → imageRef
  → analyzeImageForVibe(imageRef)            [Gemini vision]  → { vibeTerms, styleTags, embedding }
  → semanticSearch({ vibeQuery: vibeTerms.join(" "), filters }) [pgvector]
       ↳ if Gemini returns an image embedding in the photos space, kNN directly on photos.embedding;
         else embed vibeTerms via the pinned text embedder and kNN on listings.embedding
  → Search agent ranks + explains "matches the warm, mid-century vibe you uploaded"
```
Pairs with text ("like this but single-story under $600k"). Entry points: gallery chip, lightbox "Analyze these photos", copilot image upload, similar-homes carousel.

### 10.2 Document upload → parse → use
```
user uploads pre-approval.pdf / inspection.pdf
  → parseDocument(docRef, docType)           [Gemini multimodal; Anthropic for dense reports]
       ↳ { fields, risks[], summary }
  → Document-Reader hands facts to:
        • Finance agent (pre_approval → maxAffordable, rate, lender; flag "expires in 12 days")
        • Market agent  (inspection → risk-adjust valuation / deal verdict)
  → facts cached in agent_facts so later turns reuse them ("your pre-approval is $720k")
```
PII: parsed doc fields are stored per-user, **never embedded into the public listing vector space**, never placed in shared prompt prefixes.

### 10.3 Voice
Browser `MediaRecorder` → `POST /api/voice` → cheap STT (Groq Whisper-class) → transcribed text enters the normal intent pipeline (treated as just another text turn). Output optionally spoken via Web Speech API.

---

## 11. Auth — Guest-first + Demo Super-User

- **Guest-first:** every visitor gets a signed, httpOnly cookie `az_guest` (random token) on first request via middleware. Browse, search, and the **full agent experience work with zero account**. Saves/searches/chat persist against `guest_token`.
- **Optional sign-in:** lightweight email magic-link (or dev-mode "just type an email") creates/links a `users` row. On sign-in, **claim** guest-owned `saved_homes`, `saved_searches`, `collections`, `conversations` by setting `user_id` and clearing `guest_token`.
- **Demo super-user:** seeded row `is_demo=true` (`demo@allmyai.ai`), reachable via a one-click "Enter demo account" button. Pre-populated with curated saves, collections, saved searches with alerts, uploaded docs, finance profile, prior conversations — plus an **Agent Showcase launcher** ("Run the full autonomous flow") and a **model-router debug panel** (which provider handled each step + cost per step; toggle "show reasoning"). Can be exempted from the Anthropic daily cap for showcasing.
- **Session lib:** `lib/auth/session.ts` resolves `{ userId | guestToken, isDemo }` on the server for every request; Server Actions and Route Handlers call it to scope all reads/writes. Intentionally simple — no heavyweight auth provider.

---

## 12. API Routes / Server Actions

| Surface | Method | Purpose |
|---|---|---|
| `/api/search` | POST | Hybrid search (filters + optional NL→vector). Returns `{listings, bounds, clusters, total, cursor}`. |
| `/api/listing/[id]` | GET | Listing detail + photos + similar (pgvector) + comps. |
| `/api/agent/run` | POST | **SSE** autonomous/assistive agent run (timeline + tokens). |
| `/api/agent/chat` | POST | **SSE** page-aware copilot chat. |
| `/api/agent/run/[id]` | GET | Replay/reconnect a run's steps. |
| `/api/valuation` | POST | Zestimate-style value + rent estimate + agent explanation. |
| `/api/mortgage` | POST | Deterministic mortgage / affordability (+ optional agent explainer). |
| `/api/image-search` | POST | Vibe/similar-by-photo (Gemini → pgvector). |
| `/api/doc-upload` | POST | Parse pre-approval / inspection (Gemini multimodal). |
| `/api/voice` | POST | STT (Groq Whisper-class) → text turn. |
| `/api/save` | POST/DELETE | Save/unsave home; create collection; save search + alert. |
| `/api/neighborhood/[id]` | GET | Schools, commute, walk/transit scores, AI summary. |

**Server Actions** (co-located with pages, for SSR first paint + form mutations): `saveHome`, `createCollection`, `saveSearch`, `claimGuestData`, `submitSellListing`, `requestTour` (simulated). Use Server Actions for first-paint SSR search and forms; use Route Handlers for streaming and anything called repeatedly from the client (map re-query, agent stream).

**Single source of truth for search state** — `status`, `filters`, `boundary`, `sort`, `page`, `hoveredListingId`, `selectedListingId`, `searchAsIMove`, `mapStyle` — all URL-encoded and read/written by map ↔ list ↔ filter bar ↔ copilot, so the agent changing a filter, a user dragging the map, and the sort dropdown are all the *same* operation surface (which is what lets the agent visibly "drive the UI").

---

## 13. Map Integration (Mapbox GL)

- **Base style:** light, low-saturation (Mapbox `light-v11`, further desaturated) so listing pins pop; brand controls in Zillow blue.
- **Marker strategy:** GeoJSON source with `cluster: true` + a circle layer sized by `point_count` at low zoom; switch to custom HTML **price-bubble markers** (`PriceBubble.tsx` — rounded pill, `$1.2M`, tabular numerals) at high zoom via `clusterMaxZoom`. For hundreds of points, render DOM bubbles **only for the visible viewport**; use circle/symbol layers below the bubble threshold.
- **Pin states:** unviewed (blue or white-pill blue-text), viewed (dimmed gray), saved (filled-heart accent), active/hovered (scale up, raise z-index, `--shadow-md`).
- **List ↔ map sync:** shared `hoveredListingId` in client state — hovering a card emphasizes its pin and vice-versa; clicking a pin scrolls the matching card into view and opens a mini-card popover. Map `moveend` → `map.getBounds()` → re-issue `/api/search` with new `{north,south,east,west}` (debounced; honors "Search as I move the map" toggle, else shows a floating "Search this area" button).
- **Draw-to-search:** `@mapbox/mapbox-gl-draw`; on `draw.create`/`draw.update`, send the polygon as a `polygon` filter, lock viewport-bounds logic while a custom region is active, show a "Remove boundary" pill. Drawn region: translucent blue fill `rgba(0,106,255,0.12)` + 2px dashed `#006AFF` border.
- **Overlays / controls:** boundary/neighborhood/school-zone overlays; satellite toggle; zoom ± + geolocate (bottom-right); "Search as I move" checkbox (top-left). **Agentic add-on:** the live timeline can drop temporary highlight pins as the agent "searches" (reuse the active-pin style with a sparkle accent).
- **Token:** `NEXT_PUBLIC_MAPBOX_TOKEN` (public, URL-restricted).

---

## 14. Deployment & Env Vars

### Deploy
- **Vercel** for Next.js. Agent/stream routes → **Node runtime + extended `maxDuration`**; search/listing routes can be edge or Node. Run Drizzle migrations on deploy.
- **Neon** (or Supabase) hosted Postgres with **pgvector** enabled. Use the **pooled** connection string for serverless functions; the unpooled string for migrations/seeding.
- Photo URLs served straight from Unsplash/Pexels CDNs (store URLs, don't re-host); keep attribution.

### Env vars (`.env.example`)
```bash
# Database
DATABASE_URL=postgres://.../neondb?sslmode=require        # pooled (serverless)
DATABASE_URL_UNPOOLED=postgres://.../neondb               # migrations/seeding

# Maps
NEXT_PUBLIC_MAPBOX_TOKEN=pk....

# Photo sources
UNSPLASH_ACCESS_KEY=...
PEXELS_API_KEY=...

# LLM providers (cost-ordered policy lives in code, not env)
GROQ_API_KEY=...
DEEPSEEK_API_KEY=...
GEMINI_API_KEY=...            # Google AI Studio / GenAI
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...         # premium fallback — do NOT also set ANTHROPIC_AUTH_TOKEN (both ⇒ 401)

# Routing policy
LLM_DEFAULT_TIER=0
LLM_MAX_ESCALATIONS=1
LLM_ANTHROPIC_DAILY_USD_CAP=25
EMBEDDING_MODEL=gemini:text-embedding-004    # pinned · verify current
EMBEDDING_DIM=768
LLM_CACHE_TTL_S=86400

# App
AUTH_SECRET=...               # signs guest/session cookies
APP_URL=https://...
DEMO_USER_EMAIL=demo@allmyai.ai
```

`MODEL_REGISTRY` (single source of truth for IDs + prices) lives in `lib/llm/router.ts`; only the **Anthropic rows are authoritative** (`claude-haiku-4-5` $1/$5, `claude-sonnet-4-6` $3/$15, `claude-opus-4-8` $5/$25) — every other row is `verify current` before launch.

---

## 15. Build Order / Milestones (everything in v1)

1. **M0 — Foundations.** Next.js + TS + Tailwind with Zillow blue tokens; DB client + Drizzle schema + migrations; `vector`/`pg_trgm` extensions; env wiring; guest-first session + seeded demo user.
2. **M1 — Data.** Synthetic listing generator across the 5 metros; photo fetcher (Unsplash/Pexels + attribution + caching); embedding backfill; agents/lenders + neighborhoods/schools seed; demo-user curated content.
3. **M2 — Zillow clone shell.** Header/footer/nav, home + NL search bar, buy/rent/sell/off-market pages, listing card + HDP, filter bar, account/saved/compare shells — pixel-faithful, light theme.
4. **M3 — Map + hybrid search.** Mapbox canvas (clusters + price bubbles), bounds sync, draw-to-search; `/api/search` hybrid (filters + pgvector); list↔map two-way sync; URL-encoded search state.
5. **M4 — Tool catalog + deterministic tools.** `searchListings`, `mortgageCalc`, `getComps`, `estimateValue`, `rentEstimate` — fully testable without any LLM.
6. **M5 — LLM router + embeddings.** `lib/llm` abstraction, cost ladder, all five provider adapters (Anthropic via official SDK), graceful fallback + circuit breaker; intent classifier on Groq; pinned embeddings.
7. **M6 — Assistive orchestrator + streaming.** Orchestrator + inline listing AI ("Is this a good deal?") + NL search bar wired to hybrid search; SSE + Live Activity Timeline (event schema, reconnect/replay); persistent copilot dock + FAB.
8. **M7 — Specialist agents.** Search, Market/Investment, Finance/Mortgage, Tour/Concierge, Neighborhood, Comparison.
9. **M8 — Autonomous mode.** plan→act→observe→reflect loop, budgets, confirmation gates, Autopilot toggle, demo super-user canned scenarios; shortlist action + collections + star-pin treatment.
10. **M9 — Multimodal + Negotiation + feed.** Image-vibe (Gemini → pgvector), document parse, voice; Negotiation agent on the premium (OpenAI/Anthropic) tier + simulated tour/offer actions; proactive feed (price drops, new matches via saved-search alerts); cost-routing visibility in the timeline.
11. **M10 — Persistence & accounts.** Saved homes + collections, saved searches + alerts, compare, magic-link sign-in + guest-data claim, account/agent-mode settings.
12. **M11 — Deploy & harden.** Vercel + Neon, migrations on deploy, `maxDuration`/heartbeat tuning for streaming, photo attribution + rate-limit caching, final Zillow-parity QA pass, demo disclaimer.

### Stretch ideas (post-v1)
- **Voice-first agent** (continuous conversation with spoken timeline narration via Web Speech API).
- **Saved-search alert cron** that runs autonomous *find → score → shortlist → digest* off the interactive path on cheap tiers (Anthropic Batch at 50% if it ever reaches that tier).
- **Live comp map** — neighborhood appreciation heatmap overlay.
- **Multi-home autonomous "buy-box" investment scan** across all 5 metros at once.
- **AR / 3D-tour stub** ("walk this home") as a simulated showcase surface.
- **Semantic cache hit-rate dashboard** in the demo router panel.
- **Shareable agent-run replays** — a public link that re-streams a recorded timeline for portfolio show-and-tell.

---

**Key load-bearing facts for the implementer:**
- **`claude-opus-4-8` ($5 in / $25 out per MTok, adaptive thinking, no `budget_tokens`/sampling params, stream large outputs, prompt-cache the system prompt) sits at the top of the cost ladder and is invoked LAST** — reserved for the Negotiation agent and hardest-reasoning fallbacks only, behind a daily cap. Within the Anthropic tier, enter at `claude-haiku-4-5` ($1/$5) → `claude-sonnet-4-6` ($3/$15) → `claude-opus-4-8` ($5/$25).
- All Anthropic IDs/prices/context above are authoritative; every Groq/DeepSeek/Gemini/OpenAI ID and price is **`verify current`** against the live pricing page before launch.
- **Math/financial tool bodies are deterministic code, never the LLM** (anti-hallucination); valuation/comps **cite their drivers/comps** so claims are grounded in retrieved data.
- Embeddings are **pinned** to one model + dimension (`vector(768)`); never routed or round-robined.
- All real-world actions (`scheduleTour`/`draftOffer`/`submitOffer`, pre-qual, applications) return `simulated_*` status objects behind confirmation gates — UI badges every such result "Simulated for demo."
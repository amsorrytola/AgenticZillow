Primary action control for AgenticZillow — Zillow-blue fill by default; use it for any button on a Zillow-faithful surface.

```jsx
<Button variant="primary">Request a tour</Button>
<Button variant="secondary">Contact agent</Button>
<Button variant="ghost" size="sm">Skip</Button>
<Button variant="agentic" pill iconLeft={<span>✦</span>}>Ask AgenticZillow</Button>
```

Variants: `primary` (blue fill), `secondary` (blue outline on white), `ghost` (transparent blue text), `text` (link-like), `destructive` (magenta), `agentic` (blue→violet gradient — reserve for the single branded AI doorway). Sizes `sm | md | lg`; `pill` for full-radius hero CTAs; `block` to fill width.

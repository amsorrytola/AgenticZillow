Map price-bubble pin for the search map. State encodes whether a listing is unviewed, viewed, saved, or agent-shortlisted.

```jsx
<PriceBubble price="$625K" />
<PriceBubble price="$540K" state="viewed" />
<PriceBubble price="$710K" state="saved" />
<PriceBubble price="$489K" state="shortlisted" />
```

Hover/active should scale to 1.08 and raise z-index (handled by the map layer).

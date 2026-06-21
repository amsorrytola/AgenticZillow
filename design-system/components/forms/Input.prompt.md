Text input for search and forms — leading icon, optional clear button, error state, Zillow-blue focus ring.

```jsx
<Input iconLeft={<SearchIcon />} placeholder="Address, neighborhood, city, or ZIP" clearable value={q} onChange={...} onClear={...} />
<Input error placeholder="Email" />
```

40px default, `size="lg"` for 44px (search). Pair with helper text in `--error` when `error`.

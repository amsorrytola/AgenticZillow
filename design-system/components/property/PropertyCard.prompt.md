The most important AgenticZillow component — the Zillow listing card. Photo with status tag + save heart, big tabular price, meta line, address, and a hover-revealed agentic deal chip.

```jsx
<PropertyCard
  photo="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600"
  status="for-sale" price="$625,000"
  beds={4} baths={3} sqft="2,150" homeType="House"
  address="1234 Pearl St, Austin, TX 78701"
  photoCount="1/24" saved={false} onSave={...}
  attribution="Listing provided by Acme Realty"
/>
```

Price is a pre-formatted string (handles "$2,400/mo" rentals). `agentic={false}` hides the deal chip for a pure Zillow look. Whole card is clickable to a detail page.

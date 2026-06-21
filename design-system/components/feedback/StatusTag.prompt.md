Status pill for property cards/detail — colored dot + text label. Sits top-left over the photo.

```jsx
<StatusTag status="for-sale" />
<StatusTag status="new" />
<StatusTag status="pending" label="Contingent" />
```

Color map: For Sale=green, Pending=amber, Coming Soon=violet, New/3D Tour=blue, Sold=gray. Always keeps the text label for accessibility.

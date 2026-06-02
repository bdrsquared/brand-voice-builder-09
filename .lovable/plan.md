Update the rounding helper in `src/pages/PricingRenewals.tsx` from nearest 10 to nearest 50.

- Rename `round10` → `round50` (or just change the divisor) so `Math.round(n/50)*50` is applied inside `convert`.
- All downstream displays (GBP, USD, EUR) inherit the new rounding automatically — no other logic changes.

Resulting examples (6-month term, GBP):
- 1 ep/mo: Location £3,500 | Studio £2,650 → £2,650 | Virtual £2,250
- 2 ep/mo: Location £5,950 | Studio £4,505 → £4,500 | Virtual £3,825 → £3,800
- 4 ep/mo: Location £9,980 → £10,000 | Studio £7,553 → £7,550 | Virtual £6,413 → £6,400

No copy, tier, multiplier, or term-discount changes.
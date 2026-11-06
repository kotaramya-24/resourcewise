---
name: need-matching-rules
description: How needs are matched to items, and the seed "available" = confirmed assumption
metadata:
  type: project
---
A need matches only one listing: same category, a different school, confirmed (seed "available" items count as confirmed; "submitted" items never match), quantity ≥ what's still needed, and condition ≥ the need's minimum. Anything else shows "No match" with a reason. No partial matches.
**Why:** the user said "Never force a match"; all seed items are "available", so strict confirmed-only would match nothing.
**How to apply:** keep bestMatch strict; the seed should give 18 matches / 4 short on quantity / 3 short on condition / rest none (per data README).

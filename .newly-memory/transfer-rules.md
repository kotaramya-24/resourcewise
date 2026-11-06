---
name: transfer-rules
description: How claims hold stock and when an item becomes "transferred"
metadata:
  type: project
---
A claim only holds stock (available = quantity − pending/approved claims). Flow: claim → giving school approves → both schools' approvers verify the handoff → claim "transferred", item quantity reduced; item status becomes "transferred" only when its quantity hits 0.
**Why:** the user asked for both schools to verify before status/quantity change; partial transfers keep leftover stock claimable (my assumption).
**How to apply:** never decrement item.quantity at claim time; use availableQuantity() for what's claimable and for matching.

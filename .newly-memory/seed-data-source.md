---
name: seed-data-source
description: "Which attached files the app's Schools/Items/Needs tables come from, and the rule that values stay unchanged"
metadata:
  node_type: memory
  type: project
  originSessionId: 323eed6e-3b39-4883-a0a6-269aab5f4538
  modified: 2026-11-06T18:57:50.840Z
---

The tables are loaded verbatim from resourcewise_seed_data-1.xlsx: Schools 10, Items 60, Needs 50 (30 from Needs plus 20 from Needs_Extra, identical to needs_extra.csv). The user asked that no values be changed. The Items columns expiry and eval_only are not stored because they aren't in the user's table spec. security_cases.csv is test data and is never loaded.

**Why:** the user asked to load the attached data with no values changed. The home screen shows the three table counts.
**How to apply:** regenerate seed.ts from the workbook rather than hand-editing it. If the seed changes, bump the persist version in exchange-store so devices reload it.

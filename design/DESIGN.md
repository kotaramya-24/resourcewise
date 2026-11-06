# ResourceWise — design plan

## Ground

- **Subject:** surplus classroom supplies moving between 10 schools (paper & writing,
  books & learning, STEM & tech).
- **Who:** a school's supply lister or approver (a teacher, office manager, librarian),
  checking between classes on their phone.
- **Core action:** claim a surplus item for your school (often against one of your needs).
- **Moment of use:** a 5-minute gap: scan what's out there, filter to what fits, claim it.

## Three directions

1. **Supply closet** — white page, chalkboard-green accent, three category colors borrowed
   from the materials themselves (pencil yellow, ruled-line blue, beaker violet); photo-led
   rows. Calm, legible, clean.
2. **Library card catalog** — kraft card stock, typewriter mono, stamped due dates. Charming
   but heavy; fights "clean and simple".
3. **Lab bench** — dark slate, neon data, SF Mono everywhere. Reads as a dev tool, not a
   school tool.

**Picked 1.** The user asked for clean and simple; the category colors carry identity
without decoration. 2 lost on density, 3 on audience.

## Palette (tokens in src/global.css)

| Name            | Hex      | Token                    | Use                                  |
| --------------- | -------- | ------------------------ | ------------------------------------ |
| Chalkboard      | #2E6B52  | `--accent`               | actions, selected tab, claim stamp   |
| Pencil yellow   | #D9971C  | `--color-paper-writing`  | paper_writing category               |
| Ruled-line blue | #3A6CC0  | `--color-books-learning` | books_learning category              |
| Beaker violet   | #7A55C8  | `--color-stem-tech`      | stem_tech category                   |
| Eraser pink     | #D9566F  | `--color-eraser`         | needs-repair condition, short warns  |

Dark mode: background/surface from HeroUI's dark set; accent lifts to #5FB08A.

## Type

SF Pro throughout. Quantities are large, bold, tabular numerals next to their unit
("27 reams"). Category is a colored dot + sentence-case label, never all-caps chips.

## Imagery

One photographic style for all 60 items: the actual supply, overhead-ish, on a pale
birch classroom table, soft window light, shallow depth, no people, no text. Bundled in
assets/images/items/<photo_file>.

## Shell

```
┌──────────────────────────────┐
│ Supplies           [S01 ▾]   │  large title + "acting as" school pill
│ [School ▾][Category ▾][Cond ▾]│  filter pills (sheet picker)
│ ┌──┐ Copy paper, letter size │
│ │📷│ Maple Grove · usable    │  photo-led rows, qty on the right
│ └──┘                  27 ream│
│  … scrolls under the bar …   │
├──────────────────────────────┤
│ ◉ Supplies  ◯ Needs  ◯ School│  Liquid Glass native tabs
└──────────────────────────────┘
```

Tabs: Supplies (shippingbox), Needs (hand.raised), My school (building.columns).
Pushed: item detail, need detail. Sheets: filter picker, list item, post need.

### Supplies — first screen, two ways

A) category tiles grid on top, list below → a stat-grid opener (default look #4). Dropped.
B) **straight into the photo list** with filter pills; the supply itself is the thesis. Kept.

### Item detail
```
[ full-width photo ]
‹ back
Copy paper, letter size
● Paper & writing · Maple Grove Elementary
27 reams available        condition: usable
description
[ –  3  + ]  For need: [none ▾]
[        Claim 3 reams        ]
```

### Needs
Rows: description, school, qty + needed-by date, and a match line in its state color:
"Match: Fraction tiles · Granite Peak" / "Partial: only 14 available" / "No match yet".

### My school
School switcher (acting as), incoming claim requests (Approve / Decline), my requests,
my listings, my needs, "List surplus item", "Post a need".

## Signature moment

**The claim stamp.** Tapping Claim: the available quantity on the detail counts down to its
new value, a chalkboard-green "CLAIMED" stamp presses onto the photo (scale 1.15 → 1, fade
in, slight tilt) and a success haptic fires. Fully claimed items read "All claimed".
Celebration: when a need becomes fully covered, the need detail shows "Need covered" once.

Motion dial: standard (timing tokens only).

## Unmistakable

Every supply shows up as itself, a real photo tagged with its material color, and claiming
it feels like stamping a requisition slip.

## Plan check

The first sketch opened on stat tiles (default #4) and used the starter's magenta; changed
to the photo list and the chalkboard accent. Seed data comes from the user's workbook.

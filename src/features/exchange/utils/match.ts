import type { Claim, Item, Need, NeedMatch } from '@/features/exchange/types/exchange';
import { meetsCondition } from '@/features/exchange/utils/labels';

const LEAD_INS = [
  'our classrooms need ',
  'our classroom needs ',
  'we need ',
  'looking for ',
  'seeking ',
  'requesting ',
];

function normalize(text: string): string {
  let t = text.toLowerCase().trim();
  for (const lead of LEAD_INS) {
    if (t.startsWith(lead)) t = t.slice(lead.length);
  }
  return t.replace(/\s+/gu, ' ').replace(/[.]+$/u, '').trim();
}

/** A need and an item describe the same thing when one's wording contains the other's. */
export function describesSameThing(need: Need, item: Item): boolean {
  const desc = normalize(need.description);
  const title = normalize(item.title);
  if (!desc || !title) return false;
  return desc.includes(title) || title.includes(desc);
}

export function coveredQuantity(need: Need, claims: Claim[]): number {
  return claims
    .filter((c) => c.need_id === need.need_id && c.status !== 'declined')
    .reduce((sum, c) => sum + c.quantity, 0);
}

export function remainingQuantity(need: Need, claims: Claim[]): number {
  return Math.max(0, need.quantity - coveredQuantity(need, claims));
}

const KIND_ORDER = { exact: 0, partial_quantity: 1, partial_condition: 2, none: 3 } as const;

/** Candidate items for a need, best first: other schools' available stock of the same thing. */
export function candidatesFor(need: Need, items: Item[], claims: Claim[]): NeedMatch[] {
  const remaining = remainingQuantity(need, claims);
  return items
    .filter(
      (it) =>
        it.category === need.category &&
        it.school_id !== need.school_id &&
        it.status === 'available' &&
        it.quantity > 0 &&
        describesSameThing(need, it),
    )
    .map((it): NeedMatch => {
      if (!meetsCondition(it.condition, need.min_condition)) return { kind: 'partial_condition', item: it };
      if (it.quantity < remaining) return { kind: 'partial_quantity', item: it };
      return { kind: 'exact', item: it };
    })
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || (b.item?.quantity ?? 0) - (a.item?.quantity ?? 0));
}

export function bestMatch(need: Need, items: Item[], claims: Claim[]): NeedMatch {
  return candidatesFor(need, items, claims)[0] ?? { kind: 'none', item: null };
}

/** Open needs of `schoolID` that this item could fill. */
export function needsFillableBy(item: Item, needs: Need[], schoolID: string): Need[] {
  return needs.filter(
    (n) => n.school_id === schoolID && n.status === 'open' && n.category === item.category && describesSameThing(n, item),
  );
}

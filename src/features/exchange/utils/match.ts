import type { Claim, Item, Need, NeedMatch } from '@/features/exchange/types/exchange';
import {
  categoryLabel,
  conditionLabel,
  conditionRank,
  meetsCondition,
  pluralUnit,
  shortSchoolName,
} from '@/features/exchange/utils/labels';
import { isClaimable } from '@/features/exchange/utils/review';

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

const KIND_ORDER = { exact: 0, partial_quantity: 1, partial_condition: 2, awaiting_confirmation: 3, none: 4 } as const;

/** Seed listings never went through review, so they count as confirmed. New items must be confirmed first. */
function isConfirmed(item: Item): boolean {
  return isClaimable(item);
}

function kindFor(need: Need, item: Item, remaining: number): NeedMatch['kind'] {
  if (item.status === 'submitted') return 'awaiting_confirmation';
  if (!meetsCondition(item.condition, need.min_condition)) return 'partial_condition';
  if (item.quantity < remaining) return 'partial_quantity';
  return 'exact';
}

/** Other schools' listings of the same thing, best first. Only 'exact' ones are real matches. */
export function candidatesFor(need: Need, items: Item[], claims: Claim[]): NeedMatch[] {
  const remaining = remainingQuantity(need, claims);
  return items
    .filter(
      (it) =>
        it.category === need.category &&
        it.school_id !== need.school_id &&
        it.quantity > 0 &&
        (it.status === 'submitted' || isConfirmed(it)) &&
        describesSameThing(need, it),
    )
    .map((it): NeedMatch => ({ kind: kindFor(need, it, remaining), item: it }))
    .sort(
      (a, b) =>
        KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
        // Among real matches, take the smallest stock that still covers it, then the better condition.
        (a.kind === 'exact' ? (a.item?.quantity ?? 0) - (b.item?.quantity ?? 0) : (b.item?.quantity ?? 0) - (a.item?.quantity ?? 0)) ||
        conditionRank(b.item?.condition ?? '') - conditionRank(a.item?.condition ?? ''),
    );
}

function noMatchReason(
  need: Need,
  items: Item[],
  candidates: NeedMatch[],
  remaining: number,
  schoolName: (id: string) => string,
): string {
  const at = (item: Item) => shortSchoolName(schoolName(item.school_id));
  const wanted = `${conditionLabel(need.min_condition)} or better`;

  if (candidates.length === 0) {
    const ownOnly = items.some(
      (it) => it.school_id === need.school_id && it.category === need.category && it.quantity > 0 && describesSameThing(need, it),
    );
    if (ownOnly) return 'Only your own school lists this. A match has to come from a different school.';
    return `No other school lists this in ${categoryLabel(need.category)}.`;
  }

  const confirmed = candidates.filter((c) => c.kind !== 'awaiting_confirmation');
  if (confirmed.length === 0) {
    const first = candidates[0]?.item;
    return first
      ? `${at(first)} listed it, but it is still waiting for confirmation.`
      : 'A listing is still waiting for confirmation.';
  }

  const goodEnough = confirmed.filter((c) => c.kind === 'partial_quantity');
  const biggest = goodEnough[0]?.item;
  if (biggest) {
    return `Not enough: ${at(biggest)} has only ${biggest.quantity} ${pluralUnit(biggest.unit, biggest.quantity)} in the right condition, and you need ${remaining}.`;
  }

  const below = confirmed[0]?.item;
  if (!below) return 'Nothing fits yet.';
  return `Condition too low: ${at(below)} has it as ${conditionLabel(below.condition)}, and you need ${wanted}.`;
}

/** The single best match, or 'none' with the reason. Never returns a listing that falls short. */
export function bestMatch(need: Need, items: Item[], claims: Claim[], schoolName: (id: string) => string): NeedMatch {
  const remaining = remainingQuantity(need, claims);
  const candidates = candidatesFor(need, items, claims);
  const best = candidates[0];
  if (best?.kind === 'exact') return best;
  return { kind: 'none', item: null, reason: noMatchReason(need, items, candidates, remaining, schoolName) };
}

/** Open needs of `schoolID` that this item could fill. */
export function needsFillableBy(item: Item, needs: Need[], schoolID: string): Need[] {
  return needs.filter(
    (n) => n.school_id === schoolID && n.status === 'open' && n.category === item.category && describesSameThing(n, item),
  );
}

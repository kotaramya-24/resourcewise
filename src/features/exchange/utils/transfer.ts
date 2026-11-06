import type { Claim, Item } from '@/features/exchange/types/exchange';

/** Claims that hold stock: requested or approved, but not yet handed over. */
export function isOpenClaim(claim: Claim): boolean {
  return claim.status === 'pending' || claim.status === 'approved';
}

export function heldQuantity(item: Item, claims: Claim[]): number {
  return claims.filter((c) => c.item_id === item.item_id && isOpenClaim(c)).reduce((sum, c) => sum + c.quantity, 0);
}

/** What another school can still claim: the listing's stock minus open claims on it. */
export function availableQuantity(item: Item, claims: Claim[]): number {
  return Math.max(0, item.quantity - heldQuantity(item, claims));
}

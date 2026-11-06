import type { DashboardStats, QualityIssue } from '@/features/exchange/types/dashboard';
import type { Claim, Item, Need } from '@/features/exchange/types/exchange';
import { CATEGORIES } from '@/features/exchange/utils/labels';
import { bestMatch, remainingQuantity } from '@/features/exchange/utils/match';
import { confirmProblems, findDuplicates, hasPhoto, isClaimable } from '@/features/exchange/utils/review';
import { availableQuantity } from '@/features/exchange/utils/transfer';

/** An item passes when it clears every confirmation check and is not flagged as a possible duplicate. */
function passesAllChecks(item: Item, items: Item[]): boolean {
  return confirmProblems(item).length === 0 && findDuplicates(item, items).length === 0;
}

export function dashboardStats(
  items: Item[],
  needs: Need[],
  claims: Claim[],
  schoolName: (id: string) => string,
): DashboardStats {
  const open = needs.filter((n) => n.status === 'open' && remainingQuantity(n, claims) > 0);

  const units = CATEGORIES.map((category) => ({
    category,
    surplus: items
      .filter((it) => it.category === category && isClaimable(it))
      .reduce((sum, it) => sum + availableQuantity(it, claims), 0),
    need: open.filter((n) => n.category === category).reduce((sum, n) => sum + remainingQuantity(n, claims), 0),
  }));

  const issues: QualityIssue[] = items
    .map((item) => ({ item, missingPhoto: !hasPhoto(item), duplicateOf: findDuplicates(item, items) }))
    .filter((x) => x.missingPhoto || x.duplicateOf.length > 0);

  return {
    totalItems: items.length,
    passingItems: items.filter((it) => passesAllChecks(it, items)).length,
    // Loaded listings never went through review, so everything not still submitted counts as confirmed.
    confirmedItems: items.filter((it) => it.status !== 'submitted').length,
    submittedItems: items.filter((it) => it.status === 'submitted').length,
    openNeeds: open.length,
    matchedNeeds: open.filter((n) => bestMatch(n, items, claims, schoolName).kind === 'exact').length,
    units,
    issues,
  };
}

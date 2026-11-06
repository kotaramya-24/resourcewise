import { useState } from 'react';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { bestMatch, remainingQuantity } from '@/features/exchange/utils/match';

export type NeedsView = 'open' | 'mine' | 'covered';

export function useNeedsScreen() {
  const needs = useExchangeStore((s) => s.needs);
  const items = useExchangeStore((s) => s.items);
  const claims = useExchangeStore((s) => s.claims);
  const schools = useExchangeStore((s) => s.schools);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const [view, setView] = useState<NeedsView>('open');

  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;

  const rows = needs
    .filter((n) => {
      if (view === 'mine') return n.school_id === activeSchoolID;
      if (view === 'covered') return n.status === 'fulfilled';
      return n.status === 'open';
    })
    .map((need) => ({ need, match: bestMatch(need, items, claims, schoolName), remaining: remainingQuantity(need, claims) }))
    .sort((a, b) => a.need.needed_by.localeCompare(b.need.needed_by));

  const matchedCount = rows.filter((r) => r.match.kind === 'exact').length;

  return { rows, view, setView, schoolName, matchedCount };
}

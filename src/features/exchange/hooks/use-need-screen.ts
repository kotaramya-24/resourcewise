import { router } from 'expo-router';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { candidatesFor, coveredQuantity, remainingQuantity } from '@/features/exchange/utils/match';
import { confirmDelete } from '@/lib/confirm';

export function useNeedScreen(needID: string) {
  const need = useExchangeStore((s) => s.needs.find((n) => n.need_id === needID));
  const items = useExchangeStore((s) => s.items);
  const claims = useExchangeStore((s) => s.claims);
  const schools = useExchangeStore((s) => s.schools);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const removeNeed = useExchangeStore((s) => s.removeNeed);

  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;
  const candidates = need ? candidatesFor(need, items, claims) : [];
  const covered = need ? coveredQuantity(need, claims) : 0;
  const remaining = need ? remainingQuantity(need, claims) : 0;
  const isMine = need?.school_id === activeSchoolID;
  const pledges = claims.filter((c) => c.need_id === needID && c.status !== 'declined');

  const openItem = (itemID: string) =>
    router.push({ pathname: '/item/[id]', params: isMine ? { id: itemID, needID } : { id: itemID } });

  const remove = () =>
    confirmDelete({
      title: 'Remove this need?',
      message: 'Other schools will no longer see it.',
      confirmLabel: 'Remove need',
      onConfirm: () => {
        router.back();
        removeNeed(needID);
      },
    });

  return { need, candidates, covered, remaining, isMine, pledges, schoolName, openItem, remove, items };
}

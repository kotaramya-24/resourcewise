import { router } from 'expo-router';
import { useState } from 'react';
import { Presets } from 'react-native-pulsar';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { needsFillableBy, remainingQuantity } from '@/features/exchange/utils/match';
import { confirmDelete } from '@/lib/confirm';

export function useItemScreen(itemID: string, presetNeedID: string | null) {
  const item = useExchangeStore((s) => s.items.find((i) => i.item_id === itemID));
  const schools = useExchangeStore((s) => s.schools);
  const needs = useExchangeStore((s) => s.needs);
  const claims = useExchangeStore((s) => s.claims);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const claimItem = useExchangeStore((s) => s.claimItem);
  const removeItem = useExchangeStore((s) => s.removeItem);

  const fillable = item ? needsFillableBy(item, needs, activeSchoolID) : [];
  const initialNeed = fillable.find((n) => n.need_id === presetNeedID) ?? fillable[0] ?? null;
  const initialQty = item
    ? Math.max(1, Math.min(item.quantity, initialNeed ? remainingQuantity(initialNeed, claims) || 1 : 1))
    : 1;

  const [needID, setNeedID] = useState<string | null>(initialNeed ? initialNeed.need_id : null);
  const [quantity, setQuantity] = useState(initialQty);
  const [error, setError] = useState<string | null>(null);
  const [stampCount, setStampCount] = useState(0);
  const [stampLabel, setStampLabel] = useState('');

  const school = schools.find((s) => s.school_id === item?.school_id);
  const activeSchool = schools.find((s) => s.school_id === activeSchoolID);
  const isOwn = item?.school_id === activeSchoolID;
  const available = item?.quantity ?? 0;
  const myClaims = claims.filter((c) => c.item_id === itemID && c.to_school_id === activeSchoolID && c.status !== 'declined');

  const step = (delta: number) => {
    setError(null);
    setQuantity((q) => Math.max(1, Math.min(Math.max(available, 1), q + delta)));
  };

  const selectNeed = (id: string | null) => {
    setNeedID(id);
    const need = fillable.find((n) => n.need_id === id);
    if (need) setQuantity(Math.max(1, Math.min(available, remainingQuantity(need, claims) || 1)));
  };

  const claim = () => {
    const result = claimItem({ itemID, quantity, needID });
    if (!result.ok) {
      Presets.System.notificationWarning();
      setError(result.error);
      return;
    }
    Presets.System.notificationSuccess();
    setError(null);
    setStampLabel(`${result.claim.quantity} for ${activeSchool?.name ?? 'your school'}`);
    setStampCount((c) => c + 1);
    setQuantity(1);
  };

  const remove = () =>
    confirmDelete({
      title: 'Remove this listing?',
      message: 'Other schools will no longer see it.',
      confirmLabel: 'Remove listing',
      onConfirm: () => {
        router.back();
        removeItem(itemID);
      },
    });

  return {
    item,
    school,
    isOwn,
    available,
    fillable,
    needID,
    selectNeed,
    quantity,
    step,
    claim,
    error,
    stampCount,
    stampLabel,
    myClaims,
    remove,
    remainingFor: (id: string) => {
      const n = needs.find((x) => x.need_id === id);
      return n ? remainingQuantity(n, claims) : 0;
    },
  };
}

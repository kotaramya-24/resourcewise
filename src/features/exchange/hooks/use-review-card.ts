import { useState } from 'react';
import { Presets } from 'react-native-pulsar';

import { SCHOOL_STAFF } from '@/features/exchange/data/staff';
import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import type { Item } from '@/features/exchange/types/exchange';
import { findDuplicates, hasPhoto, isAllowedCategory } from '@/features/exchange/utils/review';

export function useReviewCard(item: Item) {
  const items = useExchangeStore((s) => s.items);
  const confirmItem = useExchangeStore((s) => s.confirmItem);
  const [errors, setErrors] = useState<string[]>([]);

  const approver = SCHOOL_STAFF[item.school_id]?.approver ?? 'Approver';
  const duplicates = findDuplicates(item, items);
  const checks = [
    { label: 'Photo attached', ok: hasPhoto(item) },
    { label: 'Quantity is 1 or more', ok: item.quantity >= 1 },
    { label: 'Category is one of the three', ok: isAllowedCategory(item.category) },
  ];

  const confirm = () => {
    const result = confirmItem(item.item_id, approver);
    if (!result.ok) {
      Presets.System.notificationError();
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    Presets.System.notificationSuccess();
  };

  return { approver, duplicates, checks, errors, confirm };
}

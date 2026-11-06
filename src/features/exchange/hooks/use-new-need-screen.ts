import { router } from 'expo-router';
import { useState } from 'react';
import { Presets } from 'react-native-pulsar';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import type { Category } from '@/features/exchange/types/exchange';

export const MIN_CONDITIONS = ['usable', 'good', 'new'] as const;
export type MinCondition = (typeof MIN_CONDITIONS)[number];

function inDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function useNewNeedScreen() {
  const addNeed = useExchangeStore((s) => s.addNeed);
  const [category, setCategory] = useState<Category>('paper_writing');
  const [minCondition, setMinCondition] = useState<MinCondition>('usable');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [neededBy, setNeededBy] = useState(inDays(30));
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const qty = Number(quantity);
    if (description.trim().length < 3) return setError('Say what you need, like "Fraction tiles".');
    if (!Number.isInteger(qty) || qty < 1) return setError('Quantity must be a whole number of 1 or more.');
    if (!/^\d{4}-\d{2}-\d{2}$/u.test(neededBy) || Number.isNaN(new Date(neededBy).getTime())) {
      return setError('Write the date as YYYY-MM-DD, for example 2026-12-15.');
    }
    if (neededBy < inDays(0)) return setError('The needed-by date has already passed.');
    const need = addNeed({
      category,
      description: description.trim(),
      quantity: qty,
      min_condition: minCondition,
      needed_by: neededBy,
    });
    Presets.System.notificationSuccess();
    router.replace({ pathname: '/need/[id]', params: { id: need.need_id } });
  };

  return {
    category, setCategory, minCondition, setMinCondition, description, setDescription,
    quantity, setQuantity, neededBy, setNeededBy, error, save,
  };
}

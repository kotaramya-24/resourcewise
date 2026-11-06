import { router } from 'expo-router';
import { useState } from 'react';
import { Presets } from 'react-native-pulsar';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import type { Category, Condition } from '@/features/exchange/types/exchange';

export const UNITS = ['each', 'pack', 'box', 'ream', 'set'] as const;
export type Unit = (typeof UNITS)[number];

export function useNewItemScreen() {
  const addItem = useExchangeStore((s) => s.addItem);
  const [category, setCategory] = useState<Category>('paper_writing');
  const [condition, setCondition] = useState<Condition>('good');
  const [unit, setUnit] = useState<Unit>('pack');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    const qty = Number(quantity);
    if (title.trim().length < 3) return setError('Give the item a name, like "Glue sticks, large".');
    if (!Number.isInteger(qty) || qty < 1) return setError('Quantity must be a whole number of 1 or more.');
    if (qty > 10000) return setError('That quantity looks too large. Check the number.');
    addItem({
      category,
      condition,
      unit,
      title: title.trim(),
      description: description.trim() || 'Surplus from our supply room.',
      quantity: qty,
    });
    Presets.System.notificationSuccess();
    router.back();
  };

  return {
    category, setCategory, condition, setCondition, unit, setUnit,
    title, setTitle, description, setDescription, quantity, setQuantity, error, save,
  };
}

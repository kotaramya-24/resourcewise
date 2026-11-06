import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import type { Category, Condition } from '@/features/exchange/types/exchange';
import { CATEGORIES, CONDITIONS, categoryLabel, conditionLabel } from '@/features/exchange/utils/labels';

interface Option {
  value: string | null;
  label: string;
  hint?: string;
}

export default function FilterSheet() {
  const { kind } = useLocalSearchParams<{ kind: 'school' | 'category' | 'condition' }>();
  const schools = useExchangeStore((s) => s.schools);
  const items = useExchangeStore((s) => s.items);
  const filters = useExchangeStore((s) => s.filters);
  const setFilters = useExchangeStore((s) => s.setFilters);
  const accent = useTokenColor('--color-accent');

  const count = (pred: (c: string) => boolean, field: 'school_id' | 'category' | 'condition') =>
    items.filter((it) => pred(it[field])).length;

  let title = 'School';
  let current: string | null = filters.schoolID;
  let options: Option[] = [
    { value: null, label: 'All schools' },
    ...schools.map((sc) => ({
      value: sc.school_id,
      label: sc.name,
      hint: `${count((v) => v === sc.school_id, 'school_id')}`,
    })),
  ];
  if (kind === 'category') {
    title = 'Category';
    current = filters.category;
    options = [
      { value: null, label: 'All categories' },
      ...CATEGORIES.map((c) => ({ value: c, label: categoryLabel(c), hint: `${count((v) => v === c, 'category')}` })),
    ];
  }
  if (kind === 'condition') {
    title = 'Condition';
    current = filters.condition;
    options = [
      { value: null, label: 'Any condition' },
      ...CONDITIONS.map((c) => ({ value: c, label: conditionLabel(c), hint: `${count((v) => v === c, 'condition')}` })),
    ];
  }

  const choose = (value: string | null) => {
    if (kind === 'category') setFilters({ category: value as Category | null });
    if (kind === 'condition') setFilters({ condition: value as Condition | null });
    if (kind === 'school' || !kind) setFilters({ schoolID: value });
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-6 pb-safe-offset-4 gap-4">
      <Text className="text-2xl font-bold text-foreground">Filter by {title.toLowerCase()}</Text>
      <Card list>
        {options.map((o) => (
          <ListRow
            key={o.value ?? 'all'}
            title={o.label}
            onPress={() => choose(o.value)}
            right={
              <View className="flex-row items-center gap-3">
                {o.hint ? <Text className="text-sm text-muted tabular-nums">{o.hint}</Text> : null}
                {current === o.value ? <Icon sf="checkmark" ion="checkmark" size={16} color={accent} /> : null}
              </View>
            }
          />
        ))}
      </Card>
    </ScrollView>
  );
}

import { router } from 'expo-router';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { categoryLabel, conditionLabel, shortSchoolName } from '@/features/exchange/utils/labels';
import { availableQuantity } from '@/features/exchange/utils/transfer';

export function useSuppliesScreen() {
  const items = useExchangeStore((s) => s.items);
  const schools = useExchangeStore((s) => s.schools);
  const needs = useExchangeStore((s) => s.needs);
  const filters = useExchangeStore((s) => s.filters);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const clearFilters = useExchangeStore((s) => s.clearFilters);
  const claims = useExchangeStore((s) => s.claims);
  const left = (it: (typeof items)[number]) => availableQuantity(it, claims);

  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;
  const activeSchool = schools.find((x) => x.school_id === activeSchoolID);

  const visible = items
    .filter((it) => (filters.schoolID ? it.school_id === filters.schoolID : true))
    .filter((it) => (filters.category ? it.category === filters.category : true))
    .filter((it) => (filters.condition ? it.condition === filters.condition : true))
    .sort((a, b) => Number(left(a) === 0) - Number(left(b) === 0));

  const totalUnits = visible.reduce((sum, it) => sum + left(it), 0);
  const anyFilter = Boolean(filters.schoolID || filters.category || filters.condition);

  const openFilter = (kind: 'school' | 'category' | 'condition') =>
    router.push({ pathname: '/filter', params: { kind } });

  return {
    tableCounts: [
      { label: 'Schools', value: schools.length },
      { label: 'Items', value: items.length },
      { label: 'Needs', value: needs.length },
    ],
    visible,
    totalUnits,
    anyFilter,
    activeSchool,
    schoolName,
    clearFilters,
    openFilter,
    labels: {
      school: filters.schoolID ? shortSchoolName(schoolName(filters.schoolID)) : 'All schools',
      category: filters.category ? categoryLabel(filters.category) : 'All categories',
      condition: filters.condition ? conditionLabel(filters.condition) : 'Any condition',
    },
    active: {
      school: Boolean(filters.schoolID),
      category: Boolean(filters.category),
      condition: Boolean(filters.condition),
    },
  };
}

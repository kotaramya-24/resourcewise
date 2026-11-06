import { router } from 'expo-router';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { categoryLabel, conditionLabel, shortSchoolName } from '@/features/exchange/utils/labels';

export function useSuppliesScreen() {
  const items = useExchangeStore((s) => s.items);
  const schools = useExchangeStore((s) => s.schools);
  const filters = useExchangeStore((s) => s.filters);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const clearFilters = useExchangeStore((s) => s.clearFilters);

  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;
  const activeSchool = schools.find((x) => x.school_id === activeSchoolID);

  const visible = items
    .filter((it) => (filters.schoolID ? it.school_id === filters.schoolID : true))
    .filter((it) => (filters.category ? it.category === filters.category : true))
    .filter((it) => (filters.condition ? it.condition === filters.condition : true))
    .sort((a, b) => Number(a.quantity === 0) - Number(b.quantity === 0));

  const totalUnits = visible.reduce((sum, it) => sum + it.quantity, 0);
  const anyFilter = Boolean(filters.schoolID || filters.category || filters.condition);

  const openFilter = (kind: 'school' | 'category' | 'condition') =>
    router.push({ pathname: '/filter', params: { kind } });

  return {
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

import { router } from 'expo-router';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { dashboardStats } from '@/features/exchange/utils/dashboard';

export function useDashboardScreen() {
  const items = useExchangeStore((s) => s.items);
  const needs = useExchangeStore((s) => s.needs);
  const claims = useExchangeStore((s) => s.claims);
  const schools = useExchangeStore((s) => s.schools);

  const schoolName = (id: string) => schools.find((x) => x.school_id === id)?.name ?? id;
  const stats = dashboardStats(items, needs, claims, schoolName);
  const accuracy = stats.totalItems === 0 ? 0 : Math.round((stats.passingItems / stats.totalItems) * 100);

  return {
    stats,
    accuracy,
    schoolName,
    openItem: (itemID: string) => router.push({ pathname: '/item/[id]', params: { id: itemID } }),
  };
}

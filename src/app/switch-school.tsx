import { router } from 'expo-router';
import { ScrollView, Text } from 'react-native';

import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { SCHOOL_STAFF } from '@/features/exchange/data/staff';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import { useExchangeStore } from '@/features/exchange/store/exchange-store';

export default function SwitchSchoolSheet() {
  const schools = useExchangeStore((s) => s.schools);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);
  const setActiveSchool = useExchangeStore((s) => s.setActiveSchool);
  const accent = useTokenColor('--color-accent');

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-6 pb-safe-offset-4 gap-4">
      <Text className="text-2xl font-bold text-foreground">Which school are you?</Text>
      <Text className="text-sm text-muted">
        Claims, listings and needs you add are made on behalf of this school.
      </Text>
      <Card list>
        {schools.map((sc) => (
          <ListRow
            key={sc.school_id}
            title={sc.name}
            subtitle={`${SCHOOL_STAFF[sc.school_id]?.lister ?? 'Lister'} · ${sc.region} region`}
            onPress={() => {
              setActiveSchool(sc.school_id);
              router.back();
            }}
            right={
              sc.school_id === activeSchoolID ? <Icon sf="checkmark" ion="checkmark" size={16} color={accent} /> : null
            }
          />
        ))}
      </Card>
    </ScrollView>
  );
}

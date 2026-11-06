import { Text } from 'react-native';

import type { NeedMatch } from '@/features/exchange/types/exchange';
import { pluralUnit, shortSchoolName } from '@/features/exchange/utils/labels';

interface MatchLineProps {
  match: NeedMatch;
  schoolName: (id: string) => string;
  covered: boolean;
}

export function MatchLine({ match, schoolName, covered }: MatchLineProps) {
  if (covered) return <Text className="text-sm font-medium text-accent">Need covered</Text>;
  if (match.kind !== 'exact' || !match.item) {
    return (
      <Text className="text-sm text-muted" numberOfLines={2}>
        <Text className="font-semibold text-foreground">No match. </Text>
        {match.reason ?? ''}
      </Text>
    );
  }
  const from = shortSchoolName(schoolName(match.item.school_id));
  return (
    <Text className="text-sm font-medium text-accent" numberOfLines={1}>
      Match: {match.item.quantity} {pluralUnit(match.item.unit, match.item.quantity)} at {from}
    </Text>
  );
}

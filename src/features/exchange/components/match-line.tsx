import { Text } from 'react-native';

import type { NeedMatch } from '@/features/exchange/types/exchange';
import { conditionLabel, pluralUnit, shortSchoolName } from '@/features/exchange/utils/labels';

interface MatchLineProps {
  match: NeedMatch;
  schoolName: (id: string) => string;
  covered: boolean;
}

export function MatchLine({ match, schoolName, covered }: MatchLineProps) {
  if (covered) return <Text className="text-sm font-medium text-accent">Need covered</Text>;
  if (!match.item || match.kind === 'none') return <Text className="text-sm text-muted">No match yet</Text>;
  const from = shortSchoolName(schoolName(match.item.school_id));
  if (match.kind === 'exact') {
    return (
      <Text className="text-sm font-medium text-accent" numberOfLines={1}>
        Match: {match.item.quantity} {pluralUnit(match.item.unit, match.item.quantity)} at {from}
      </Text>
    );
  }
  if (match.kind === 'partial_quantity') {
    return (
      <Text className="text-sm font-medium text-paper-writing" numberOfLines={1}>
        Partial: only {match.item.quantity} at {from}
      </Text>
    );
  }
  return (
    <Text className="text-sm font-medium text-eraser" numberOfLines={1}>
      Partial: {from} has some, {conditionLabel(match.item.condition).toLowerCase()}
    </Text>
  );
}

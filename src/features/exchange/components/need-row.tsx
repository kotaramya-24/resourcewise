import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { MatchLine } from '@/features/exchange/components/match-line';
import type { Need, NeedMatch } from '@/features/exchange/types/exchange';
import { categoryDotClass, formatDate, shortSchoolName } from '@/features/exchange/utils/labels';
import { cn } from '@/lib/cn';

interface NeedRowProps {
  need: Need;
  match: NeedMatch;
  remaining: number;
  schoolName: (id: string) => string;
}

export function NeedRow({ need, match, remaining, schoolName }: NeedRowProps) {
  const covered = need.status === 'fulfilled';
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/need/[id]', params: { id: need.need_id } })}
      className="flex-row gap-4 py-4"
    >
      <View className={cn('w-1 self-stretch rounded-full', categoryDotClass(need.category))} />
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
          {need.description}
        </Text>
        <Text className="text-sm text-muted" numberOfLines={1}>
          {shortSchoolName(schoolName(need.school_id))} · by {formatDate(need.needed_by)}
        </Text>
        <MatchLine match={match} schoolName={schoolName} covered={covered} />
      </View>
      <View className="items-end">
        <Text className="text-2xl font-bold text-foreground tabular-nums">{covered ? need.quantity : remaining}</Text>
        <Text className="text-xs text-muted">{covered ? 'covered' : 'needed'}</Text>
      </View>
    </Pressable>
  );
}

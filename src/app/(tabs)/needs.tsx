import { router } from 'expo-router';
import { FlatList, Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { Segmented } from '@/components/segmented';
import { NeedRow } from '@/features/exchange/components/need-row';
import { useNeedsScreen, type NeedsView } from '@/features/exchange/hooks/use-needs-screen';

const VIEWS: NeedsView[] = ['open', 'mine', 'covered'];

export default function NeedsScreen() {
  const s = useNeedsScreen();

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22"
      data={s.rows}
      keyExtractor={(r) => r.need.need_id}
      renderItem={({ item }) => (
        <NeedRow need={item.need} match={item.match} remaining={item.remaining} schoolName={s.schoolName} />
      )}
      ItemSeparatorComponent={() => <View className="h-px bg-border" />}
      ListHeaderComponent={
        <View className="gap-4 pb-2">
          <View className="flex-row items-end justify-between gap-3">
            <Text className="text-3xl font-bold text-foreground">Needs</Text>
            <Pressable
              onPress={() => router.push('/new-need')}
              className="min-h-11 justify-center rounded-full bg-accent px-4"
            >
              <Text className="text-sm font-semibold text-accent-foreground">Post a need</Text>
            </Pressable>
          </View>
          <Segmented
            values={VIEWS}
            value={s.view}
            onChange={s.setView}
            labels={['Open', 'My school', 'Covered']}
          />
          <Text className="text-sm text-muted">
            {s.rows.length} {s.rows.length === 1 ? 'need' : 'needs'} · {s.matchedCount} with supplies on offer
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center gap-2 py-12">
          <Text className="text-base text-muted">
            {s.view === 'mine' ? 'Your school has no needs posted yet.' : 'Nothing here yet.'}
          </Text>
        </View>
      }
    />
  );
}

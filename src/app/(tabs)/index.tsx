import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { FlatList, ScrollView, Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import { FilterPill } from '@/features/exchange/components/filter-pill';
import { ItemRow } from '@/features/exchange/components/item-row';
import { TableCounts } from '@/features/exchange/components/table-counts';
import { useSuppliesScreen } from '@/features/exchange/hooks/use-supplies-screen';
import { shortSchoolName } from '@/features/exchange/utils/labels';

export default function SuppliesScreen() {
  const s = useSuppliesScreen();
  const onAccent = useTokenColor('--color-accent-foreground');

  return (
    <FlatList
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22"
      data={s.visible}
      keyExtractor={(it) => it.item_id}
      renderItem={({ item }) => <ItemRow item={item} schoolName={s.schoolName(item.school_id)} />}
      ItemSeparatorComponent={() => <View className="h-px bg-border" />}
      ListHeaderComponent={
        <View className="gap-4 pb-2">
          <View className="flex-row items-end justify-between gap-3">
            <Text className="text-3xl font-bold text-foreground">Supplies</Text>
            <View className="flex-1" />
            <Pressable
              onPress={() => router.push('/new-item')}
              accessibilityRole="button"
              accessibilityLabel="Add item"
              className="size-11 items-center justify-center rounded-full bg-accent"
            >
              <Icon sf="plus" ion="add" size={22} color={onAccent} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/switch-school')}
              className="min-h-11 justify-center rounded-full bg-accent/15 px-4"
            >
              <Text className="text-sm font-semibold text-accent" numberOfLines={1}>
                {s.activeSchool ? shortSchoolName(s.activeSchool.name) : 'Pick school'}
              </Text>
            </Pressable>
          </View>
          <TableCounts counts={s.tableCounts} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
            <FilterPill label={s.labels.school} active={s.active.school} onPress={() => s.openFilter('school')} />
            <FilterPill label={s.labels.category} active={s.active.category} onPress={() => s.openFilter('category')} />
            <FilterPill label={s.labels.condition} active={s.active.condition} onPress={() => s.openFilter('condition')} />
          </ScrollView>
          <Text className="text-sm text-muted">
            {s.visible.length} {s.visible.length === 1 ? 'listing' : 'listings'} · {s.totalUnits} units up for grabs
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View className="items-center gap-3 py-12">
          <Text className="text-base text-muted">No supplies match these filters.</Text>
          {s.anyFilter ? (
            <Button variant="secondary" onPress={s.clearFilters}>
              <Button.Label>Clear filters</Button.Label>
            </Button>
          ) : null}
        </View>
      }
    />
  );
}

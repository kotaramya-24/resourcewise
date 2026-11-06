import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { CategoryTag } from '@/features/exchange/components/category-tag';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import type { Item } from '@/features/exchange/types/exchange';
import { conditionLabel, pluralUnit, shortSchoolName } from '@/features/exchange/utils/labels';
import { cn } from '@/lib/cn';

interface ItemRowProps {
  item: Item;
  schoolName: string;
}

export function ItemRow({ item, schoolName }: ItemRowProps) {
  const claimed = item.quantity === 0;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.item_id } })}
      className="flex-row items-center gap-4 py-3"
    >
      <ItemPhoto item={item} className={cn('size-18 rounded-xl', claimed ? 'opacity-50' : '')} />
      <View className="flex-1 gap-1">
        <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-sm text-muted" numberOfLines={1}>
          {shortSchoolName(schoolName)}
          {' · '}
          <Text className={item.condition === 'needs_repair' ? 'text-eraser' : 'text-muted'}>
            {conditionLabel(item.condition)}
          </Text>
        </Text>
        <View className="flex-row items-center gap-2">
          <CategoryTag category={item.category} />
          {item.status === 'submitted' ? (
            <Text className="text-xs font-semibold uppercase tracking-wide text-accent">Submitted</Text>
          ) : null}
          {item.status === 'confirmed' ? (
            <Text className="text-xs font-semibold uppercase tracking-wide text-muted">Confirmed</Text>
          ) : null}
        </View>
      </View>
      {claimed ? (
        <Text className="text-sm font-medium text-muted">All claimed</Text>
      ) : (
        <View className="items-end">
          <Text className="text-2xl font-bold text-foreground tabular-nums">{item.quantity}</Text>
          <Text className="text-xs text-muted">{pluralUnit(item.unit, item.quantity)}</Text>
        </View>
      )}
    </Pressable>
  );
}

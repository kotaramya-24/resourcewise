import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { ListRow } from '@/components/list-row';
import { pressHaptic } from '@/components/pressable';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import { useReviewCard } from '@/features/exchange/hooks/use-review-card';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import type { Item } from '@/features/exchange/types/exchange';
import { pluralUnit } from '@/features/exchange/utils/labels';

interface ReviewCardProps {
  item: Item;
  /** Show the item's photo and title (in the queue); the detail screen already shows them. */
  showItem?: boolean;
}

export function ReviewCard({ item, showItem = false }: ReviewCardProps) {
  const r = useReviewCard(item);
  const success = useTokenColor('--color-success');
  const danger = useTokenColor('--color-danger');

  return (
    <Card>
      <View className="gap-4">
        {showItem ? (
          <View className="flex-row items-center gap-3">
            <ItemPhoto item={item} className="size-14 rounded-xl" iconSize={20} />
            <View className="flex-1 gap-1">
              <Text className="text-base font-semibold text-foreground" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm text-muted">
                {item.quantity} {pluralUnit(item.unit, item.quantity)} · {item.item_id}
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-1">
            <Text className="text-base font-semibold text-foreground">Submitted · waiting for confirmation</Text>
            <Text className="text-sm text-muted">Schools can claim this item once {r.approver} confirms it.</Text>
          </View>
        )}

        <View className="gap-2">
          {r.checks.map((c) => (
            <View key={c.label} className="flex-row items-center gap-2">
              <Icon
                sf={c.ok ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
                ion={c.ok ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={c.ok ? success : danger}
              />
              <Text className={c.ok ? 'text-sm text-foreground' : 'text-sm font-medium text-danger'}>{c.label}</Text>
            </View>
          ))}
        </View>

        {r.duplicates.length > 0 ? (
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Icon sf="exclamationmark.triangle.fill" ion="warning" size={18} color={danger} />
              <Text className="flex-1 text-sm font-semibold text-foreground">
                Possible duplicate: same school, title and quantity
              </Text>
            </View>
            <Card list>
              {r.duplicates.map((d) => (
                <ListRow
                  key={d.item_id}
                  title={d.title}
                  subtitle={`${d.item_id} · ${d.quantity} ${pluralUnit(d.unit, d.quantity)} · ${d.status}`}
                  onPress={() => router.push({ pathname: '/item/[id]', params: { id: d.item_id } })}
                />
              ))}
            </Card>
          </View>
        ) : null}

        {r.errors.length > 0 ? (
          <View className="gap-1">
            <Text className="text-sm font-semibold text-danger">Can&apos;t confirm this item:</Text>
            {r.errors.map((e) => (
              <Text key={e} className="text-sm text-danger">
                {`• ${e}`}
              </Text>
            ))}
          </View>
        ) : null}

        <Button
          onPress={() => {
            pressHaptic();
            r.confirm();
          }}
        >
          <Button.Label>{`Confirm as ${r.approver}`}</Button.Label>
        </Button>
      </View>
    </Card>
  );
}

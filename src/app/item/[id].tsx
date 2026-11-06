import { useLocalSearchParams } from 'expo-router';
import { Button } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { BackButton } from '@/components/back-button';
import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { Pressable, pressHaptic } from '@/components/pressable';
import { CategoryTag } from '@/features/exchange/components/category-tag';
import { ClaimStamp } from '@/features/exchange/components/claim-stamp';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import { ReviewCard } from '@/features/exchange/components/review-card';
import { useItemScreen } from '@/features/exchange/hooks/use-item-screen';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import { conditionLabel, formatDate, pluralUnit } from '@/features/exchange/utils/labels';
import { cn } from '@/lib/cn';
import { enterStaggered } from '@/lib/motion';

export default function ItemScreen() {
  const { id, needID } = useLocalSearchParams<{ id: string; needID?: string }>();
  const s = useItemScreen(id, needID ?? null);
  const accent = useTokenColor('--color-accent');
  const fg = useTokenColor('--color-foreground');

  if (!s.item) {
    return (
      <View className="flex-1 gap-4 bg-background px-5 pt-safe-offset-2">
        <BackButton />
        <Text className="text-base text-muted">This listing was removed.</Text>
      </View>
    );
  }
  const item = s.item;
  const soldOut = s.available === 0;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6">
      <BackButton />

      <View className="overflow-hidden rounded-3xl">
        <ItemPhoto item={item} className={cn('aspect-square w-full', soldOut ? 'opacity-60' : '')} iconSize={72} />
        <ClaimStamp pressCount={s.stampCount} label={s.stampLabel} />
      </View>

      <View className="gap-2">
        <CategoryTag category={item.category} suffix={conditionLabel(item.condition)} />
        <Text className="text-3xl font-bold text-foreground">{item.title}</Text>
        <Text className="text-base text-muted">{s.school?.name ?? item.school_id}</Text>
      </View>

      <View className="flex-row items-end gap-2">
        <Animated.Text key={s.available} entering={enterStaggered(0)} className="text-5xl font-bold text-foreground tabular-nums">
          {s.available}
        </Animated.Text>
        <Text className="pb-1 text-lg text-muted">
          {soldOut ? 'left · all claimed' : `${pluralUnit(item.unit, s.available)} available`}
        </Text>
      </View>

      <Text className="text-base leading-6 text-foreground">{item.description}</Text>

      {s.isOwn ? (
        <Card>
          <View className="gap-3">
            <Text className="text-base font-semibold text-foreground">This is your school&apos;s listing</Text>
            <Text className="text-sm text-muted">Other schools can claim it. Approve their requests on My school.</Text>
            <Button variant="danger-soft" onPress={s.remove}>
              <Button.Label>Remove listing</Button.Label>
            </Button>
          </View>
        </Card>
      ) : null}

      {item.status === 'submitted' ? <ReviewCard item={item} /> : null}

      {item.confirmed_by ? (
        <Text className="text-sm text-muted">{`Confirmed by ${item.confirmed_by}`}</Text>
      ) : null}

      {!s.isOwn && !soldOut && item.status !== 'submitted' ? (
        <View className="gap-4">
          {s.fillable.length > 0 ? (
            <View className="gap-2">
              <Text className="text-sm font-medium text-muted">Count it toward a need</Text>
              {[...s.fillable.map((n) => n.need_id), null].map((nid) => {
                const need = s.fillable.find((n) => n.need_id === nid);
                const selected = s.needID === nid;
                return (
                  <Pressable
                    key={nid ?? 'none'}
                    onPress={() => s.selectNeed(nid)}
                    className={cn(
                      'min-h-11 flex-row items-center gap-3 rounded-2xl border px-4 py-3',
                      selected ? 'border-accent bg-accent/10' : 'border-border',
                    )}
                  >
                    <Icon
                      sf={selected ? 'checkmark.circle.fill' : 'circle'}
                      ion={selected ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={selected ? accent : fg}
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-foreground" numberOfLines={2}>
                        {need ? need.description : 'Just claim it, no need attached'}
                      </Text>
                      {need ? (
                        <Text className="text-xs text-muted">
                          {s.remainingFor(need.need_id)} still needed · by {formatDate(need.needed_by)}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View className="flex-row items-center justify-between rounded-full border border-border p-1">
            <Pressable
              onPress={() => s.step(-1)}
              accessibilityLabel="Fewer"
              className="size-11 items-center justify-center rounded-full bg-surface-secondary"
            >
              <Icon sf="minus" ion="remove" size={18} color={fg} />
            </Pressable>
            <Text className="text-2xl font-bold text-foreground tabular-nums">{s.quantity}</Text>
            <Pressable
              onPress={() => s.step(1)}
              accessibilityLabel="More"
              className="size-11 items-center justify-center rounded-full bg-surface-secondary"
            >
              <Icon sf="plus" ion="add" size={18} color={fg} />
            </Pressable>
          </View>

          {s.error ? <Text className="text-sm text-danger">{s.error}</Text> : null}

          <Button
            size="lg"
            onPress={() => {
              pressHaptic();
              s.claim();
            }}
          >
            <Button.Label>{`Claim ${s.quantity} ${pluralUnit(item.unit, s.quantity)}`}</Button.Label>
          </Button>
        </View>
      ) : null}

      {s.myClaims.length > 0 ? (
        <Text className="text-sm text-muted">
          Your school has requested {s.myClaims.reduce((n, c) => n + c.quantity, 0)} so far. Track it on My school.
        </Text>
      ) : null}
    </ScrollView>
  );
}

import { useLocalSearchParams } from 'expo-router';
import { Button } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { BackButton } from '@/components/back-button';
import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { CategoryTag } from '@/features/exchange/components/category-tag';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import { useNeedScreen } from '@/features/exchange/hooks/use-need-screen';
import { conditionLabel, formatDate, pluralUnit, shortSchoolName } from '@/features/exchange/utils/labels';
import { fadeIn } from '@/lib/motion';

const KIND_TEXT = {
  exact: 'Fits',
  partial_quantity: 'Not enough',
  partial_condition: 'Condition too low',
  awaiting_confirmation: 'Waiting for confirmation',
  none: '',
} as const;

const PLEDGE_TEXT = {
  pending: 'waiting on approval',
  approved: 'approved · handoff to verify',
  transferred: 'transferred',
  declined: 'declined',
} as const;

export default function NeedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const s = useNeedScreen(id);

  if (!s.need) {
    return (
      <View className="flex-1 gap-4 bg-background px-5 pt-safe-offset-2">
        <BackButton />
        <Text className="text-base text-muted">This need was removed.</Text>
      </View>
    );
  }
  const need = s.need;
  const fulfilled = need.status === 'fulfilled';
  const progress = Math.min(1, s.covered / Math.max(1, need.quantity));

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6">
      <BackButton />
      <View className="gap-2">
        <CategoryTag category={need.category} suffix={`${conditionLabel(need.min_condition)} or better`} />
        <Text className="text-3xl font-bold text-foreground">{need.description}</Text>
        <Text className="text-base text-muted">
          {s.schoolName(need.school_id)} · needed by {formatDate(need.needed_by)}
        </Text>
      </View>

      <View className="gap-2">
        <View className="flex-row items-end gap-2">
          <Text className="text-5xl font-bold text-foreground tabular-nums">{s.covered}</Text>
          <Text className="pb-1 text-lg text-muted">of {need.quantity} lined up</Text>
        </View>
        <View className="h-2 overflow-hidden rounded-full bg-surface-secondary">
          <View className="h-2 rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
        </View>
      </View>

      {fulfilled ? (
        <Animated.View entering={fadeIn}>
          <Card>
            <View className="gap-1">
              <Text className="text-lg font-bold text-accent">Need covered</Text>
              <Text className="text-sm text-muted">
                Every unit is lined up from other schools. Handoffs show on My school.
              </Text>
            </View>
          </Card>
        </Animated.View>
      ) : null}

      {s.pledges.length > 0 ? (
        <Section title="Lined up">
          <Card list>
            {s.pledges.map((c) => {
              const it = s.items.find((x) => x.item_id === c.item_id);
              return (
                <ListRow
                  key={c.claim_id}
                  title={it ? it.title : c.item_id}
                  subtitle={`${shortSchoolName(s.schoolName(c.from_school_id))} · ${PLEDGE_TEXT[c.status]}`}
                  right={<Text className="text-base font-semibold text-foreground tabular-nums">{c.quantity}</Text>}
                />
              );
            })}
          </Card>
        </Section>
      ) : null}

      {!fulfilled && s.match ? (
        <Section title="Best match">
          {s.match.kind === 'exact' && s.match.item ? (
            <Card list>
              <ListRow
                title={s.match.item.title}
                subtitle={`${shortSchoolName(s.schoolName(s.match.item.school_id))} · ${s.match.available ?? 0} ${pluralUnit(s.match.item.unit, s.match.available ?? 0)} · ${conditionLabel(s.match.item.condition)}`}
                left={<ItemPhoto item={s.match.item} className="size-12 rounded-lg" iconSize={18} />}
                onPress={() => (s.match?.item ? s.openItem(s.match.item.item_id) : undefined)}
              />
            </Card>
          ) : (
            <Card>
              <View className="gap-1">
                <Text className="text-lg font-bold text-foreground">No match</Text>
                <Text className="text-sm text-muted">{s.match.reason}</Text>
                <Text className="text-sm text-muted">
                  The need stays open. A confirmed listing from another school that fits will show here.
                </Text>
              </View>
            </Card>
          )}
        </Section>
      ) : null}

      {!fulfilled && s.others.length > 0 ? (
        <Section title="Other listings checked">
          <Card list>
            {s.others.map(({ kind, item, available }) =>
              item ? (
                <ListRow
                  key={item.item_id}
                  title={item.title}
                  subtitle={`${KIND_TEXT[kind]} · ${shortSchoolName(s.schoolName(item.school_id))} · ${available ?? 0} ${pluralUnit(item.unit, available ?? 0)} · ${conditionLabel(item.condition)}`}
                  left={<ItemPhoto item={item} className="size-12 rounded-lg" iconSize={18} />}
                  onPress={() => s.openItem(item.item_id)}
                />
              ) : null,
            )}
          </Card>
        </Section>
      ) : null}

      {s.isMine ? (
        <Button variant="danger-soft" onPress={s.remove}>
          <Button.Label>Remove need</Button.Label>
        </Button>
      ) : null}
    </ScrollView>
  );
}

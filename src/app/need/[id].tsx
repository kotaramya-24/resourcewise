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
  exact: 'Covers it',
  partial_quantity: 'Covers part',
  partial_condition: 'Below your condition',
  none: '',
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
                  subtitle={`${shortSchoolName(s.schoolName(c.from_school_id))} · ${c.status === 'approved' ? 'approved' : 'waiting on approval'}`}
                  right={<Text className="text-base font-semibold text-foreground tabular-nums">{c.quantity}</Text>}
                />
              );
            })}
          </Card>
        </Section>
      ) : null}

      {!fulfilled ? (
        <Section title={s.isMine ? 'Supplies that could fill it' : 'Supplies other schools offer'}>
          {s.candidates.length === 0 ? (
            <Text className="text-sm text-muted">
              No school has listed this yet. It stays open, and any new matching listing shows up here.
            </Text>
          ) : (
            <Card list>
              {s.candidates.map(({ kind, item }) =>
                item ? (
                  <ListRow
                    key={item.item_id}
                    title={item.title}
                    subtitle={`${shortSchoolName(s.schoolName(item.school_id))} · ${item.quantity} ${pluralUnit(item.unit, item.quantity)} · ${conditionLabel(item.condition)} · ${KIND_TEXT[kind]}`}
                    left={<ItemPhoto item={item} className="size-12 rounded-lg" iconSize={18} />}
                    onPress={() => s.openItem(item.item_id)}
                  />
                ) : null,
              )}
            </Card>
          )}
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

import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Section } from '@/components/section';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import { SplitBar } from '@/features/exchange/components/split-bar';
import { SurplusNeedChart } from '@/features/exchange/components/surplus-need-chart';
import { useDashboardScreen } from '@/features/exchange/hooks/use-dashboard-screen';
import { categoryLabel, shortSchoolName } from '@/features/exchange/utils/labels';

export default function DashboardScreen() {
  const s = useDashboardScreen();
  const { stats } = s;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6">
      <Text className="text-3xl font-bold text-foreground">Dashboard</Text>

      <Section title="Inventory accuracy">
        <Card>
          <View className="gap-1">
            <Text className="text-5xl font-bold text-foreground tabular-nums">{`${s.accuracy}%`}</Text>
            <Text className="text-sm text-muted">
              {`${stats.passingItems} of ${stats.totalItems} items pass all checks: photo, quantity of at least 1, an allowed category, and no possible duplicate.`}
            </Text>
          </View>
        </Card>
      </Section>

      <Section title="Items">
        <Card>
          <SplitBar
            first={{ label: 'confirmed', value: stats.confirmedItems }}
            second={{ label: 'submitted', value: stats.submittedItems }}
          />
        </Card>
      </Section>

      <Section title="Open needs">
        <Card>
          <SplitBar
            first={{ label: 'matched', value: stats.matchedNeeds }}
            second={{ label: 'unmatched', value: stats.openNeeds - stats.matchedNeeds }}
          />
        </Card>
      </Section>

      <Section title="Surplus vs need by category">
        <Card>
          <View className="gap-4">
            <SurplusNeedChart units={stats.units} />
            <Text className="text-xs text-muted">
              Surplus is what other schools can still claim. Need is what open needs still require. Units are counted as
              listed (boxes, packs, sets).
            </Text>
          </View>
        </Card>
        <Card list>
          {stats.units.map((u) => (
            <ListRow
              key={u.category}
              title={categoryLabel(u.category)}
              subtitle={`${u.surplus} surplus · ${u.need} needed · ${u.surplus >= u.need ? `${u.surplus - u.need} extra` : `${u.need - u.surplus} short`}`}
            />
          ))}
        </Card>
      </Section>

      <Section title={`Data quality (${stats.issues.length})`}>
        {stats.issues.length === 0 ? (
          <Text className="text-sm text-muted">Every item has a photo and none are flagged as duplicates.</Text>
        ) : (
          <Card list>
            {stats.issues.map(({ item, missingPhoto, duplicateOf }) => (
              <ListRow
                key={item.item_id}
                title={item.title}
                subtitle={[
                  missingPhoto ? 'No photo' : null,
                  duplicateOf.length > 0 ? `Duplicate of ${duplicateOf.map((d) => d.item_id).join(', ')}?` : null,
                  shortSchoolName(s.schoolName(item.school_id)),
                ]
                  .filter(Boolean)
                  .join(' · ')}
                left={<ItemPhoto item={item} className="size-12 rounded-lg" iconSize={18} />}
                onPress={() => s.openItem(item.item_id)}
              />
            ))}
          </Card>
        )}
      </Section>
    </ScrollView>
  );
}

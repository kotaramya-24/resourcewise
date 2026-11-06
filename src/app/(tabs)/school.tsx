import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { pressHaptic } from '@/components/pressable';
import { Section } from '@/components/section';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import { ItemRow } from '@/features/exchange/components/item-row';
import { useSchoolScreen } from '@/features/exchange/hooks/use-school-screen';
import { pluralUnit, shortSchoolName } from '@/features/exchange/utils/labels';

const STATUS_TEXT = { pending: 'Waiting on approval', approved: 'Approved for pickup', declined: 'Declined' } as const;

export default function SchoolScreen() {
  const s = useSchoolScreen();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">{s.school?.name ?? 'My school'}</Text>
        <Text className="text-base text-muted">
          {s.staff ? `${s.staff.lister} lists · ${s.staff.approver} approves` : null}
        </Text>
      </View>

      <Card list>
        <ListRow
          title="Switch school"
          subtitle={s.school ? `${s.school.type} · ${s.school.region} region` : undefined}
          onPress={() => router.push('/switch-school')}
        />
      </Card>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            variant="primary"
            onPress={() => {
              pressHaptic();
              router.push('/new-item');
            }}
          >
            <Button.Label>List surplus</Button.Label>
          </Button>
        </View>
        <View className="flex-1">
          <Button
            variant="secondary"
            onPress={() => {
              pressHaptic();
              router.push('/new-need');
            }}
          >
            <Button.Label>Post a need</Button.Label>
          </Button>
        </View>
      </View>

      <Section title={`Requests to approve (${s.incoming.length})`}>
        {s.incoming.length === 0 ? (
          <Text className="text-sm text-muted">When another school claims your surplus, approve it here.</Text>
        ) : (
          <View className="gap-3">
            {s.incoming.map((c) => {
              const item = s.itemFor(c.item_id);
              return (
                <Card key={c.claim_id}>
                  <View className="gap-3">
                    <View className="flex-row items-center gap-3">
                      {item ? <ItemPhoto item={item} className="size-12 rounded-lg" iconSize={18} /> : null}
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                          {c.quantity} {item ? `${pluralUnit(item.unit, c.quantity)} · ${item.title}` : c.item_id}
                        </Text>
                        <Text className="text-sm text-muted">for {s.schoolName(c.to_school_id)}</Text>
                      </View>
                    </View>
                    <View className="flex-row gap-3">
                      <View className="flex-1">
                        <Button
                          size="sm"
                          onPress={() => {
                            pressHaptic();
                            s.approve(c.claim_id);
                          }}
                        >
                          <Button.Label>Approve</Button.Label>
                        </Button>
                      </View>
                      <View className="flex-1">
                        <Button size="sm" variant="secondary" onPress={() => s.decline(c.claim_id)}>
                          <Button.Label>Decline</Button.Label>
                        </Button>
                      </View>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </Section>

      <Section title="Your claims">
        {s.outgoing.length === 0 ? (
          <Text className="text-sm text-muted">Claim something on Supplies and it shows up here.</Text>
        ) : (
          <Card list>
            {s.outgoing.map((c) => {
              const item = s.itemFor(c.item_id);
              return (
                <ListRow
                  key={c.claim_id}
                  title={item ? item.title : c.item_id}
                  subtitle={`${c.quantity} from ${shortSchoolName(s.schoolName(c.from_school_id))} · ${STATUS_TEXT[c.status]}`}
                  left={item ? <ItemPhoto item={item} className="size-12 rounded-lg" iconSize={18} /> : undefined}
                  onPress={() => router.push({ pathname: '/item/[id]', params: { id: c.item_id } })}
                />
              );
            })}
          </Card>
        )}
      </Section>

      <Section title={`Your listings (${s.listings.length})`}>
        {s.listings.length === 0 ? (
          <Text className="text-sm text-muted">Nothing listed yet. Tap List surplus to share supplies.</Text>
        ) : (
          <View>
            {s.listings.map((it) => (
              <ItemRow key={it.item_id} item={it} schoolName={s.school?.name ?? ''} />
            ))}
          </View>
        )}
      </Section>

      <Button variant="ghost" onPress={s.reset}>
        <Button.Label>Reset demo data</Button.Label>
      </Button>
    </ScrollView>
  );
}

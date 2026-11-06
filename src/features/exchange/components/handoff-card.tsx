import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Card } from '@/components/card';
import { Icon } from '@/components/icon';
import { ItemPhoto } from '@/features/exchange/components/item-photo';
import { useHandoffCard } from '@/features/exchange/hooks/use-handoff-card';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import type { Claim } from '@/features/exchange/types/exchange';
import { pluralUnit, shortSchoolName } from '@/features/exchange/utils/labels';
import { fadeIn, fadeOut, reflow } from '@/lib/motion';

interface HandoffCardProps {
  claim: Claim;
}

export function HandoffCard({ claim }: HandoffCardProps) {
  const h = useHandoffCard(claim);
  const success = useTokenColor('--color-success');
  const muted = useTokenColor('--color-muted');

  const sides = [
    { key: 'from', label: `${shortSchoolName(h.fromName)} handed it over`, by: claim.from_verified_by },
    { key: 'to', label: `${shortSchoolName(h.toName)} received it`, by: claim.to_verified_by },
  ];

  return (
    <Animated.View entering={fadeIn} exiting={fadeOut} layout={reflow}>
      <Card>
        <View className="gap-3">
          <View className="flex-row items-center gap-3">
            {h.item ? <ItemPhoto item={h.item} className="size-12 rounded-lg" iconSize={18} /> : null}
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
                {claim.quantity} {h.item ? `${pluralUnit(h.item.unit, claim.quantity)} · ${h.item.title}` : claim.item_id}
              </Text>
              <Text className="text-sm text-muted" numberOfLines={1}>
                {`${shortSchoolName(h.fromName)} → ${shortSchoolName(h.toName)}`}
              </Text>
            </View>
          </View>

          <View className="gap-2">
            {sides.map((side) => (
              <View key={side.key} className="flex-row items-center gap-2">
                <Icon
                  sf={side.by ? 'checkmark.circle.fill' : 'circle'}
                  ion={side.by ? 'checkmark-circle' : 'ellipse-outline'}
                  size={18}
                  color={side.by ? success : muted}
                />
                <Text className="flex-1 text-sm text-foreground">
                  {side.by ? `${side.label} · verified by ${side.by}` : `${side.label} · not verified yet`}
                </Text>
              </View>
            ))}
          </View>

          {h.error ? <Text className="text-sm text-danger">{h.error}</Text> : null}

          {h.iVerified ? (
            <Text className="text-sm text-muted">{`You verified. Waiting for ${shortSchoolName(h.otherName)} to verify.`}</Text>
          ) : (
            <Button size="sm" onPress={h.verify}>
              <Button.Label>{h.giving ? 'Verify handed over' : 'Verify received'}</Button.Label>
            </Button>
          )}
        </View>
      </Card>
    </Animated.View>
  );
}

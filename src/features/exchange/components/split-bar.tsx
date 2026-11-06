import { Text, View } from 'react-native';

interface SplitBarProps {
  first: { label: string; value: number };
  second: { label: string; value: number };
}

/** Two counts as a proportional bar, each part named and counted beside it. */
export function SplitBar({ first, second }: SplitBarProps) {
  const total = first.value + second.value;
  return (
    <View className="gap-3">
      <View className="h-3 flex-row gap-0.5 overflow-hidden rounded-full bg-surface-secondary">
        {first.value > 0 ? <View className="rounded-full bg-accent" style={{ flex: first.value }} /> : null}
        {second.value > 0 ? <View className="rounded-full bg-muted/40" style={{ flex: second.value }} /> : null}
      </View>
      <View className="flex-row justify-between gap-3">
        <View className="flex-row items-center gap-2">
          <View className="size-2.5 rounded-full bg-accent" />
          <Text className="text-sm text-foreground">
            <Text className="font-semibold tabular-nums">{first.value}</Text> {first.label}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="size-2.5 rounded-full bg-muted/40" />
          <Text className="text-sm text-foreground">
            <Text className="font-semibold tabular-nums">{second.value}</Text> {second.label}
          </Text>
        </View>
      </View>
      {total === 0 ? <Text className="text-sm text-muted">Nothing to count yet.</Text> : null}
    </View>
  );
}

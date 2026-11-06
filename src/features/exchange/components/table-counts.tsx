import { Text, View } from 'react-native';

import { Card } from '@/components/card';

interface Count {
  label: string;
  value: number;
}

export function TableCounts({ counts }: { counts: Count[] }) {
  return (
    <Card>
      <View className="flex-row">
        {counts.map((c, i) => (
          <View key={c.label} className="flex-1 flex-row">
            {i > 0 ? <View className="w-px bg-border" /> : null}
            <View className="flex-1 items-center gap-1">
              <Text className="text-2xl font-bold tabular-nums text-foreground" accessibilityLabel={`${c.value} ${c.label}`}>
                {c.value}
              </Text>
              <Text className="text-xs font-medium uppercase tracking-wide text-muted">{c.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

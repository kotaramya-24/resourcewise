import { Text, View } from 'react-native';

import { ChartBar } from '@/features/exchange/components/chart-bar';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import type { CategoryUnits } from '@/features/exchange/types/dashboard';
import { categoryLabel } from '@/features/exchange/utils/labels';

interface SurplusNeedChartProps {
  units: CategoryUnits[];
}

const PLOT_HEIGHT = 150;
const BAR_WIDTH = 26;

export function SurplusNeedChart({ units }: SurplusNeedChartProps) {
  const surplusColor = useTokenColor('--color-chart-surplus');
  const needColor = useTokenColor('--color-chart-need');
  const max = Math.max(1, ...units.flatMap((u) => [u.surplus, u.need]));

  const series = [
    { key: 'surplus', label: 'Surplus units', color: surplusColor, swatch: 'bg-chart-surplus' },
    { key: 'need', label: 'Need units', color: needColor, swatch: 'bg-chart-need' },
  ] as const;

  return (
    <View className="gap-4">
      <View className="flex-row gap-4">
        {series.map((s) => (
          <View key={s.key} className="flex-row items-center gap-2">
            <View className={`size-3 rounded-sm ${s.swatch}`} />
            <Text className="text-sm text-muted">{s.label}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row border-b border-border">
        {units.map((u) => (
          <View
            key={u.category}
            className="flex-1 flex-row items-end justify-center gap-1"
            accessibilityLabel={`${categoryLabel(u.category)}: ${u.surplus} surplus units, ${u.need} need units`}
          >
            {series.map((s) => (
              <View key={s.key} className="items-center gap-1">
                <Text className="text-xs font-semibold text-foreground tabular-nums">{u[s.key]}</Text>
                <ChartBar value={u[s.key]} max={max} height={PLOT_HEIGHT} width={BAR_WIDTH} color={s.color} />
              </View>
            ))}
          </View>
        ))}
      </View>

      <View className="flex-row">
        {units.map((u) => (
          <Text key={u.category} className="flex-1 text-center text-xs font-medium text-muted" numberOfLines={2}>
            {categoryLabel(u.category)}
          </Text>
        ))}
      </View>
    </View>
  );
}

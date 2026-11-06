import { Text, View } from 'react-native';

import { categoryDotClass, categoryLabel } from '@/features/exchange/utils/labels';
import { cn } from '@/lib/cn';

interface CategoryTagProps {
  category: string;
  suffix?: string;
}

export function CategoryTag({ category, suffix }: CategoryTagProps) {
  return (
    <View className="flex-row items-center gap-2">
      <View className={cn('size-2 rounded-full', categoryDotClass(category))} />
      <Text className="text-sm text-muted" numberOfLines={1}>
        {categoryLabel(category)}
        {suffix ? ` · ${suffix}` : null}
      </Text>
    </View>
  );
}

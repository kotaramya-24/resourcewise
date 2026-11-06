import { router } from 'expo-router';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';

export function BackButton() {
  const color = useTokenColor('--color-foreground');
  return (
    <Pressable
      onPress={() => router.back()}
      accessibilityLabel="Back"
      className="size-11 items-center justify-center rounded-full bg-surface-secondary"
    >
      <Icon sf="arrow.left" ion="arrow-back" size={18} color={color} />
    </Pressable>
  );
}

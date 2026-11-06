import { Text } from 'react-native';

import { Icon } from '@/components/icon';
import { Pressable } from '@/components/pressable';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import { cn } from '@/lib/cn';

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  const accentFg = useTokenColor('--color-accent-foreground');
  const muted = useTokenColor('--color-muted');
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'min-h-11 flex-row items-center gap-1 rounded-full px-4',
        active ? 'bg-accent' : 'bg-surface-secondary',
      )}
    >
      <Text
        className={cn('text-sm font-medium', active ? 'text-accent-foreground' : 'text-foreground')}
        numberOfLines={1}
      >
        {label}
      </Text>
      <Icon sf="line.3.horizontal.decrease" ion="filter" size={12} color={active ? accentFg : muted} />
    </Pressable>
  );
}

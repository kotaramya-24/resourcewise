import Ionicons from '@expo/vector-icons/Ionicons';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import type { ComponentProps } from 'react';

interface IconProps {
  sf: SFSymbol;
  ion: ComponentProps<typeof Ionicons>['name'];
  size?: number;
  color: string;
}

/** SF Symbol on iOS, Ionicons on Android. */
export function Icon({ sf, ion, size = 20, color }: IconProps) {
  return (
    <SymbolView
      name={sf}
      size={size}
      tintColor={color}
      type="hierarchical"
      fallback={<Ionicons name={ion} size={size} color={color} />}
    />
  );
}

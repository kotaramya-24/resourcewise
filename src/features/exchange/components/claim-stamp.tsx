import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { durations, easings } from '@/lib/motion';

interface ClaimStampProps {
  /** Increments on each successful claim; every change presses the stamp again. */
  pressCount: number;
  label: string;
}

/** The requisition stamp that presses onto the photo when a claim goes through. */
export function ClaimStamp({ pressCount, label }: ClaimStampProps) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (pressCount === 0) return;
    if (reduced) {
      opacity.set(1);
      return;
    }
    scale.set(1.35);
    opacity.set(0);
    scale.set(withTiming(1, { duration: durations.gentle, easing: easings.enter }));
    opacity.set(withTiming(1, { duration: durations.base, easing: easings.enter }));
  }, [pressCount, reduced, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ rotate: '-8deg' }, { scale: scale.get() }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={style}
      className="absolute inset-0 items-center justify-center"
    >
      <Animated.View className="items-center gap-1 rounded-2xl border-4 border-accent bg-background/85 px-6 py-3">
        <Text className="text-3xl font-black tracking-widest text-accent">CLAIMED</Text>
        <Text className="text-sm font-semibold text-accent">{label}</Text>
      </Animated.View>
    </Animated.View>
  );
}

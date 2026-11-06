import { Canvas, Rect, RoundedRect } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { timing } from '@/lib/motion';

interface ChartBarProps {
  value: number;
  max: number;
  height: number;
  width: number;
  color: string;
}

const RADIUS = 4;

/** One baseline-anchored bar with a rounded data end. Grows from the baseline on first draw. */
export function ChartBar({ value, max, height, width, color }: ChartBarProps) {
  // The canvas is only as tall as the bar, so the value label above it sits on the data end.
  const target = Math.max(1, max === 0 ? 0 : Math.round((value / max) * height));
  const barHeight = useSharedValue(0);

  useEffect(() => {
    barHeight.set(withTiming(target, timing.draw));
  }, [barHeight, target]);

  const top = useDerivedValue(() => target - barHeight.get());
  const squareTop = useDerivedValue(() => target - Math.max(0, barHeight.get() - RADIUS));
  const squareHeight = useDerivedValue(() => Math.max(0, barHeight.get() - RADIUS));
  const roundHeight = useDerivedValue(() => Math.min(barHeight.get(), RADIUS * 2));

  return (
    <Canvas style={{ width, height: target }}>
      <RoundedRect x={0} y={top} width={width} height={roundHeight} r={RADIUS} color={color} />
      <Rect x={0} y={squareTop} width={width} height={squareHeight} color={color} />
    </Canvas>
  );
}

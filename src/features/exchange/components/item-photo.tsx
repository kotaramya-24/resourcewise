import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { ITEM_PHOTOS } from '@/features/exchange/data/photos';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import type { Item } from '@/features/exchange/types/exchange';
import { categorySymbol } from '@/features/exchange/utils/labels';
import { cn } from '@/lib/cn';
import { imageFade } from '@/lib/motion';

interface ItemPhotoProps {
  item: Item;
  className: string;
  iconSize?: number;
}

const CATEGORY_TOKEN: Record<string, string> = {
  paper_writing: '--color-paper-writing',
  books_learning: '--color-books-learning',
  stem_tech: '--color-stem-tech',
};

export function ItemPhoto({ item, className, iconSize = 26 }: ItemPhotoProps) {
  const source = ITEM_PHOTOS[item.photo_file];
  const color = useTokenColor(CATEGORY_TOKEN[item.category] ?? '--color-paper-writing');
  const symbol = categorySymbol(item.category);

  if (source) {
    return <Image source={source} className={cn('bg-surface-secondary', className)} contentFit="cover" transition={imageFade} />;
  }
  return (
    <View className={cn('items-center justify-center bg-surface-secondary', className)}>
      <Icon sf={symbol.sf as never} ion={symbol.ion as never} size={iconSize} color={color} />
    </View>
  );
}

import { ITEM_PHOTOS } from '@/features/exchange/data/photos';
import type { Item } from '@/features/exchange/types/exchange';
import { CATEGORIES, categoryLabel } from '@/features/exchange/utils/labels';
import { uploadedPhotoURI } from '@/features/exchange/utils/photo-storage';

export function hasPhoto(item: Item): boolean {
  if (!item.photo_file) return false;
  return Boolean(ITEM_PHOTOS[item.photo_file]) || uploadedPhotoURI(item.photo_file) !== null;
}

export function isAllowedCategory(category: string): boolean {
  return (CATEGORIES as string[]).includes(category);
}

/** Every reason an approver can't confirm this item yet, in the order the checklist shows them. */
export function confirmProblems(item: Item): string[] {
  const problems: string[] = [];
  if (!hasPhoto(item)) problems.push('Photo is missing. Add a photo of the item before confirming.');
  if (!Number.isFinite(item.quantity) || item.quantity < 1) {
    problems.push(`Quantity is ${item.quantity}. It must be at least 1.`);
  }
  if (!isAllowedCategory(item.category)) {
    problems.push(
      `Category "${item.category}" isn't allowed. It must be ${CATEGORIES.map(categoryLabel).join(', ')}.`,
    );
  }
  return problems;
}

const normalTitle = (title: string) => title.trim().toLowerCase().replace(/\s+/gu, ' ');

/** Other listings from the same school with the same title and the same quantity. */
export function findDuplicates(item: Item, items: Item[]): Item[] {
  return items.filter(
    (other) =>
      other.item_id !== item.item_id &&
      other.school_id === item.school_id &&
      other.quantity === item.quantity &&
      normalTitle(other.title) === normalTitle(item.title),
  );
}

export function isClaimable(item: Item): boolean {
  return (item.status === 'available' || item.status === 'confirmed') && item.quantity > 0;
}

import type { Category, Condition } from '@/features/exchange/types/exchange';

export const CATEGORIES: Category[] = ['paper_writing', 'books_learning', 'stem_tech'];

export const CONDITIONS: Condition[] = ['new', 'good', 'usable', 'needs_repair'];

const CATEGORY_LABELS: Record<string, string> = {
  paper_writing: 'Paper & writing',
  books_learning: 'Books & learning',
  stem_tech: 'STEM & tech',
};

const CATEGORY_SYMBOLS: Record<string, { sf: string; ion: string }> = {
  paper_writing: { sf: 'pencil.and.scribble', ion: 'pencil' },
  books_learning: { sf: 'books.vertical.fill', ion: 'book' },
  stem_tech: { sf: 'flask.fill', ion: 'flask' },
};

const CONDITION_LABELS: Record<string, string> = {
  new: 'New',
  good: 'Good',
  usable: 'Usable',
  needs_repair: 'Needs repair',
};

const CONDITION_RANK: Record<string, number> = { needs_repair: 0, usable: 1, good: 2, new: 3 };

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

export function categorySymbol(category: string) {
  return CATEGORY_SYMBOLS[category] ?? CATEGORY_SYMBOLS.paper_writing;
}

/** Uniwind class for the category's material color. Full literal strings so Tailwind sees them. */
export function categoryDotClass(category: string): string {
  if (category === 'books_learning') return 'bg-books-learning';
  if (category === 'stem_tech') return 'bg-stem-tech';
  return 'bg-paper-writing';
}

export function categoryTextClass(category: string): string {
  if (category === 'books_learning') return 'text-books-learning';
  if (category === 'stem_tech') return 'text-stem-tech';
  return 'text-paper-writing';
}

export function conditionLabel(condition: string): string {
  return CONDITION_LABELS[condition] ?? condition;
}

export function conditionRank(condition: string): number {
  return CONDITION_RANK[condition] ?? 0;
}

export function meetsCondition(condition: string, minimum: string): boolean {
  return conditionRank(condition) >= conditionRank(minimum);
}

export function shortSchoolName(name: string): string {
  return name
    .replace(/ (Elementary|Middle|High)$/u, '')
    .trim();
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function pluralUnit(unit: string, quantity: number): string {
  if (quantity === 1) return unit;
  if (unit === 'each' || unit.endsWith('s')) return unit;
  if (unit === 'box') return 'boxes';
  if (unit.endsWith('y')) return `${unit.slice(0, -1)}ies`;
  return `${unit}s`;
}

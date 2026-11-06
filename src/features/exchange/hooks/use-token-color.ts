import { useCSSVariable } from 'uniwind';

/** Resolve a CSS color token (e.g. '--color-accent') for native color props. */
export function useTokenColor(name: string): string {
  const value = useCSSVariable(name);
  return typeof value === 'string' ? value : 'gray';
}

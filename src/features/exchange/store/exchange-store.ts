import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SEED_ITEMS, SEED_NEEDS, SEED_SCHOOLS } from '@/features/exchange/data/seed';
import type { Claim, ClaimResult, Filters, Item, Need, School } from '@/features/exchange/types/exchange';
import { coveredQuantity } from '@/features/exchange/utils/match';
import { pluralUnit } from '@/features/exchange/utils/labels';
import { zustandStorage } from '@/lib/storage';

interface NewItemInput {
  school_id: string;
  photo_file: string;
  category: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  condition: string;
}

interface NewNeedInput {
  category: string;
  description: string;
  quantity: number;
  min_condition: string;
  needed_by: string;
}

interface ClaimInput {
  itemID: string;
  quantity: number;
  needID: string | null;
}

interface ExchangeState {
  schools: School[];
  items: Item[];
  needs: Need[];
  claims: Claim[];
  activeSchoolID: string;
  filters: Filters;
  setActiveSchool: (schoolID: string) => void;
  setFilters: (patch: Partial<Filters>) => void;
  clearFilters: () => void;
  claimItem: (input: ClaimInput) => ClaimResult;
  approveClaim: (claimID: string) => void;
  declineClaim: (claimID: string) => void;
  addItem: (input: NewItemInput) => Item;
  removeItem: (itemID: string) => void;
  addNeed: (input: NewNeedInput) => Need;
  removeNeed: (needID: string) => void;
  resetDemo: () => void;
}

const EMPTY_FILTERS: Filters = { schoolID: null, category: null, condition: null };

function nextID(prefix: string, existing: string[]): string {
  const max = existing.reduce((m, id) => Math.max(m, Number.parseInt(id.replace(/\D/gu, ''), 10) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

function syncNeedStatus(needs: Need[], claims: Claim[], needID: string | null): Need[] {
  if (!needID) return needs;
  return needs.map((n) => {
    if (n.need_id !== needID) return n;
    return { ...n, status: coveredQuantity(n, claims) >= n.quantity ? 'fulfilled' : 'open' };
  });
}

export const useExchangeStore = create<ExchangeState>()(
  persist(
    (set, get) => ({
      schools: SEED_SCHOOLS,
      items: SEED_ITEMS,
      needs: SEED_NEEDS,
      claims: [],
      activeSchoolID: 'S01',
      filters: EMPTY_FILTERS,

      setActiveSchool: (schoolID) => set({ activeSchoolID: schoolID }),
      setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
      clearFilters: () => set({ filters: EMPTY_FILTERS }),

      claimItem: ({ itemID, quantity, needID }) => {
        const { items, needs, claims, activeSchoolID } = get();
        const item = items.find((i) => i.item_id === itemID);
        if (!item) return { ok: false, error: 'This listing no longer exists.' };
        if (item.school_id === activeSchoolID) return { ok: false, error: "This is your own school's listing." };
        if (!Number.isInteger(quantity) || quantity < 1) return { ok: false, error: 'Enter a whole number of 1 or more.' };
        if (item.status === 'submitted') return { ok: false, error: 'This listing is still under review.' };
        if (item.status !== 'available' || item.quantity < 1) return { ok: false, error: 'All of this item has been claimed.' };
        if (quantity > item.quantity) {
          return { ok: false, error: `Only ${item.quantity} ${pluralUnit(item.unit, item.quantity)} available.` };
        }
        const need = needID ? needs.find((n) => n.need_id === needID && n.school_id === activeSchoolID) : undefined;

        const claim: Claim = {
          claim_id: nextID('C', claims.map((c) => c.claim_id)),
          item_id: item.item_id,
          from_school_id: item.school_id,
          to_school_id: activeSchoolID,
          need_id: need ? need.need_id : null,
          quantity,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        const nextClaims = [claim, ...claims];
        const left = item.quantity - quantity;
        set({
          claims: nextClaims,
          items: items.map((i) =>
            i.item_id === itemID ? { ...i, quantity: left, status: left === 0 ? 'claimed' : 'available' } : i,
          ),
          needs: syncNeedStatus(needs, nextClaims, claim.need_id),
        });
        return { ok: true, claim };
      },

      approveClaim: (claimID) =>
        set((s) => ({ claims: s.claims.map((c) => (c.claim_id === claimID ? { ...c, status: 'approved' } : c)) })),

      declineClaim: (claimID) => {
        const { claims, items, needs } = get();
        const claim = claims.find((c) => c.claim_id === claimID);
        if (!claim || claim.status !== 'pending') return;
        const nextClaims = claims.map((c) => (c.claim_id === claimID ? { ...c, status: 'declined' as const } : c));
        set({
          claims: nextClaims,
          items: items.map((i) =>
            i.item_id === claim.item_id ? { ...i, quantity: i.quantity + claim.quantity, status: 'available' } : i,
          ),
          needs: syncNeedStatus(needs, nextClaims, claim.need_id),
        });
      },

      addItem: (input) => {
        const { items } = get();
        const id = nextID('I', items.map((i) => i.item_id));
        const item: Item = { ...input, item_id: id, status: 'submitted' };
        set({ items: [item, ...items] });
        return item;
      },

      removeItem: (itemID) => set((s) => ({ items: s.items.filter((i) => i.item_id !== itemID) })),

      addNeed: (input) => {
        const { needs, activeSchoolID } = get();
        const id = nextID('N', needs.map((n) => n.need_id));
        const need: Need = { ...input, need_id: id, school_id: activeSchoolID, status: 'open' };
        set({ needs: [need, ...needs] });
        return need;
      },

      removeNeed: (needID) => set((s) => ({ needs: s.needs.filter((n) => n.need_id !== needID) })),

      resetDemo: () =>
        set({ schools: SEED_SCHOOLS, items: SEED_ITEMS, needs: SEED_NEEDS, claims: [], filters: EMPTY_FILTERS }),
    }),
    {
      name: 'resourcewise-exchange',
      // v2 reloads the attached seed data unchanged, discarding earlier test claims.
      version: 2,
      migrate: () => ({
        schools: SEED_SCHOOLS,
        items: SEED_ITEMS,
        needs: SEED_NEEDS,
        claims: [],
        activeSchoolID: 'S01',
        filters: EMPTY_FILTERS,
      }),
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

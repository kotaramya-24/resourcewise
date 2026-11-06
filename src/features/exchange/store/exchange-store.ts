import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SEED_ITEMS, SEED_NEEDS, SEED_SCHOOLS } from '@/features/exchange/data/seed';
import { SCHOOL_STAFF } from '@/features/exchange/data/staff';
import type {
  Claim,
  ClaimResult,
  ConfirmResult,
  Filters,
  Item,
  Need,
  School,
  VerifyResult,
} from '@/features/exchange/types/exchange';
import { coveredQuantity } from '@/features/exchange/utils/match';
import { pluralUnit } from '@/features/exchange/utils/labels';
import { confirmProblems, isClaimable } from '@/features/exchange/utils/review';
import { availableQuantity } from '@/features/exchange/utils/transfer';
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
  verifyHandoff: (claimID: string) => VerifyResult;
  addItem: (input: NewItemInput) => Item;
  confirmItem: (itemID: string, approver: string) => ConfirmResult;
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

function restoreHeldStock(state: ExchangeState): ExchangeState {
  const items = state.items.map((item) => {
    const held = state.claims
      .filter((c) => c.item_id === item.item_id && c.status !== 'declined')
      .reduce((sum, c) => sum + c.quantity, 0);
    if (held === 0) return item;
    const status = item.status === 'claimed' ? (item.confirmed_by ? 'confirmed' : 'available') : item.status;
    return { ...item, quantity: item.quantity + held, status };
  });
  return { ...state, items };
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
        const available = availableQuantity(item, claims);
        if (!isClaimable(item) || available === 0) return { ok: false, error: 'Nothing is left to claim on this listing.' };
        if (quantity > available) {
          return { ok: false, error: `Only ${available} ${pluralUnit(item.unit, available)} available. Lower the amount.` };
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
        // A claim only holds stock. The listing's quantity drops once both schools verify the handoff.
        const nextClaims = [claim, ...claims];
        set({ claims: nextClaims, needs: syncNeedStatus(needs, nextClaims, claim.need_id) });
        return { ok: true, claim };
      },

      approveClaim: (claimID) =>
        set((s) => ({
          claims: s.claims.map((c) => (c.claim_id === claimID && c.status === 'pending' ? { ...c, status: 'approved' } : c)),
        })),

      declineClaim: (claimID) => {
        const { claims, items, needs } = get();
        const claim = claims.find((c) => c.claim_id === claimID);
        if (!claim || claim.status !== 'pending') return;
        const nextClaims = claims.map((c) => (c.claim_id === claimID ? { ...c, status: 'declined' as const } : c));
        set({ claims: nextClaims, items, needs: syncNeedStatus(needs, nextClaims, claim.need_id) });
      },

      verifyHandoff: (claimID) => {
        const { claims, items, activeSchoolID } = get();
        const claim = claims.find((c) => c.claim_id === claimID);
        if (!claim) return { ok: false, error: 'This handoff no longer exists.' };
        if (claim.status !== 'approved') return { ok: false, error: 'Only approved handoffs can be verified.' };
        const giving = claim.from_school_id === activeSchoolID;
        const receiving = claim.to_school_id === activeSchoolID;
        if (!giving && !receiving) return { ok: false, error: 'Only the two schools in this handoff can verify it.' };
        const verifier = SCHOOL_STAFF[activeSchoolID]?.approver ?? activeSchoolID;
        const marked: Claim = {
          ...claim,
          from_verified_by: giving ? verifier : claim.from_verified_by,
          to_verified_by: receiving ? verifier : claim.to_verified_by,
        };
        if (!marked.from_verified_by || !marked.to_verified_by) {
          set({ claims: claims.map((c) => (c.claim_id === claimID ? marked : c)) });
          return { ok: true, transferred: false };
        }
        const item = items.find((i) => i.item_id === claim.item_id);
        if (!item) return { ok: false, error: 'This listing no longer exists.' };
        if (claim.quantity > item.quantity) {
          return { ok: false, error: `Only ${item.quantity} ${pluralUnit(item.unit, item.quantity)} left on the listing.` };
        }
        const done: Claim = { ...marked, status: 'transferred', transferred_at: new Date().toISOString() };
        const left = item.quantity - claim.quantity;
        set({
          claims: claims.map((c) => (c.claim_id === claimID ? done : c)),
          items: items.map((i) =>
            i.item_id === item.item_id ? { ...i, quantity: left, status: left === 0 ? 'transferred' : i.status } : i,
          ),
        });
        return { ok: true, transferred: true };
      },

      addItem: (input) => {
        const { items } = get();
        const id = nextID('I', items.map((i) => i.item_id));
        const item: Item = { ...input, item_id: id, status: 'submitted' };
        set({ items: [item, ...items] });
        return item;
      },

      confirmItem: (itemID, approver) => {
        const { items } = get();
        const item = items.find((i) => i.item_id === itemID);
        if (!item) return { ok: false, errors: ['This listing no longer exists.'] };
        if (item.status !== 'submitted') return { ok: false, errors: ['Only submitted items can be confirmed.'] };
        const errors = confirmProblems(item);
        if (errors.length > 0) return { ok: false, errors };
        set({ items: items.map((i) => (i.item_id === itemID ? { ...i, status: 'confirmed', confirmed_by: approver } : i)) });
        return { ok: true };
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
      // v2 reloaded the attached seed data. v3 stops subtracting stock at claim time, so it puts held units back.
      version: 3,
      migrate: (persisted, version) => {
        if (version === 2 && persisted) return restoreHeldStock(persisted as ExchangeState);
        return {
          schools: SEED_SCHOOLS,
          items: SEED_ITEMS,
          needs: SEED_NEEDS,
          claims: [],
          activeSchoolID: 'S01',
          filters: EMPTY_FILTERS,
        };
      },
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

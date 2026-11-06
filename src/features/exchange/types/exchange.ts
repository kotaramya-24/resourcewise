export type Category = 'paper_writing' | 'books_learning' | 'stem_tech';

export type Condition = 'new' | 'good' | 'usable' | 'needs_repair';

export type ItemStatus = 'submitted' | 'confirmed' | 'available' | 'claimed' | 'transferred';

export type NeedStatus = 'open' | 'fulfilled';

export type ClaimStatus = 'pending' | 'approved' | 'declined' | 'transferred';

export interface School {
  school_id: string;
  name: string;
  type: string;
  region: string;
  resource_level: string;
}

export interface Item {
  item_id: string;
  school_id: string;
  category: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  condition: string;
  photo_file: string;
  status: string;
  confirmed_by?: string;
}

export interface Need {
  need_id: string;
  school_id: string;
  category: string;
  description: string;
  quantity: number;
  min_condition: string;
  needed_by: string;
  status: string;
}

export interface Claim {
  claim_id: string;
  item_id: string;
  from_school_id: string;
  to_school_id: string;
  need_id: string | null;
  quantity: number;
  status: ClaimStatus;
  created_at: string;
  /** Who at the giving school verified the handoff. */
  from_verified_by?: string;
  /** Who at the receiving school verified the handoff. */
  to_verified_by?: string;
  transferred_at?: string;
}

export interface Filters {
  schoolID: string | null;
  category: Category | null;
  condition: Condition | null;
}

export type ConfirmResult = { ok: true } | { ok: false; errors: string[] };

export type ClaimResult = { ok: true; claim: Claim } | { ok: false; error: string };

export type VerifyResult = { ok: true; transferred: boolean } | { ok: false; error: string };

export type MatchKind = 'exact' | 'partial_quantity' | 'partial_condition' | 'awaiting_confirmation' | 'none';

export interface NeedMatch {
  kind: MatchKind;
  item: Item | null;
  /** Units of the item not already held by other claims. */
  available?: number;
  /** Why nothing fits. Set only when kind is 'none'. */
  reason?: string;
}

export type Category = 'paper_writing' | 'books_learning' | 'stem_tech';

export type Condition = 'new' | 'good' | 'usable' | 'needs_repair';

export type ItemStatus = 'submitted' | 'confirmed' | 'available' | 'claimed';

export type NeedStatus = 'open' | 'fulfilled';

export type ClaimStatus = 'pending' | 'approved' | 'declined';

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
}

export interface Filters {
  schoolID: string | null;
  category: Category | null;
  condition: Condition | null;
}

export type ConfirmResult = { ok: true } | { ok: false; errors: string[] };

export type ClaimResult = { ok: true; claim: Claim } | { ok: false; error: string };

export type MatchKind = 'exact' | 'partial_quantity' | 'partial_condition' | 'awaiting_confirmation' | 'none';

export interface NeedMatch {
  kind: MatchKind;
  item: Item | null;
  /** Why nothing fits. Set only when kind is 'none'. */
  reason?: string;
}

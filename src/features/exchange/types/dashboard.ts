import type { Category, Item } from '@/features/exchange/types/exchange';

export interface CategoryUnits {
  category: Category;
  surplus: number;
  need: number;
}

export interface QualityIssue {
  item: Item;
  missingPhoto: boolean;
  duplicateOf: Item[];
}

export interface DashboardStats {
  totalItems: number;
  passingItems: number;
  confirmedItems: number;
  submittedItems: number;
  openNeeds: number;
  matchedNeeds: number;
  units: CategoryUnits[];
  issues: QualityIssue[];
}

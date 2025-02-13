import { Account } from '../../accounts/interfaces';
import { Category } from '../../categories/interfaces';
import { Subcategory } from '../../subcategories/interfaces';

export interface Expense {
  id: number;
  merchant: string;
  date: string;
  total: string;
  tax: string;
  image: string | null;
  notes: string | null;
  createdAt: string;
  updateAt: string | null;
  account?: Account;
  category?: Category;
  subcategory?: Subcategory | null;
  tags: string[];
}

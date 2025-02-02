export interface ExpensesResponse {
  id: number;
  merchant: string;
  date: string;
  total: string;
  tax: string;
  notes: null | string;
  createdAt: string;
  updateAt: string | null;
  account: Account;
  category: Category;
  subcategory: Subcategory | null;
  tags: string[];
}

export interface Account {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  updateAt: null;
  isSystem?: boolean;
  category?: Account;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  updateAt: null;
  isSystem?: boolean;
  category?: Account;
}

export interface Subcategory {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  updateAt: null;
  isSystem?: boolean;
  category?: Account;
}

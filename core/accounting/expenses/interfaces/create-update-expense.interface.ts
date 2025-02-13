export interface CreateUpdateExpense {
  accountId: number;
  categoryId: number;
  date: string;
  id: number;
  image?: string;
  merchant: string;
  notes?: string;
  subcategoryId?: number | null;
  tax: number;
  total: number;
}

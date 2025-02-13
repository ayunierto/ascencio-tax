import { Category } from '../../categories/interfaces';

export interface Subcategory {
  id: number;
  name: string;
  isSystem: boolean;
  createdAt: string;
  updateAt: null | string;
  category?: Category;
  description?: string;
}

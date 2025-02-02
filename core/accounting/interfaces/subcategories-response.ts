import { CategoryResponse } from './categories-response';

export interface SubcategoryResponse {
  id: number;
  name: string;
  isSystem: boolean;
  createdAt: string;
  updateAt: null | string;
  category?: CategoryResponse;
  description?: string;
}

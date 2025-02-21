import { User } from '@/core/auth/interfaces/user';

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  save: string;
  features: string[];
  createdAt: string;
  updatedAt: null | string;
  user: User | null;
}

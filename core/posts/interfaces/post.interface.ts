import { User } from '@/core/auth/interfaces/user';

export interface Post {
  id: number;
  url: string;
  title: string;
  createdAt: string;
  updatedAt: null;
  user: User;
}

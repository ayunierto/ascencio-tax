import { User } from '../auth/interfaces/user';

export interface Log {
  id: string;
  description: string;
  date: string;
  user: User;
}

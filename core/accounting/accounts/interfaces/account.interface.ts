import { User } from '@/core/auth/interfaces/user';
import { AccountType } from '../../accounts-types/interfaces';
import { Currency } from '../../currencies/interfaces';

export interface Account {
  id: number;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  currency: Currency;
  accountType: AccountType;
  user: User;
}
